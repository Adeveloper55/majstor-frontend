const SERBIAN_MOBILE_REGEX = /^\+3816[0-9]{7,8}$/;

/** Normalizuje srpski mobilni broj u format +3816XXXXXXXX */
export function normalizeSerbianPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (!digits) return null;

  let national = digits;

  if (national.startsWith("381")) {
    national = national.slice(3);
  } else if (national.startsWith("0")) {
    national = national.slice(1);
  }

  if (!national.startsWith("6")) return null;

  const normalized = `+381${national}`;
  return SERBIAN_MOBILE_REGEX.test(normalized) ? normalized : null;
}

export function isValidSerbianPhone(input: string): boolean {
  return normalizeSerbianPhone(input) !== null;
}

export function formatPhoneDisplay(normalized: string): string {
  return normalized.replace(/^(\+381)(\d{2})(\d{3})(\d{3,4})$/, "$1 $2 $3 $4");
}
