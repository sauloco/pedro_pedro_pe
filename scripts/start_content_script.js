let DEBUG = true

function debug(value) {
    if (DEBUG) {
        console.log(value)
    }
}

const pedroUrl = chrome.runtime.getURL('images/pedro.gif')
const imgString = `<img alt="pedro pedro pe"  src="${pedroUrl}" class="pedro-pe-spinner"/>`

const action = (spinner, _descriptor) => {
    spinner.innerHTML = imgString;
}

const sites = {
    'youtube.com': [{
        url: '/watch',
        selectors: ['.ytp-spinner', '#spinner'],
        action
    }],
    'instagram.com': [
        {
            url: '*',
            selectors: ['div[data-visualcompletion=loading-state][role=progressbar]'],
            action
        }
    ],
    'facebook.com': [
        {
            url: '*',
            selectors: ['div[data-instancekey] > div[data-visualcompletion=ignore] > div:has(svg)', 'div[role=article] > div[data-visualcompletion=loading-state] > div > div > div > div'],
            action: (spinner, descriptor) => {
                if (spinner.matches(descriptor.selectors[0])) {
                    spinner.querySelector('svg').parentElement.innerHTML = imgString;
                } else {
                    spinner.innerHTML = imgString
                }
            }
        }
    ],
    'x.com': [
        {
            url: '*',
            selectors: ['div[role=progressbar]'],
            action: (spinner, _descriptor) => {
                spinner.innerHTML = imgString.replace('pedro-pe-spinner', 'pedro-pe-spinner on-twitter');
            }
        }
    ]
}


let INIT_OBSERVER = false
let CURRENT_DESCRIPTOR;

const scanForSpinner = () => {

    for (const [site, spinnerDescriptors] of Object.entries(sites)) {
        if (window.location.host.includes(site)) {
            const descriptor = spinnerDescriptors.filter(({url}) => url === "*" || window.location.pathname.includes(url)).at(0)

            if (descriptor) {
                INIT_OBSERVER = true
                CURRENT_DESCRIPTOR = descriptor

                for (const selector of descriptor.selectors) {
                    const target = document.querySelector(selector)
                    if (target) {
                        debug('🦝 found loading spinner')
                        descriptor.action(target)
                    }
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', scanForSpinner, false)
