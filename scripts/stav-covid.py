import argparse
import requests
from bs4 import BeautifulSoup
import datetime
import re
import warnings

parser = argparse.ArgumentParser(description="Load hours from St. Olaf's COVID dining hours site")
parser.add_argument('-o', '--output', type=argparse.FileType('w'), required=True,
                    help='the file to write the schedule into')
options = parser.parse_args()

# Fetch the output to a string, `output`.
url = "https://wp.stolaf.edu/reslife/dining-hours/"
output = requests.get(url).text

# Now, parse it.
output = BeautifulSoup(output)

# NOTE(rye): There is no filtering to prevent loading tables that aren't valid,
# so please double-check the output of this script.
tables = output.find_all("table")

# A regex to match strings like "Sunday, August 23"
date_re = re.compile('\w+, \w+ \d{1,2}')

# A regex used to match timespec delimiters (e.g. the "-"" in "9-10:45")
timespec_re = re.compile('\s*-\s*|\s*–\s*')

# If the given tag only has one set of contents, just grab the contents.
def meal_name_from(th):
	if len(th.contents) == 1:
		return th.get_text()
	else:
		return None

# Attempt to parse a lazy timestring (either hh or hh:mm) to a datetime.  Note
# that this datetime is context-free, and needs to be adjusted to make sense.
def timeparse(string, date=None):
	parts = string.split(":")
	if len(parts) == 1:
		return datetime.datetime.combine(date, datetime.time(hour=int(parts[0])))
	elif len(parts) == 2:
		return datetime.datetime.combine(date, datetime.time(hour=int(parts[0]), minute=int(parts[1])))
	else:
		return None

# Start with an empty schedule set
schedules = {}

# For each of the HTML tables we found,
for table in tables:
	print("Processing a table...")

	# Find the prior sibling, which is an h3 containing the day in some format.
	# Each table should have an h3 before it that has date information in it.
	header = table.find_previous_sibling("h3").get_text().strip()
	print('Found a header sibling with text "{}"'.format(header))

	# Search the text for just the date
	matching_text = date_re.match(header).group(0)

	# NOTE(rye): Parses text like "Sunday, August 23"
	date = datetime.datetime.strptime(matching_text, "%A, %B %d")

	# Move the date to the current year
	date = datetime.datetime(date.today().year, date.month, date.day)

	# If the computed date is more than six months before today, assume it actually belongs in the next year.
	if date < date.today() + datetime.timedelta(days=-180):
		date = datetime.datetime(date.year + 1, date.month, date.day)

	# We only know the date, so let's back out to that.
	date = date.date()

	print("Inferred date of {}; processing table now.".format(date))

	body = table.find("tbody")

	# NOTE(rye): Should only have one thead
	meals = [meal_name_from(th) for th in table.find("thead").find("tr").find_all("th")]

	for idx, meal in enumerate(meals):
		if idx == 0:
			continue
		for row in body.find_all("tr"):
			cols = [col.get_text() for col in row.find_all("td")]
			if len(cols) != len(meals):
				continue
			if len("".join(cols)) == 0:
				continue
			dorm = cols[0]
			# meal = meal
			timespec = cols[idx]

			print("Processing table entry: {} gets {} at {} on {}".format(dorm, meal, timespec, date))

			# Split the timespec on the timespec_re matches
			times = [time.strip() for time in timespec_re.split(timespec)]

			if len(times) != 2:
				warnings.warn("timespec {} did not split nicely".format(timespec))
				continue

			t_open = timeparse(times[0], date=date)
			t_close = timeparse(times[1], date=date)

			# Lunch always occurs after 6am.  If we have something else, we're
			# probably 12 hours off.
			if meal == "Lunch" and (t_open.hour < 6 or t_close.hour < 6):
				t_open += datetime.timedelta(hours=12)
				t_close += datetime.timedelta(hours=12)

			# Dinner always occurs in the evening.  If we have something else,
			# we're probably 12 hours off.
			if meal == "Dinner" and (t_open.hour < 12 or t_close.hour < 12):
				t_open += datetime.timedelta(hours=12)
				t_close += datetime.timedelta(hours=12)

			# The open time should not be the same or even close to the close
			# time, so we should wrap it around.  (We do this by bumping up the )
			if t_open >= t_close:
				t_close = t_close + datetime.timedelta(hours=12)

			# Warn if the open dt is before the close dt somehow
			if t_open >= t_close:
				warnings.warn("t_open ({}) is before t_close ({})".format(t_open, t_close))

			# Warn if the close dt is more than 12 hours after the open dt
			if t_close >= t_open + datetime.timedelta(hours=12):
				warnings.warn("t_close ({}) is >= 12 hours after t_open ({})".format(t_open, t_close))

			key = "{},{}".format(dorm, meal)

			if not key in schedules:
				schedule = {}
				schedule["hours"] = []

				schedules[key] = schedule

			schedules[key]["title"] =  "{} – {}".format(dorm, meal)

			entry = {}
			entry["days"] = [date.strftime("%a")]
			entry["from"] = t_open.strftime("%I:%M%p").lower()
			entry["to"] = t_close.strftime("%I:%M%p").lower()

			schedules[key]["hours"].append(entry)

document = { "name": "Stav Hall", "image": "stav", "category": "Food", "schedule": list(schedules.values()) }
