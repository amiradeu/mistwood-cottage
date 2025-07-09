import Experience from './Experience/Experience.js'
import { injectSpeedInsights } from '@vercel/speed-insights'

const experience = new Experience(document.querySelector('canvas.webgl'))
injectSpeedInsights()
