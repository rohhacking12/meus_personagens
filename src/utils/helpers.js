export function getRoleTagClass(role) {
  if (!role) return 'tag-outro'
  return 'tag-' + role.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function detectMusicType(url) {
  if (!url) return null
  if (url.includes('spotify.com') || url.includes('open.spotify.com')) return 'spotify'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  return null
}

export function extractSpotifyId(url) {
  let id = url.split('/').pop()
  return id.split('?')[0]
}

export function extractYoutubeId(url) {
  if (url.includes('youtu.be')) return url.split('youtu.be/')[1].split('?')[0]
  const m = url.match(/[?&]v=([^&]+)/)
  return m ? m[1] : null
}

export function resizeImage(file, maxWidth) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let w = img.width, h = img.height
        if (w > maxWidth) { h = (maxWidth/w)*h; w = maxWidth }
        const c = document.createElement('canvas'); c.width = w; c.height = h
        c.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(c.toDataURL('image/jpeg', 0.7))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}
