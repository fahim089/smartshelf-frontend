export const formatCurrency = (n) => `$${parseFloat(n || 0).toFixed(2)}`

export const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-AU') : '—'

export const formatDateTime = (d) => d ? new Date(d).toLocaleString('en-AU', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
}) : '—'

export const getErrMsg = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong.'

export const stockBadge = (qty, threshold) => {
  if (qty <= 0)         return { cls: 'badge-danger',  label: 'Out of Stock' }
  if (qty <= threshold) return { cls: 'badge-warning', label: 'Low Stock'    }
  return                       { cls: 'badge-success', label: 'In Stock'     }
}

export const padId = (id) => `#${String(id).padStart(4, '0')}`