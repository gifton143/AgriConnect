import os
import re
import requests
import pdfplumber
from openpyxl import Workbook

PDF_URL = "https://www.tnrd.tn.gov.in/databases/dist_blk_vill_hab_tamil_new.pdf"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PDF_FILE = os.path.join(
    BASE_DIR,
    "tnrd_tamil_village_database.pdf"
)

OUTPUT_FILE = os.path.join(
    BASE_DIR,
    "Tamil_Nadu_Official_Tamil_Village.xlsx"
)


def clean(value):
    if value is None:
        return ""

    value = str(value)
    value = value.replace("\n", " ")
    value = re.sub(r"\s+", " ", value)

    return value.strip()


print("")
print("==============================================")
print(" AGRICONNECT - OFFICIAL TAMIL VILLAGE DATA")
print("==============================================")
print("")


# ------------------------------------------------
# STEP 1 - DOWNLOAD OFFICIAL PDF
# ------------------------------------------------

if not os.path.exists(PDF_FILE):

    print("Downloading official TNRD Tamil database...")
    print("")

    response = requests.get(
        PDF_URL,
        timeout=120
    )

    response.raise_for_status()

    with open(PDF_FILE, "wb") as f:
        f.write(response.content)

    print("PDF downloaded successfully.")
else:
    print("Official PDF already exists.")


print("")
print("Reading PDF...")
print("")


# ------------------------------------------------
# STEP 2 - CREATE EXCEL
# ------------------------------------------------

wb = Workbook()

ws = wb.active
ws.title = "Official Tamil Villages"


headers = [
    "District_TA",
    "Block_TA",
    "Village_TA",
    "Source"
]

ws.append(headers)


records = set()

page_count = 0


# ------------------------------------------------
# STEP 3 - EXTRACT TABLES
# ------------------------------------------------

with pdfplumber.open(PDF_FILE) as pdf:

    total_pages = len(pdf.pages)

    print(
        f"Total PDF pages: {total_pages}"
    )

    print("")

    for page in pdf.pages:

        page_count += 1

        if page_count % 10 == 0:
            print(
                f"Processing page {page_count}/{total_pages}..."
            )

        try:

            tables = page.extract_tables()

            for table in tables:

                for row in table:

                    if not row:
                        continue

                    row = [
                        clean(x)
                        for x in row
                    ]

                    # Expected structure:
                    #
                    # LGD District Code
                    # District Name
                    # LGD Block Code
                    # Block Name
                    # LGD Village Code
                    # Village Name
                    # Habitation Code
                    # Habitation Name

                    if len(row) < 6:
                        continue

                    district = row[1]
                    block = row[3]
                    village = row[5]

                    # Skip headers
                    if (
                        district.lower()
                        in [
                            "district name",
                            "district",
                            "மாவட்டம்"
                        ]
                    ):
                        continue

                    if (
                        village.lower()
                        in [
                            "village vname",
                            "village name",
                            "கிராமம்"
                        ]
                    ):
                        continue

                    if not district:
                        continue

                    if not block:
                        continue

                    if not village:
                        continue

                    # Ignore obvious numeric/code rows
                    if district.isdigit():
                        continue

                    if block.isdigit():
                        continue

                    if village.isdigit():
                        continue

                    key = (
                        district,
                        block,
                        village
                    )

                    if key in records:
                        continue

                    records.add(key)

                    ws.append([
                        district,
                        block,
                        village,
                        "TNRD Official Tamil Database"
                    ])

        except Exception as error:

            print(
                f"Warning: page {page_count} "
                f"could not be processed: {error}"
            )


# ------------------------------------------------
# STEP 4 - FORMAT EXCEL
# ------------------------------------------------

ws.freeze_panes = "A2"

ws.auto_filter.ref = ws.dimensions

widths = {
    "A": 25,
    "B": 30,
    "C": 35,
    "D": 35
}

for column, width in widths.items():
    ws.column_dimensions[column].width = width


# ------------------------------------------------
# STEP 5 - SAVE
# ------------------------------------------------

wb.save(OUTPUT_FILE)


print("")
print("==============================================")
print(" DONE")
print("==============================================")
print("")
print(
    f"Records created: {len(records)}"
)
print("")
print(
    "Output file:"
)
print(
    OUTPUT_FILE
)
print("")
print(
    "This file uses the official TNRD Tamil database."
)
print("")
print("==============================================")