import csv
import json
from datetime import datetime

def convert_csv_to_json(csv_file_path, json_file_path):
    """
    Converts payroll data from a CSV file to a JSON file,
    restructuring the data to match the defined schema.
    """
    payroll_data = []
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            # Skip empty rows
            if not any(row.values()):
                continue

            # Convert date to ISO 8601 format
            week_ending_dt = datetime.strptime(row["week_ending"], "%m/%d/%Y")
            week_ending_iso = week_ending_dt.isoformat()

            record = {
                "employee_name": row["employee_name"],
                "employee_id": int(row["employee_id"]),
                "level": row["level"],
                "occupation": row["occupation"],
                "week_ending": week_ending_iso,
                "daily_hours": {
                    "monday": {"standard": float(row["mon_st_hours"]), "overtime": float(row["mon_ot_hours"])},
                    "tuesday": {"standard": float(row["tue_st_hours"]), "overtime": float(row["tue_ot_hours"])},
                    "wednesday": {"standard": float(row["wed_st_hours"]), "overtime": float(row["wed_ot_hours"])},
                    "thursday": {"standard": float(row["thu_st_hours"]), "overtime": float(row["thu_ot_hours"])},
                    "friday": {"standard": float(row["fri_st_hours"]), "overtime": float(row["fri_ot_hours"])},
                    "saturday": {"standard": float(row["sat_st_hours"]), "overtime": float(row["sat_ot_hours"])},
                    "sunday": {"standard": float(row["sun_st_hours"]), "overtime": float(row["sun_ot_hours"])}
                },
                "rates": {
                    "standard": float(row["standard_rate"]),
                    "overtime": float(row["overtime_rate"]),
                    "benefits": float(row["benefits_rate"])
                }
            }
            payroll_data.append(record)

    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(payroll_data, json_file, indent=2)

if __name__ == "__main__":
    CSV_FILE = "data/payroll_data.csv"
    JSON_FILE = "round-grass-5c74/public/payroll_data.json"
    convert_csv_to_json(CSV_FILE, JSON_FILE)
    print(f"Successfully converted {CSV_FILE} to {JSON_FILE}")
