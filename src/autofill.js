// Function from https://stackoverflow.com/a/61511955
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}

function firstToResolve(a, b) {
    return new Promise((resolve) => {
        a.then(() => resolve(false));
        b.then(() => resolve(true));
    });
}

async function run() {
    var secret = await new Promise((resolve) => {
        chrome.storage.sync.get("2fa_secret", (data) => {
            resolve(data["2fa_secret"]);
        });
    })
    secret = secret.toString();

    // Check whether #loginHeader (password page) or #idDiv_SAOTCC_Title (2fa page) is present first.
    // Determines whether we're on the password or 2fa page.
    let is2fa = await firstToResolve(
        waitForElm("#loginHeader"),
        waitForElm("#idDiv_SAOTCC_Title")
    );

    // Check if this is the password input page or 2fa page
    if (is2fa) {
        console.log("2FA page detected");

        let codeTitleDiv = await waitForElm("#idDiv_SAOTCC_Title");
        let codeInputDiv = await waitForElm("#idTxtBx_SAOTCC_OTC");
        let codeNextButton = await waitForElm("#idSubmit_SAOTCC_Continue");

        console.log(codeTitleDiv, codeInputDiv, codeNextButton);

        // TODO error checking: totp supported and secret actually exists

        // Parameters
        let period = 30;
        let digits = 6;

        // Get code with totp-js library
        let secretHex = Convert.base32toHex(secret);
        console.log("2FA secret (hex): " + secretHex);
        let counter = TOTP.getCurrentCounter(period);
        let code = await TOTP.otp(secretHex, digits, counter, false, true);

        console.log("2FA code: " + code);
    } else {
        console.log("Password page detected");

        let pwTitleDiv = await waitForElm("#loginHeader > div:nth-child(1)");
        let pwNextButton = await waitForElm("#idSIButton9");

        console.log(pwTitleDiv, pwNextButton);
        return;
    }
}

// Run has to be async because it uses await
run();