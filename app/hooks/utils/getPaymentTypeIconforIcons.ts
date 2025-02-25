export function getPaymentTypeIconforIcons(paymentType: string) {
  // Convert to lowercase for consistent matching
  const payment = paymentType.toLowerCase();

  if (paymentType.includes('cash')) return 'cash';
  if (paymentType.includes('e-sewa')) return 'wallet-outline';
  if (paymentType.includes('fone-pay')) return 'call-outline';

  // Fallback icon if no match
  return 'cash-sharp';
}
