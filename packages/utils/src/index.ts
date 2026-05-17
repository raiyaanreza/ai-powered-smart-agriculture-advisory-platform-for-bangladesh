// @agri-packages/utils
export function formatDate(dateString: string | Date, locale: 'en' | 'bn' = 'bn'): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  if (locale === 'bn') {
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Basic HTML tag removal
    .trim();
}

export function getConfidenceColor(score: number): string {
  if (score >= 0.9) return 'text-emerald-600 bg-emerald-50';
  if (score >= 0.75) return 'text-amber-600 bg-amber-50';
  return 'text-rose-600 bg-rose-50';
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}
