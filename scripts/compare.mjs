// compare.mjs: prototype | build, side by side, one image per mechanism (PRD 21 "lado a lado").
//   node scripts/compare.mjs <protoPrefix> <buildPrefix> <width>
// Writes public/memory/prints/side-<width>-<nn>-<name>.png (each half at 50%).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = path.join(root, 'public', 'memory', 'prints')
const [a = 'proto', b = 'dev', w = '1440'] = process.argv.slice(2)
const files = fs.readdirSync(dir).filter((f) => f.startsWith(`${a}-${w}-`))
for (const f of files) {
  const rest = f.slice(`${a}-${w}-`.length), other = path.join(dir, `${b}-${w}-${rest}`)
  if (!fs.existsSync(other)) continue
  const left = await sharp(path.join(dir, f)).resize({ width: Math.round(+w / 2) }).toBuffer({ resolveWithObject: true })
  const right = await sharp(other).resize({ width: Math.round(+w / 2) }).toBuffer({ resolveWithObject: true })
  const H = Math.max(left.info.height, right.info.height), gap = 12
  await sharp({ create: { width: left.info.width * 2 + gap, height: H, channels: 3, background: { r: 250, g: 192, b: 2 } } })
    .composite([{ input: left.data, left: 0, top: 0 }, { input: right.data, left: left.info.width + gap, top: 0 }])
    .png().toFile(path.join(dir, `side-${w}-${rest}`))
}
console.log(`compare: ${files.length} pairs at ${w}`)
