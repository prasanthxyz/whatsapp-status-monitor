// Open the contact on whatsapp web
// Copy paste this entire script to the console

// I've noticed performance issues when the window is in the background
// Injecting the script into the page using something like tampermonkey improves the performance

/* Configuration */
const monitorIntervalInSeconds = 2; // status check interval
const beepVolume = 100;
// if true, it'll keep on beeping when online for every monitor interval
// if false, it beeps once when online and stops monitoring. Monitoring resumes when status changes from online.
let keepBeepingWhenOnline = false;
const statusXpath = "/html/body/div[1]/div/div/div[4]/div/header/div[2]/div[2]/span";
let debugMode = false;
/* Configuration end */

/* Utils */
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

let a = new AudioContext()

function beep(vol, freq, duration) {
    let v = a.createOscillator();
    let u = a.createGain();
    v.connect(u);
    v.frequency.value=freq;
    v.type="square";
    u.connect(a.destination);
    u.gain.value=vol*0.01;
    v.start(a.currentTime);
    v.stop(a.currentTime+duration*0.001);
}

function log(...args) {
    if (debugMode) {
        console.debug(args);
    }
}
/* Utils end */

let foundOnline = false;
function monitor() {
    setTimeout(function () {
        let e = getElementByXpath(statusXpath);
        if (e) {
            log("element present");
            if (e.title == "online") {
                log("keepBeepingWhenOnline: ", keepBeepingWhenOnline);
                log("foundOnline status: ", foundOnline);
                if (keepBeepingWhenOnline || !foundOnline) {
                    foundOnline = true;
                    beep(beepVolume, 520, 200);
                }
            } else {
                // so that it doesn't keep on beeping for the entire online time
                foundOnline = false;
            }
        } else {
            log("element missing");
        }
        // For infinite-loop with delay between iterations, the way I found online was recursive call.
        // Please enlighten me if you know a better way!
        monitor();
    }, monitorIntervalInSeconds * 1000)
 }
 
monitor();
