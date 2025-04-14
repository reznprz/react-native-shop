export function getPaymentTypeIconforIcons(paymentType: string) {
  // Convert to lowercase for consistent matching
  const payment = paymentType.toLowerCase();

  if (payment.includes('cash')) return 'cash';
  if (payment.includes('esewa')) return 'wallet-outline';
  if (payment.includes('fone_pay')) return 'call-outline';

  // Fallback icon if no match
  return 'cash-sharp';
}
