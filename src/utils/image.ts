export async function loadImage(url: string, options: any = {}): Promise<HTMLImageElement> {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img')
    const done = () => {
      img.onload = img.onerror = null
      resolve(img)
    }
    if (url) {
      img.onload = done
      img.onerror = () => {
        reject(new Error('Error loading ' + img.src))
      }
      options && options.crossOrigin && (img.crossOrigin = options.crossOrigin)
      img.src = url
    } else {
      done()
    }
  })
}
