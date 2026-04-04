/**
 * Loads the Google Maps JS API with the Places library once per page.
 * Uses `VITE_GOOGLE_MAPS_API_KEY` from `.env.local`.
 */
let loadPromise: Promise<void> | null = null

export function loadGoogleMapsPlaces(): Promise<void> {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (!key) {
    return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not set'))
  }
  if (typeof window !== 'undefined' && window.google?.maps?.places) {
    return Promise.resolve()
  }
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps-places]'
    )
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Google Maps script failed')))
      return
    }
    const script = document.createElement('script')
    script.dataset.googleMapsPlaces = 'true'
    script.async = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })

  return loadPromise
}
