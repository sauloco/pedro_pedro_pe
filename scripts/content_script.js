let THE_OBSERVER;

const initSpinnerObserver = () => {

    const descriptor = CURRENT_DESCRIPTOR
    if (!descriptor) {
        return
    }

    THE_OBSERVER = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {

            if (!mutation.addedNodes || mutation.target.nodeType !== Node.ELEMENT_NODE) {
                return;
            }

            for (const selector of descriptor.selectors) {
                if (mutation.target.matches(selector) || mutation.target.querySelector(selector)) {
                    debug('🦝 found loading spinner')

                    const target = mutation.target.matches(selector) ? mutation.target : mutation.target.querySelector(selector)

                    if (target.matches(`${selector}:not(:has(img.pedro-pe-spinner))`)) {
                        descriptor.action(target, descriptor)
                    }

                }


            }
        });
    });

    THE_OBSERVER.observe(document.body, {
        childList: true, subtree: true
    });

}

if (INIT_OBSERVER) {
    initSpinnerObserver()
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'urlChanged') {
        if (THE_OBSERVER) {
            THE_OBSERVER.disconnect()
            THE_OBSERVER = null
        }
        CURRENT_DESCRIPTOR = null
        INIT_OBSERVER = false

        scanForSpinner()

        if (INIT_OBSERVER) {
            initSpinnerObserver()
        }
    }
})