export function normalizePib(value: string): string {
  return value.replace(/\D/g, "").slice(0, 9);
}

export function validatePib(value: string, required = false): string | undefined {
  const digits = normalizePib(value);
  if (!digits) {
    return required ? "PIB je obavezan." : undefined;
  }
  if (digits.length !== 9) {
    return "PIB mora imati 9 cifara.";
  }
  return undefined;
}
