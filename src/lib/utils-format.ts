export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function generateOsNumber(sequence: number, year?: number): string {
  const currentYear = year || new Date().getFullYear();
  const paddedSequence = String(sequence).padStart(4, '0');
  return `OS-${currentYear}-${paddedSequence}`;
}

export function parseOsNumber(osNumber: string): { year: number; sequence: number } | null {
  const match = osNumber.match(/^OS-(\d{4})-(\d{4})$/);
  if (!match) return null;
  return {
    year: parseInt(match[1]),
    sequence: parseInt(match[2]),
  };
}
