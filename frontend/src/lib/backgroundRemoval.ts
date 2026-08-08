import { removeBackground } from '@imgly/background-removal'

/**
 * Strips the background from an uploaded clothing/footwear/accessory photo,
 * entirely in the browser (WASM, no upload to a server). Returns a data URL
 * of the cutout on a transparent background.
 */
export async function removeImageBackground(file: File): Promise<string> {
  const blob = await removeBackground(file, {
    output: { format: 'image/png', quality: 0.9 },
  })
  return blobToDataUrl(blob)
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function fileToDataUrl(file: File): Promise<string> {
  return blobToDataUrl(file)
}
