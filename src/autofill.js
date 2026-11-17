async function run() {
    var secret = await new Promise((resolve) => {
        chrome.storage.sync.get("2fa_secret", (data) => {
            resolve(data["2fa_secret"]);
        });
    })
    secret = secret.toString();

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
}

// Run has to be async because it uses await
run();