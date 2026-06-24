#!/usr/bin/env python3
"""Render the Decision Memo markdown into a Novagentica-branded A4 DOCX."""
import sys, re
from docx import Document
from docx.shared import Pt, RGBColor, Mm, Twips
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

# ---- brand tokens ----
BG_LIGHT="FAFBF6"; INK="0E0E0C"; INK_SOFT="5C5C58"; MUTED="8A8A86"
RULE="D9D9D2"; ACCENT="CC0D2C"; CRIMSON_LIGHT="F5C6CE"; TINT="FBE3E7"
INTER="Inter"; GEORGIA="Georgia"
def rgb(h): return RGBColor(int(h[0:2],16),int(h[2:4],16),int(h[4:6],16))

src, out = sys.argv[1], sys.argv[2]
lines = open(src,encoding="utf-8").read().split("\n")

doc = Document()
# A4 portrait + margins
sec = doc.sections[0]
sec.page_width, sec.page_height = Mm(210), Mm(297)
sec.top_margin=Mm(22); sec.bottom_margin=Mm(20); sec.left_margin=Mm(22); sec.right_margin=Mm(22)

# default style: Georgia 11 ink-soft
st = doc.styles["Normal"]
st.font.name="Georgia"; st.font.size=Pt(11); st.font.color.rgb=rgb(INK_SOFT)
st.paragraph_format.space_after=Pt(6); st.paragraph_format.line_spacing=1.18

# cream page background
bg = OxmlElement("w:background"); bg.set(qn("w:color"), BG_LIGHT)
doc.element.insert(0, bg)
disp = OxmlElement("w:displayBackgroundShape")
doc.settings.element.append(disp)

def shade(cell,color):
    tcPr=cell._tc.get_or_add_tcPr(); sh=OxmlElement("w:shd")
    sh.set(qn("w:val"),"clear"); sh.set(qn("w:fill"),color); tcPr.append(sh)

def set_cell_margins(cell):
    tcPr=cell._tc.get_or_add_tcPr(); m=OxmlElement("w:tcMar")
    for tag,w in (("top",60),("bottom",60),("start",90),("end",90)):
        e=OxmlElement(f"w:{tag}"); e.set(qn("w:w"),str(w)); e.set(qn("w:type"),"dxa"); m.append(e)
    tcPr.append(m)

def add_runs(p, text, base_color=INK_SOFT, base_font=GEORGIA, size=11):
    """Parse **bold** and *italic* inline; bold renders ink, others base."""
    for seg in re.split(r"(\*\*.+?\*\*|\*[^*]+?\*)", text):
        if not seg: continue
        r=p.add_run()
        if seg.startswith("**") and seg.endswith("**"):
            r.text=seg[2:-2]; r.bold=True; r.font.color.rgb=rgb(INK)
        elif seg.startswith("*") and seg.endswith("*"):
            r.text=seg[1:-1]; r.italic=True; r.font.color.rgb=rgb(base_color)
        else:
            r.text=seg; r.font.color.rgb=rgb(base_color)
        r.font.name=base_font; r.font.size=Pt(size)

def para_rule(p, color=RULE, sz=6):
    pPr=p._p.get_or_add_pPr(); pbdr=OxmlElement("w:pBdr"); b=OxmlElement("w:bottom")
    b.set(qn("w:val"),"single"); b.set(qn("w:sz"),str(sz)); b.set(qn("w:space"),"6"); b.set(qn("w:color"),color)
    pbdr.append(b); pPr.append(pbdr)

