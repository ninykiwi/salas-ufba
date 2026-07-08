export function generateOccurrenceDates(
  startDate: string,
  endDate: string,
  stepDays: number,
): string[] {
  const dates: string[] = [];
  let current = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  while (current.getTime() <= end.getTime()) {
    dates.push(current.toISOString().slice(0, 10));
    current = new Date(current.getTime() + stepDays * 24 * 60 * 60 * 1000);
  }

  return dates;
}
