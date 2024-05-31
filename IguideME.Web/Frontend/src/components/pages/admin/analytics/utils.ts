/**
 * Check if the given timestamp lays in the current week number.
 * @param timestamp The timestamp to check.
 * @returns True if the timestamp is in the current week, false otherwise.
 */
export function isThisWeek(timestamp: number): boolean {
  const eventDate = new Date(timestamp);
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  return eventDate >= startOfWeek;
}
