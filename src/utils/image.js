/**
 * The backend now returns full URLs like:
 *   "http://192.168.0.130:5000/uploads/filename.jpg"
 * 
 * Just return as-is. This helper exists in case the URL is still malformed.
 */
export function resolveImageUrl(url) {
  if (!url) return null
  // Already a full URL — return it directly
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // Relative path fallback
  const match = url.match(/([^/\\]+\.(jpg|jpeg|png|webp|gif))$/i)
  if (match) {
    const base = import.meta.env.VITE_BACKEND_URL
    return `${base}/uploads/${match[1]}`
  }
  return url
}

export function getProductImage(product) {
  if (!product?.images?.length) return null
  return resolveImageUrl(product.images[0].image_url)
}