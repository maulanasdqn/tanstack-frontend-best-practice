import sharp from 'sharp'
import { glob } from 'glob'
import path from 'node:path'
import fs from 'node:fs'

type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif'

type CompressionConfig = {
  quality: number
  formats: ImageFormat[]
}

const config: CompressionConfig = {
  quality: 80,
  formats: ['webp', 'avif'],
}

const ASSETS_DIR = path.resolve(import.meta.dirname, '../public/assets')
const COMPRESSED_DIR = path.resolve(ASSETS_DIR, 'compressed')

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

async function compressImage(inputPath: string) {
  const filename = path.basename(inputPath, path.extname(inputPath))
  const outputDir = path.dirname(inputPath).replace(ASSETS_DIR, COMPRESSED_DIR)

  await ensureDir(outputDir)

  console.log(`Processing: ${inputPath}`)

  const tasks = config.formats.map(async (format) => {
    const outputPath = path.join(outputDir, `${filename}.${format}`)

    const transformer = sharp(inputPath)

    switch (format) {
      case 'jpeg':
        await transformer.jpeg({ quality: config.quality }).toFile(outputPath)
        break
      case 'png':
        await transformer
          .png({ quality: config.quality, compressionLevel: 9 })
          .toFile(outputPath)
        break
      case 'webp':
        await transformer.webp({ quality: config.quality }).toFile(outputPath)
        break
      case 'avif':
        await transformer.avif({ quality: config.quality }).toFile(outputPath)
        break
    }

    const stats = fs.statSync(outputPath)
    console.log(`  -> ${format}: ${(stats.size / 1024).toFixed(2)}KB`)
  })

  // Also copy original with optimization
  const originalExt = path.extname(inputPath).slice(1).toLowerCase()
  if (['jpg', 'jpeg', 'png'].includes(originalExt)) {
    const optimizedPath = path.join(outputDir, path.basename(inputPath))
    const transformer = sharp(inputPath)

    if (originalExt === 'png') {
      await transformer
        .png({ quality: config.quality, compressionLevel: 9 })
        .toFile(optimizedPath)
    } else {
      await transformer.jpeg({ quality: config.quality }).toFile(optimizedPath)
    }
  }

  await Promise.all(tasks)
}

async function main() {
  console.log('Compressing assets...\n')

  await ensureDir(ASSETS_DIR)
  await ensureDir(COMPRESSED_DIR)

  const images = await glob(`${ASSETS_DIR}/**/*.{jpg,jpeg,png,gif}`, {
    ignore: [`${COMPRESSED_DIR}/**`],
  })

  if (images.length === 0) {
    console.log('No images found in public/assets/')
    console.log('Add images to public/assets/ and run this script again.')
    return
  }

  for (const imagePath of images) {
    await compressImage(imagePath)
  }

  console.log('\nDone!')
}

main().catch(console.error)
