// The tear maths of the Pushpin Tear Footer (21st.dev, @kedhareswer), as approved in the prototype:
// mulberry32 RNG, an 84-point ridge, 6 flaps, easeTear, morphYs. Pure functions, no DOM.

const RIDGE_N = 84
export const START = 1.06
export const FLAPS = 6

export type Flap = { at: number; span: number; len: number; skew: number; dir: number; jag: number[] }
export type Tear = { ys: number[]; rim: number[]; lag: number[]; flaps: Flap[] }
type Pt = [number, number]

export const clamp01 = (v: number) => (Number.isFinite(v) ? (v < 0 ? 0 : v > 1 ? 1 : v) : 0)

function rng(seed: number) {
  let a = (Number.isFinite(seed) ? Math.floor(seed) : 0) >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The x of every ridge point, shared by every tear (seed 911). */
export const XS = (() => {
  const r = rng(911), out: number[] = []
  for (let i = 0; i < RIDGE_N; i++) {
    const u = i / (RIDGE_N - 1)
    const j = i > 0 && i < RIDGE_N - 1 ? (r() - 0.5) * (0.8 / RIDGE_N) : 0
    out.push(-0.02 + u * 1.04 + j)
  }
  return out
})()

function ridgeFloor(x: number) { const d = Math.abs(x - 0.5); if (d < 0.13) return 0.39; if (d < 0.25) return 0.43; return 0.5 }

export function makeTear(seed: number, n = RIDGE_N): Tear {
  const r = rng(seed), ph = [r() * 6.283, r() * 6.283, r() * 6.283], ys: number[] = [], rim: number[] = [], lag: number[] = []
  for (let i = 0; i < n; i++) {
    const x = XS[Math.min(i, XS.length - 1)], d = Math.min(1, Math.abs(x - 0.5) * 2)
    const base = 0.43 + 0.3 * Math.pow(d, 1.35)
    const wander = (0.022 * Math.sin(x * 7 + ph[0]) + 0.016 * Math.sin(x * 13 + ph[1]) + 0.01 * Math.sin(x * 29 + ph[2])) * (0.45 + 0.55 * d)
    const spike = r() < 0.16 ? 2.3 : 1, jag = (r() - 0.5) * 0.022 * spike
    ys.push(Math.min(0.8, Math.max(ridgeFloor(x), base + wander + jag)))
    rim.push(1.2 + r() * 3.6)
    lag.push(Math.min(0.48, d * 0.4 + 0.04 + 0.03 * Math.sin(x * 23 + ph[1]) + r() * 0.012))
  }
  const slots = [0.05, 0.19, 0.33, 0.67, 0.81, 0.95], up = r() < 0.5 ? [2, 4] : [1, 3]
  const flaps = slots.map((slot, k) => {
    const x = slot + (r() - 0.5) * 0.05, span = 3 + Math.floor(r() * 5)
    const at = Math.max(0, Math.min(n - 1 - span, Math.round(x * (n - 1))))
    const dir = up.includes(k) ? -1 : 1, outer = k === 0 || k === slots.length - 1
    const len = dir < 0 ? 0.022 + r() * 0.022 : outer ? 0.085 + r() * 0.04 : 0.045 + r() * 0.05
    return { at, span, len, skew: (r() - 0.5) * 1.1, dir, jag: [r() - 0.5, r() - 0.5, r() - 0.5, r() - 0.5] }
  })
  return { ys, rim, lag, flaps }
}

export function easeTear(t: number) { const x = clamp01(t); if (x === 0 || x === 1) return x; const c1 = 0.9; return 1 + (c1 + 1) * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2) }
export const easeInOut = (t: number) => { const x = clamp01(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2 }
export const introYs = (tear: Tear, t: number) => tear.ys.map((y, i) => START + (y - START) * easeTear((t - tear.lag[i]) / 0.5))
export const morphYs = (from: number[], to: Tear, t: number) => to.ys.map((y, i) => { const a = from[i] ?? y; return a + (y - a) * easeInOut((t - to.lag[i] * 0.6) / 0.6) })
export const flapOpen = (tear: Tear, f: Flap, t: number) => easeTear((t - tear.lag[f.at] - 0.18) / 0.32)

export function flapPoly(ys: number[], f: Flap, W: number, H: number, open: number): Pt[] {
  const b = Math.min(ys.length - 1, f.at + f.span), top: Pt[] = []
  for (let k = f.at; k <= b; k++) top.push([XS[k] * W, ys[k] * H])
  const A = top[0], B = top[top.length - 1], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2
  const L = f.len * H * Math.max(0, open), tip: Pt = [mx + f.skew * L, my + f.dir * L]
  const side = (P: Pt, Q: Pt, j0: number, j1: number): Pt[] => {
    const dx = Q[0] - P[0], dy = Q[1] - P[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len
    return [[P[0] + dx / 3 + nx * j0 * 0.22 * L, P[1] + dy / 3 + ny * j0 * 0.22 * L], [P[0] + (dx * 2) / 3 + nx * j1 * 0.22 * L, P[1] + (dy * 2) / 3 + ny * j1 * 0.22 * L]]
  }
  return [...top, ...side(B, tip, f.jag[0], f.jag[1]), tip, ...side(tip, A, f.jag[2], f.jag[3])]
}

const n1 = (v: number) => Math.round(v * 10) / 10
export const polyD = (pts: Pt[]) => (pts.length ? 'M' + pts.map((p) => n1(p[0]) + ' ' + n1(p[1])).join('L') + 'Z' : '')
export function sheetD(ys: number[], W: number, H: number, off?: number[]) {
  let d = 'M-20 -20L' + (W + 20) + ' -20'
  for (let i = ys.length - 1; i >= 0; i--) d += 'L' + n1(XS[i] * W) + ' ' + n1(ys[i] * H - (off ? off[i] : 0))
  return d + 'Z'
}

/** Paper grain, 160×160, drawn once (seed 42). */
export function grainDataUrl() {
  const c = document.createElement('canvas'); c.width = c.height = 160
  const g = c.getContext('2d'); if (!g) return ''
  const img = g.createImageData(160, 160), r = rng(42)
  for (let i = 0; i < img.data.length; i += 4) { const v = r() < 0.5 ? 0 : 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = Math.floor(r() * 46) }
  g.putImageData(img, 0, 0)
  return c.toDataURL()
}
