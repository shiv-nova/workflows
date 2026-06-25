// Hensoldt deal override: re-exports the canonical brand kit, but swaps the
// generic addressBlock() for the Hensoldt supplier/customer block. All legal
// scaffolding and commercial constants remain sourced from the canonical helpers.
const base = require("../../scripts/nvg_helpers.js");
const { T, TableRow, table, tc, cellPara } = base;

function addressBlock() {
  const supplier = tc([
    cellPara([{ text: "Supplier", bold: true, color: T.CRIMSON, size: 16 }]),
    cellPara([{ text: "Novagentica AG", bold: true }]),
    cellPara("Chläusjägergasse 8"),
    cellPara("CH-6403 Küssnacht am Rigi, Switzerland"),
    cellPara([{ text: "Reg. no. CH-020.3.051.524-2", size: 16, color: T.GREY }]),
  ], { w: T.HALF });
  const customer = tc([
    cellPara([{ text: "Customer", bold: true, color: T.CRIMSON, size: 16 }]),
    cellPara([{ text: "HENSOLDT AG", bold: true }]),
    cellPara("Willy-Messerschmitt-Strasse 3"),
    cellPara("82024 Taufkirchen, Germany"),
    cellPara([{ text: "Attn.: André Scheidhammer, Chief Information Officer", size: 16, color: T.GREY }]),
  ], { w: T.HALF });
  return table([T.HALF, T.HALF], [new TableRow({ children: [supplier, customer] })]);
}

module.exports = Object.assign({}, base, { addressBlock });
