import csv

def filter_csv(input_file, output_file):
    with open(input_file, "r", newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        filtered_rows = []
        
        for row in reader:
            scorer = row["scorer"]
            # Check if the player's name is not null or "NA"
            if scorer and scorer != "NA":
                filtered_rows.append(row)

    with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
        fieldnames = ["date", "home_team", "away_team", "team", "scorer", "minute", "own_goal", "penalty"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        writer.writerows(filtered_rows)

if __name__ == "__main__":
    input_csv = "goalscorers.csv"  # Replace with the path to your input CSV file
    output_csv = "output.csv"  # Replace with the desired path for the filtered output CSV file
    filter_csv(input_csv, output_csv)
