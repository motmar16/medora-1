const DAYS = ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"];
const MONTHS = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
];

// "Joi, 17 septembrie". Built by hand so it doesn't depend on the engine's Intl locale data.
export function formatToday(date = new Date()) {
  const day = DAYS[date.getDay()];
  return `${day[0].toUpperCase()}${day.slice(1)}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

// Romanian count phrases: 0 → zero form, 1 → "o întrerupere", n → "3 întreruperi".
export function countPhrase(count: number, one: string, many: string, zero = `0 ${many}`) {
  if (count === 0) return zero;
  if (count === 1) return one;
  return `${count} ${many}`;
}
