export function formatPrice(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(number);
}

export function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const STATUS_LABELS = {
  pending: 'En attente',
  paid: 'Payée',
  failed: 'Échouée',
};

export function formatOrderStatus(status) {
  return STATUS_LABELS[status] || status;
}
