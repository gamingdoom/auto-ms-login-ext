# Automatic Microsoft Login
A Browser Extension to Automatically Login to Microsoft with 2FA TOTP

## The Problem
I find the process required to login to my Purdue account really annoying. It makes me enter my 2FA TOTP code extremely often, which wastes a lot of my time and makes logging in pretty inefficient. It probably takes me 10 seconds to login every time, which adds up and has become quite irritating.

## How It Works
This extension has a configuration UI which can be used to enter the TOTP secret. This secret is then read from storage when login.microsoftonline.com loads. It looks for the buttons and input fields where the login screen asks you for your password and a TOTP code. It then generates a TOTP code from the store TOTP secret, inputs it into the TOTP input box, and hits next.

![System diagram](Automatic%20MS%20Login%20System%20Diagram.pdf)

## Tech Stack

- **Languages:** JS, HTML, CSS.
- **Libraries:** [totp-js](https://github.com/A99US/totp-js/tree/main) (generates TOTP code).
- **External tools:** web-ext (for building), Firefox Extension (provides APIs), Firefox Extension Store (used to sign extension).
- **Data Storage:** `chrome.storage.sync` API.

## Building the Extension
You can use the extension without building an xpi file:
```bash
git clone https://github.com/gamingdoom/auto-ms-login-ext
```
You can then go into [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) and navigate to `manifest.json` inside the cloned directory and load that temporarily.

If you want to build an xpi file, you need to install `web-ext`. These instructions outline that:
```bash
# Install web-ext
npm i web-ext@latest

# Clone the repo and build
git clone https://github.com/gamingdoom/auto-ms-login-ext
cd auto-ms-login-ext
web-ext build
```
Once built, you can temporarily load it by going to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) in Firefox, clicking "Load Temporary Add-on...," and selecting `web-ext-artifacts/auto_microsoft_login-<version>.zip`.

You can't install your the extension that you built yourself, since extensions need to be signed by Mozilla before you can install them.

## Using the Extension
You can download the signed extension from the Github releases page and install it in your browser.

## Roadmap
### MVP
- [x] Web Extension for Firefox
- [x] TOTP Secret Storage
- [x] Autonomous Login
### Future
- [x] Mobile Support
- [x] Other Browsers
- [x] Nice UI for inputting TOTP secret

## Demo
You can find a video walkthrough of this project [here](https://youtu.be/MWO0FYaevo8).

## Author
@gamingdoom
