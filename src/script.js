import { injectSpeedInsights } from '@vercel/speed-insights'
import { inject } from '@vercel/analytics'

import Experience from './Experience/Experience.js'

injectSpeedInsights()
const experience = new Experience(document.querySelector('canvas.webgl'))
inject({
    mode: 'production',
})
