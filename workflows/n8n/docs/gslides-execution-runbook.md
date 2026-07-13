# Native Google Slides / Docs — execution runbook

Novagentica decks and documents can be produced as **native Google Slides / Google Docs** (not
`.pptx`/`.docx`). The split of responsibility:

- **genservice** turns a brief into a Google API **`batchUpdate` payload** (JSON). It calls no
  Google API and holds no Google credentials — it stays stateless and auth-free.
- **n8n** owns the Google credentials and does the two API calls that actually create the file.

```
brief (engagement.json)
      │  POST /generate/gslides/<name>   (Bearer $NVG_TOKEN)
      ▼
genservice ──► { title, slideCount, requests: [ …batchUpdate requests… ] }
      │
      ▼  n8n (Google OAuth2 / service account)
  1. slides.presentations.create      { title }                 ──► presentationId, slides[0].objectId
  2. slides.presentations.batchUpdate { presentationId, requests: [deleteDefaultSlide, …requests] }
  (3. optional) drive.files.update     move presentationId into the target Drive folder
```

Endpoints live today:
- Slides (native): `POST /generate/gslides/{execsummary,timeline,proposaldeck,summary}`
- Docs (native): `POST /generate/gdocs/proposal` (SoW / Gantt / order forms pending — see `HANDOFF-native-google.md`)

## n8n wiring (per deck)

1. **HTTP Request → genservice.** `POST {{genservice}}/generate/gslides/execsummary`,
   header `Authorization: Bearer {{$env.NVG_TOKEN}}`, body `{ "brief": {{engagement.json}} }`.
   Response is the payload JSON. A `422` means preflight refusal — surface the questions, don't fabricate.
2. **Create the presentation.** `POST https://slides.googleapis.com/v1/presentations` with
   `{ "title": {{$json.title}} }`. Keep `presentationId` and `slides[0].objectId` (the default slide).
3. **Delete the default slide, then apply the deck.** A freshly created presentation already has
   one blank slide; the payload adds `slideCount` more. Prepend a `deleteObject` so the deck is
   exactly `slideCount` slides:
   ```
   POST https://slides.googleapis.com/v1/presentations/{{presentationId}}:batchUpdate
   {
     "requests": [
       { "deleteObject": { "objectId": "{{slides[0].objectId}}" } },
       ...{{$json.requests}}
     ]
   }
   ```
4. **(Optional) File it.** `PATCH https://www.googleapis.com/drive/v3/files/{{presentationId}}?addParents=<folderId>`
   to move it into the client's Drive folder. Share/permissions via the Drive API as needed.

### Credentials / scopes
- OAuth2 or a **service account** with `https://www.googleapis.com/auth/presentations` and
  `https://www.googleapis.com/auth/drive.file`. Store in n8n credentials — never in genservice.
- A service account creates files it owns; add a Drive share (or use a Shared Drive) so humans can edit.

### Google Docs (order forms, SoW) — same shape
The Docs API is the analogue: `documents.create { title }` → `documents.batchUpdate { requests }`.
A `lib/gdocs.js` request-builder (documents.batchUpdate: `insertText`, `updateTextStyle`,
`updateParagraphStyle`, `insertTable`) mirrors `lib/gslides.js`; the Docs generators
(`build_of_ps`, `build_of_subscription`, `build_sow`) convert with the same recipe below.

## Converting the remaining generators

`lib/gslides.js` + `build_execsummary_gslides.js` are the reference. To convert another deck
(e.g. `build_summary6`, `build_timeline`, `build_proposaldeck`):

1. Copy the pptx generator to `build_<name>_gslides.js`; keep the spine parsing and derived-number
   code **unchanged** (same commercial source of truth).
2. Replace the pptxgenjs surface with the `Deck` primitives — they are 1:1:
   | pptxgenjs | `lib/gslides.js` |
   |---|---|
   | `p.addSlide(); s.background={color}` | `deck.slide(color)` → slideId |
   | `s.addText(text, {x,y,w,h,fontFace,bold,italic,fontSize,color,align,valign})` | `deck.textBox(id, runs, {x,y,w,h,font,size,bold,italic,color,align,valign})` |
   | `s.addShape(rect, {x,y,w,h,fill,line})` | `deck.rect(id, {x,y,w,h,fill,line})` |
   | `s.addShape(line, {x,y,w,line})` | `deck.line(id, {x,y,w,color,weight})` |
   | multi-run `[{text,options:{bold,color,fontSize}}]` | same array shape into `deck.textBox` |
   Positions stay in **inches** (the lib converts to EMU). Colours/fonts come from `lib/brand.js`.
3. End with `deck.payload()` → write JSON to `process.argv[3]` (or stdout), like the reference.
4. Add a `/generate/gslides/<name>` route in `genservice/server.js` (one line, using `generateGslides`).
5. Extend `_gslides_selftest.js` (or clone it) so the new deck is validated: on-brand colours,
   on-canvas positions, spine text present. Run `node _gslides_selftest.js` — must stay green.

### Known limitations vs `.pptx`
The Slides API cannot reproduce every pptx nicety 1:1. Track these when converting:
- **Fonts** render only if Inter / Georgia are available to the viewing account (install as Google
  Fonts / brand fonts); otherwise Slides substitutes. `.pptx` embeds them.
- **Paragraph spacing / line-spacing** and fine text metrics differ — expect minor reflow; verify
  each converted deck visually once against the pptx.
- **`valign` inside a text box** maps to `contentAlignment`; multi-column exact positioning is by
  absolute boxes (as in the reference), not layout placeholders.