def emit_table(rows):
    header=[c.strip() for c in rows[0]]
    body=[[c.strip() for c in r] for r in rows[2:]]  # skip |---| separator
    t=doc.add_table(rows=1, cols=len(header)); t.alignment=WD_TABLE_ALIGNMENT.CENTER
    t.autofit=True
    # header
    for i,h in enumerate(header):
        cell=t.rows[0].cells[i]; shade(cell,ACCENT); set_cell_margins(cell)
        cell.paragraphs[0].paragraph_format.space_after=Pt(0)
        add_runs(cell.paragraphs[0], h, base_color="FFFFFF", base_font=INTER, size=9)
        for rr in cell.paragraphs[0].runs: rr.bold=True
    # body
    for bi,br in enumerate(body):
        cells=t.add_row().cells
        rowfill = TINT if (br and br[0].lower().startswith(("**null","null"))) else None
        for i,val in enumerate(br):
            if i>=len(cells): break
            set_cell_margins(cells[i])
            if rowfill: shade(cells[i],rowfill)
            cells[i].paragraphs[0].paragraph_format.space_after=Pt(0)
            add_runs(cells[i].paragraphs[0], val, base_color=INK_SOFT, base_font=GEORGIA, size=9.5)
    doc.add_paragraph().paragraph_format.space_after=Pt(2)

# ---- footer: crimson top rule + two-tone wordmark + page number ----
footer = sec.footer
fp = footer.paragraphs[0]; fp.text=""
para_rule(fp, color=ACCENT, sz=8)
r1=fp.add_run("nova"); r1.font.name=INTER; r1.bold=True; r1.font.size=Pt(9); r1.font.color.rgb=rgb(INK)
r2=fp.add_run("gentica"); r2.font.name=INTER; r2.bold=True; r2.font.size=Pt(9); r2.font.color.rgb=rgb(ACCENT)
r3=fp.add_run("    ·    Confidential — internal decision record"); r3.font.name=INTER; r3.font.size=Pt(8); r3.font.color.rgb=rgb(MUTED)
fp.add_run("\t")
# page number field — fldSimple must be a paragraph-level child, not a run child
fp.paragraph_format.tab_stops.add_tab_stop(Twips(int(sec.page_width.twips - sec.left_margin.twips - sec.right_margin.twips)), WD_ALIGN_PARAGRAPH.RIGHT)
fld=OxmlElement("w:fldSimple"); fld.set(qn("w:instr")," PAGE ")
fr=OxmlElement("w:r"); rpr=OxmlElement("w:rPr")
rf=OxmlElement("w:rFonts"); rf.set(qn("w:ascii"),INTER); rf.set(qn("w:hAnsi"),INTER); rpr.append(rf)
col=OxmlElement("w:color"); col.set(qn("w:val"),MUTED); rpr.append(col)
szp=OxmlElement("w:sz"); szp.set(qn("w:val"),"16"); rpr.append(szp)
fr.append(rpr); ft=OxmlElement("w:t"); ft.text="1"; fr.append(ft); fld.append(fr)
fp._p.append(fld)

# ---- body parse ----
i=0; tbl=[]
def flush_tbl():
    global tbl
    if tbl: emit_table(tbl); tbl=[]

for raw in lines:
    line=raw.rstrip()
    if line.startswith("|"):
        tbl.append([c for c in line.strip().strip("|").split("|")]); continue
    else:
        flush_tbl()
    if not line.strip():
        continue
    if line.startswith("# "):
        p=doc.add_paragraph(); p.paragraph_format.space_after=Pt(10); p.paragraph_format.space_before=Pt(2)
        add_runs(p, line[2:], base_color=ACCENT, base_font=INTER, size=17)
        for r in p.runs: r.bold=True; r.font.color.rgb=rgb(ACCENT)
    elif line.startswith("## "):
        p=doc.add_paragraph(); p.paragraph_format.space_before=Pt(12); p.paragraph_format.space_after=Pt(4)
        add_runs(p, line[3:], base_color=INK, base_font=INTER, size=13)
        for r in p.runs: r.bold=True; r.font.color.rgb=rgb(INK)
    elif line.strip()=="---":
        p=doc.add_paragraph(); para_rule(p, color=RULE, sz=6); p.paragraph_format.space_after=Pt(2)
    elif line.strip()=="*novagentica*":
        continue  # wordmark lives in the footer
    elif line.startswith("- "):
        p=doc.add_paragraph(style="List Bullet"); p.paragraph_format.space_after=Pt(3)
        add_runs(p, line[2:], base_color=INK_SOFT, base_font=GEORGIA, size=10.5)
    else:
        p=doc.add_paragraph(); add_runs(p, line, base_color=INK_SOFT, base_font=GEORGIA, size=11)

doc.save(out)
print("wrote", out)
