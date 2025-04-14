export function getPaymentTypeIcon(paymentType: string) {
  const payment = paymentType.toLowerCase();

  if (payment.includes('cash')) return 'money-bill-wave'; // 🏦 Cash Payment
  if (payment.includes('esewa')) return 'wallet'; // 🌐 Online Wallet (Esewa)
  if (payment.includes('fone_pay')) return 'mobile-alt'; // 📱 Mobile Payment
  if (payment.includes('credit')) return 'credit-card'; // 💳 Credit Card Payment

  return 'question-circle'; // ❓ Default fallback icon
}
