const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==================================================
// SERVE AGRICONNECT FILES FROM PROJECT ROOT
// ==================================================

app.use(express.static(__dirname));

// ==================================================
// EXCEL FILE
// ==================================================

const excelPath = path.join(
    __dirname,
    "data",
    "new tamilnadu areas.xlsx"
);

console.log("");
console.log("Reading AgriConnect Excel...");
console.log("Excel file:", excelPath);
console.log("");

// ==================================================
// LOAD EXCEL
// ==================================================

let workbook;

try {
    workbook = XLSX.readFile(excelPath);
} catch (error) {
    console.error("");
    console.error("================================");
    console.error("❌ EXCEL FILE NOT FOUND");
    console.error("================================");
    console.error("");
    console.error(excelPath);
    console.error("");
    console.error(error.message);
    process.exit(1);
}

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: ""
});

console.log("Sheet:", sheetName);
console.log("Excel rows:", rows.length);

// ==================================================
// LOCATION DATA
// ==================================================

const locations = {};
const tamilLocations = {};

// ==================================================
// READ EXCEL ROWS
// ==================================================

rows.forEach((row) => {

    const districtEN =
        String(row.District_EN || "").trim();

    const districtTA =
        String(row.District_TA || "").trim();

    const talukEN =
        String(row.Taluk_EN || "").trim();

    const talukTA =
        String(row.Taluk_TA || "").trim();

    const villageEN =
        String(row.Village_EN || "").trim();

    const villageTA =
        String(row.Village_TA || "").trim();

    if (
        !districtEN ||
        !talukEN ||
        !villageEN
    ) {
        return;
    }

    // ------------------------------
    // English structure
    // ------------------------------

    if (!locations[districtEN]) {
        locations[districtEN] = {};
    }

    if (!locations[districtEN][talukEN]) {
        locations[districtEN][talukEN] = new Set();
    }

    locations[districtEN][talukEN].add(villageEN);

    // ------------------------------
    // Tamil mapping
    // ------------------------------

    if (!tamilLocations[districtEN]) {
        tamilLocations[districtEN] = {};
    }

    if (!tamilLocations[districtEN][talukEN]) {
        tamilLocations[districtEN][talukEN] = {};
    }

    tamilLocations[districtEN][talukEN][villageEN] = {
        district: districtTA,
        taluk: talukTA,
        village: villageTA
    };
});

// ==================================================
// SET → ARRAY
// ==================================================

Object.keys(locations).forEach((district) => {

    Object.keys(locations[district]).forEach((taluk) => {

        locations[district][taluk] =
            Array.from(
                locations[district][taluk]
            ).sort((a, b) =>
                a.localeCompare(b)
            );
    });
});

// ==================================================
// HOME PAGE
// ==================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "buyer.html")
    );
});

// ==================================================
// DISTRICTS
// ==================================================

app.get("/api/districts", (req, res) => {

    const districts =
        Object.keys(locations)
            .sort((a, b) =>
                a.localeCompare(b)
            );

    res.json(districts);
});

// ==================================================
// TALUKS
// ==================================================

app.get("/api/taluks", (req, res) => {

    const district =
        String(
            req.query.district || ""
        ).trim();

    if (!district) {
        return res.json([]);
    }

    if (!locations[district]) {
        return res.json([]);
    }

    const taluks =
        Object.keys(
            locations[district]
        ).sort((a, b) =>
            a.localeCompare(b)
        );

    res.json(taluks);
});

// ==================================================
// VILLAGES
// ==================================================

app.get("/api/villages", (req, res) => {

    const district =
        String(
            req.query.district || ""
        ).trim();

    const taluk =
        String(
            req.query.taluk || ""
        ).trim();

    if (
        !district ||
        !taluk
    ) {
        return res.json([]);
    }

    if (
        !locations[district] ||
        !locations[district][taluk]
    ) {
        return res.json([]);
    }

    res.json(
        locations[district][taluk]
    );
});

// ==================================================
// TAMIL LOCATION
// ==================================================

app.get(
    "/api/location-tamil",
    (req, res) => {

        const district =
            String(
                req.query.district || ""
            ).trim();

        const taluk =
            String(
                req.query.taluk || ""
            ).trim();

        const village =
            String(
                req.query.village || ""
            ).trim();

        if (
            !district ||
            !taluk ||
            !village
        ) {
            return res.json(null);
        }

        const result =
            tamilLocations
                ?. [district]
                ?. [taluk]
                ?. [village]
            || null;

        res.json(result);
    }
);

// ==================================================
// COMPLETE LOCATION MAP
// ==================================================

app.get(
    "/api/location-map",
    (req, res) => {

        res.json(tamilLocations);
    }
);

// ==================================================
// COMPLETE LOCATION DATA
// ==================================================

app.get(
    "/api/locations",
    (req, res) => {

        res.json({
            english: locations,
            tamil: tamilLocations
        });
    }
);

// ==================================================
// TEST
// ==================================================

app.get(
    "/api/test",
    (req, res) => {

        res.json({
            success: true,
            message: "AgriConnect server is working",
            rows: rows.length,
            districts:
                Object.keys(locations).length,
            excel:
                path.basename(excelPath),
            tamilMapping: "READY"
        });
    }
);

// ==================================================
// HEALTH
// ==================================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({
            status: "OK",
            server: "AgriConnect",
            port: PORT,
            excelRows: rows.length,
            districts:
                Object.keys(locations).length
        });
    }
);

// ==================================================
// START SERVER
// ==================================================
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "buyer.html")
    );
});
app.listen(
    PORT,
    () => {

        console.log("");
        console.log("================================");
        console.log("       AGRICONNECT SERVER");
        console.log("================================");
        console.log(
            `Running: http://localhost:${PORT}`
        );
        console.log(
            `Excel rows: ${rows.length}`
        );
        console.log(
            `Districts: ${
                Object.keys(locations).length
            }`
        );
        console.log("Tamil mapping: READY");
        console.log("================================");
        console.log("");
    }
);