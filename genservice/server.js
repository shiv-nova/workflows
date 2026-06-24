// nvg-genservice — thin HTTP wrapper over the CANONICAL Novagentica generators.
// It does not re-implement any rendering: it writes the brief to a temp dir, spawns
// the real generator script (the same code the claude.ai skills use), and streams the
// produced .pptx/.docx back. One source of truth; n8n orchestrates, this renders.

const express = require("express");
const { execFile } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const app = express();
app.use(express.json({ limit: "4mb" }));

const ROOT = __dirname;
const TOKEN = process.env.NVG_TOKEN || "dev-token";

function auth(req, res, next) {
  if ((req.get("authorization") || "") !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

function runGenerator(scriptRel, args, cwd) {
  return new Promise((resolve, reject) => {
    execFile(
      "node",
      [path.join(ROOT, scriptRel), ...args],
      { cwd, maxBuffer: 64 * 1024 * 1024, env: { ...process.env } },
      (err, stdout, stderr) => (err ? reject(new Error(stderr || err.message)) : resolve({ stdout, stderr }))
    );
  });
}

function newestWithExt(dir, ext) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(ext));
  if (!files.length) return null;
  return files
    .map((f) => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t)[0].f;
}

async function generate(res, { scriptRel, briefRequired, body, ext, contentType }) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nvg-"));
  try {
    const args = [];
    if (briefRequired) {
      if (!body || !body.brief) return res.status(400).json({ error: "brief required in body.brief" });
      const bp = path.join(tmp, "brief.json");
      fs.writeFileSync(bp, JSON.stringify(body.brief));
      args.push(bp);
    }
    const { stderr } = await runGenerator(scriptRel, args, tmp);
    const out = newestWithExt(tmp, ext);
    if (!out) {
      // preflight refusal is a feature: generator exits cleanly, writes nothing, prints questions
      return res.status(422).json({
        error: "no artefact produced — preflight refusal or generator gap",
        detail: (stderr || "").slice(0, 4000),
      });
    }
    const buf = fs.readFileSync(path.join(tmp, out));
    res.set("Content-Type", contentType);
    res.set("Content-Disposition", `attachment; filename="${out}"`);
    res.set("X-Nvg-Filename", out);
    return res.send(buf);
  } catch (e) {
    const msg = String(e.message || e);
    if (/Refusing to generate/i.test(msg)) {
      return res.status(422).json({ error: "preflight refusal — answer the questions, do not fabricate", detail: msg.slice(0, 4000) });
    }
    return res.status(500).json({ error: msg.slice(0, 4000) });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

app.get("/health", (_req, res) =>
  res.json({
    ok: true,
    service: "nvg-genservice",
    canonical: ["summary", "timeline", "sow", "orderform/subscription", "orderform/ps"],
    pending: ["proposal", "addendum", "gantt", "execsummary", "proposaldeck"],
  })
);

// canonical today (v2 reconcile-based / approved templates)
app.post("/generate/summary", auth, (req, res) =>
  generate(res, { scriptRel: "generators/build_summary6.js", briefRequired: true, body: req.body, ext: ".pptx", contentType: PPTX })
);
app.post("/generate/timeline", auth, (req, res) =>
  generate(res, { scriptRel: "generators/build_timeline.js", briefRequired: true, body: req.body, ext: ".pptx", contentType: PPTX })
);
app.post("/generate/orderform/subscription", auth, (req, res) =>
  generate(res, { scriptRel: "orderforms/build_of_subscription.js", briefRequired: false, ext: ".docx", contentType: DOCX })
);
app.post("/generate/orderform/ps", auth, (req, res) =>
  generate(res, { scriptRel: "orderforms/build_of_ps.js", briefRequired: false, ext: ".docx", contentType: DOCX })
);
app.post("/generate/sow", auth, (req, res) =>
  generate(res, { scriptRel: "generators/build_sow.js", briefRequired: true, body: req.body, ext: ".docx", contentType: DOCX })
);

// pending Step-2 generator conversions (build_sow / build_proposal onto lib+reconcile):
// app.post("/generate/sow", ...)  app.post("/generate/proposal", ...)  app.post("/generate/addendum", ...)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`nvg-genservice listening on :${PORT}`));
