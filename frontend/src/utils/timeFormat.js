function timeFormat(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function dateFormat(time) {
  const date = new Date(time);
  return date.toLocaleDateString();
}

export { dateFormat, timeFormat };
