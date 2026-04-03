export const parseUtc = (value: string): Date => {
  const normalized = hasExplicitTimezone(value) ? value : `${value}Z`;
  return new Date(normalized);
};

export const toUtcIso = (date: Date = new Date()): string => date.toISOString();

export const formatLocalDateTime = (
  utcValue: string,
  options?: Intl.DateTimeFormatOptions,
): string => parseUtc(utcValue).toLocaleString(undefined, options);

const hasExplicitTimezone = (value: string): boolean =>
  /[zZ]|[+-]\d{2}:\d{2}$/.test(value);
