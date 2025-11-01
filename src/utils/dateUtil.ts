export function getToFromDates(periodicity: string) {
  const d = new Date();
  const toDate = formatDate(d);
  if (periodicity === "allTime") {
    d.setFullYear(d.getFullYear() - 3);
  } else if (periodicity === "year") {
    d.setFullYear(d.getFullYear() - 1);
  } else {
    d.setMonth(d.getMonth() - 6);
  }
  const fromDate = formatDate(d);
  return { to: toDate, from: fromDate };
}

export function formatDate(date: Date | any) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dateFormatter(value: string) {
  var dArr = value.split("-");
  return dArr[2] + "/" + dArr[1] + "/" + dArr[0].substring(2);
}
