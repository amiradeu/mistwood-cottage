import gsap from 'gsap'

export function toggleFade(element, state, endValue = 1, duration = 1) {
    // Ensure opacity works
    element.visible = true

    gsap.to(element, {
        opacity: state ? endValue : 0,
        duration: duration,
        onComplete: () => {
            element.visible = state ? true : false
        },
    })
}
