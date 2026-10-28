# Automatic Microsoft Login
A Browser Extension to Automatically Login to Microsoft with 2FA TOTP

## The Problem
I find the process required to login to my Purdue account really annoying. It makes me enter my 2FA TOTP code extremely often, which wastes a lot of my time and makes logging in pretty inefficient. It probably takes me 10 seconds to login every time, which adds up and has become quite irritating.

## How It Works
This extension has a configuration UI which can be used to enter the TOTP secret. This secret is then read from storage when login.microsoftonline.com loads. It looks for the buttons and input fields where the login screen asks you for your password and a TOTP code. It then generates a TOTP code from the store TOTP secret, inputs it into the TOTP input box, and hits next.

![System diagram](docs/Automatic MS Login System Diagram.pdf)

## Tech Stack

- **Language:** JS, HTML, CSS
- **Libraries:** [totp-js](https://github.com/A99US/totp-js/tree/main)
- **External tools:** web-ext

## Building the Extension
```bash
https://github.com/gamingdoom/auto-ms-login-ext
cd auto-ms-login-ext
web-ext build
```

## Using the Extension
You will have to get the extension signed by Mozilla to actually install it, but you can test it by going to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) and clicking "Load Temporary Add-on..."

## Roadmap
- [ ] Mobile Support
- [ ] Other Browsers
- [ ] Nice UI for inputting TOTP secret

## Author
@gamingdoom
