const BAHIA_TIMEZONE = 'America/Bahia';

// Retorna a data de "hoje" (YYYY-MM-DD) no fuso de Salvador/BA, independente
// do fuso do container (que roda em UTC).
export function todayInBahia(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: BAHIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}
