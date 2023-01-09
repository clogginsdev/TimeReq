
export const currentYear = new Date().getFullYear();
export const currentMonth = new Date().getMonth();
// Express current month as a word
export const currentMonthWord = new Date().toLocaleString("default", {
  month: "long",
});
export const startDay = new Date(
  new Date().getFullYear(),
  currentMonth,
  1
).getDay();
export const daysInMonth = new Date(
  new Date().getFullYear(),
  currentMonth + 1,
  0
).getDate();
export const endDay = new Date(
  new Date().getFullYear(),
  currentMonth,
  daysInMonth
).getDay();
export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendar() {
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  for (let i = 0; i < startDay; i++) {
    days.unshift("");
  }

  for (let i = 0; i < 6 - endDay; i++) {
    days.push("");
  }

  return days;
}
export const days = buildCalendar();
export const today = new Date().getDate();
