import { injectSpeedInsights } from '@vercel/speed-insights'
import Experience from './Experience/Experience.js'

injectSpeedInsights()
const experience = new Experience(document.querySelector('canvas.webgl'))
