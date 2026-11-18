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

    if (!secret) {
        console.error("Auto MS Login: No 2FA secret found in storage!");
        return;
    }

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
        let codeInput = await waitForElm("#idTxtBx_SAOTCC_OTC");
        let codeNextButton = await waitForElm("#idSubmit_SAOTCC_Continue");

        // Double check that we are on the 2fa page
        if (codeTitleDiv.innerText !== "Enter code") {
            console.error("Auto MS Login: Not actually on 2FA page!");
            return;
        }

        if (!TOTP.isCompatible()) {
            console.error("Auto MS Login: TOTP code generation not supported in this browser!");
            return;
        }

        // Parameters
        let period = 30;
        let digits = 6;

        // Get code with totp-js library
        let secretHex = Convert.base32toHex(secret);
        console.log("2FA secret (hex): " + secretHex);
        let counter = TOTP.getCurrentCounter(period);
        let code = await TOTP.otp(secretHex, digits, counter, false, false);

        // Fill in the code input
        codeInput.value = code;
        // Trigger input event to make sure the page knows the input changed
        codeInput.dispatchEvent(new Event('input', { bubbles: true }));

        // Click next
        codeNextButton.click();

        return;
    } else {
        console.log("Password page detected");

        let pwTitleDiv = await waitForElm("#loginHeader > div:nth-child(1)");

        // Double check that we are on the password page
        if (pwTitleDiv.innerText !== "Enter password") {
            console.error("Auto MS Login: Not actually on password page!");
            return;
        }

        let pwInput = await waitForElm("#i0118");
        let pwNextButton = await waitForElm("#idSIButton9");

        // Wait for password to be autofilled by the browser
        await new Promise((resolve) => {
            let checkInterval = setInterval(() => {
                if (pwInput.value !== "") {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });

        // Click the next button; assumes that password was autofilled by browser
        pwNextButton.click();

        return;
    }
}

// Run has to be async because it uses await
run();