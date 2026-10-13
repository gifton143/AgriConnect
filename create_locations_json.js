
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "data");
const excelPath = path.join(dataDir, "new tamilnadu areas.xlsx");
const outputPath = path.join(dataDir, "locations.json");

if (!fs.existsSync(excelPath)) {
  console.error("Excel file not found:", excelPath);
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const english = {};
const tamil = {};

for (const row of rows) {
  const districtEN = String(row.District_EN || "").trim();
  const districtTA = String(row.District_TA || "").trim();
  const talukEN = String(row.Taluk_EN || "").trim();
  const talukTA = String(row.Taluk_TA || "").trim();
  const villageEN = String(row.Village_EN || "").trim();
  const villageTA = String(row.Village_TA || "").trim();

  if (!districtEN || !talukEN || !villageEN) continue;

  english[districtEN] ??= {};
  english[districtEN][talukEN] ??= [];

  if (!english[districtEN][talukEN].includes(villageEN)) {
    english[districtEN][talukEN].push(villageEN);
  }

  tamil[districtEN] ??= {};
  tamil[districtEN][talukEN] ??= {};

  tamil[districtEN][talukEN][villageEN] = {
    district: districtTA,
    taluk: talukTA,
    village: villageTA
  };
}

for (const district of Object.keys(english)) {
  for (const taluk of Object.keys(english[district])) {
    english[district][taluk].sort((a, b) => a.localeCompare(b));
  }
}

fs.writeFileSync(
  outputPath,
  JSON.stringify({ english, tamil }),
  "utf8"
);

console.log("Location JSON created successfully!");
console.log("Districts:", Object.keys(english).length);
console.log("Excel rows:", rows.length);
console.log("Output:", outputPath);
