type ImageFormat = 'original' | 'webp' | 'avif'

type AssetOptions = {
  format?: ImageFormat
  compressed?: boolean
}

export function getAssetPath(
  assetPath: string,
  options: AssetOptions = {}
): string {
  const { format = 'original', compressed = true } = options

  if (!compressed || format === 'original') {
    return `/assets/${assetPath}`
  }

  const pathWithoutExt = assetPath.replace(/\.[^/.]+$/, '')
  return `/assets/compressed/${pathWithoutExt}.${format}`
}

export function getImageSrcSet(assetPath: string): string {
  const webp = getAssetPath(assetPath, { format: 'webp' })
  const avif = getAssetPath(assetPath, { format: 'avif' })

  return `${avif} type="image/avif", ${webp} type="image/webp"`
}
