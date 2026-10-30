export function formatVnd(price: number | null | undefined): string {
  if (price === null || price === undefined) return 'Liên hệ đại lý';
  const billion = price / 1_000_000_000;
  if (billion >= 1) {
    const rounded = Math.round(billion * 100) / 100;
    const s = rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2);
    return `${s} tỷ VNĐ`;
  }
  return `${(price / 1_000_000).toLocaleString('vi-VN')} triệu VNĐ`;
}

export function specValue(specs: Record<string, unknown>, key: string): string | null {
  const v = specs?.[key];
  if (v === null || v === undefined || v === '') return null;
  return String(v);
}
