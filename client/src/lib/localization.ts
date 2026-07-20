import i18n from "../i18n/config";

const localeByLanguage: Record<string, string> = {
  en: "en-GB",
  es: "es-ES",
};

export function getLocale(language = i18n.resolvedLanguage): string {
  const normalizedLanguage = language?.split("-")[0] ?? "es";
  return localeByLanguage[normalizedLanguage] ?? "es-ES";
}

export function formatLocalizedDateTime(
  value: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  }
): string {
  return new Intl.DateTimeFormat(getLocale(), options).format(new Date(value));
}

export function formatLocalizedNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(getLocale(), options).format(value);
}
