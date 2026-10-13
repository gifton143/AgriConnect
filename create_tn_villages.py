import requests
import csv
from io import StringIO
from openpyxl import Workbook

CSV_URL = (
    "https://raw.githubusercontent.com/"
    "mchittineni/india-village-finder/main/"
    "tamil_nadu/data/tamil_nadu_villages.csv"
)

OUTPUT_FILE = "Tamil_Nadu_District_Taluk_Village.xlsx"

print("=" * 60)
print("Tamil Nadu District → Taluk → Village")
print("=" * 60)

print("\nDownloading Tamil Nadu village data...")

try:
    response = requests.get(CSV_URL, timeout=60)
    response.raise_for_status()
except Exception as e:
    print("\nDownload failed!")
    print(e)
    print("\nCheck your internet connection and try again.")
    raise SystemExit

print("Download completed.")

text = response.content.decode("utf-8-sig")

reader = csv.DictReader(StringIO(text))

rows = []

for row in reader:

    district = (row.get("District") or "").strip()

    # Dataset uses Mandal for Tamil Nadu sub-district/taluk
    taluk = (row.get("Mandal") or "").strip()

    village = (row.get("Village") or "").strip()

    if district and taluk and village:
        rows.append([
            district,
            taluk,
            village
        ])

print(f"\nRecords found: {len(rows)}")

if not rows:
    print("No village records found.")
    raise SystemExit

# --------------------------------------------------
# Remove exact duplicate rows
# --------------------------------------------------

rows = list(dict.fromkeys(
    (district, taluk, village)
    for district, taluk, village in rows
))

print(f"After removing duplicates: {len(rows)}")

# --------------------------------------------------
# Sort District → Taluk → Village
# --------------------------------------------------

rows.sort(
    key=lambda x: (
        x[0].lower(),
        x[1].lower(),
        x[2].lower()
    )
)

# --------------------------------------------------
# Create Excel
# --------------------------------------------------

print("\nCreating Excel file...")

wb = Workbook()

ws = wb.active
ws.title = "District Taluk Village"

# Header
ws.append([
    "District",
    "Taluk",
    "Village"
])

# Data
for row in rows:
    ws.append(row)

# Freeze header
ws.freeze_panes = "A2"

# Filter
ws.auto_filter.ref = ws.dimensions

# Column widths
ws.column_dimensions["A"].width = 25
ws.column_dimensions["B"].width = 30
ws.column_dimensions["C"].width = 40

# Save
wb.save(OUTPUT_FILE)

print("\n" + "=" * 60)
print("DONE! 🎉")
print("=" * 60)
print(f"Total records: {len(rows)}")
print(f"Excel file: {OUTPUT_FILE}")
print("=" * 60)