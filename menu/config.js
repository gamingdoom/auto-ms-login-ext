var saveBtn = document.getElementById('save');
var secretInput = document.getElementById('2fa_secret');
var helpText = document.getElementById('help_text');
var successText = document.getElementById('success_text');

// Save the totp secret to `chrome.storage.sync` so that the totp secret can be 
// a) accessed by the main login script
// b) synced across devices.
saveBtn.addEventListener('click', () => {
    chrome.storage.sync.set({ '2fa_secret': secretInput.value });

    // Clear the input field so it makes it feel like it has been saved.
    secretInput.value = '';

    // Show the success text
    successText.style.display = 'block';

    // Re-disable the save button.
    saveBtn.disabled = true;
});

secretInput.addEventListener('input', () => {
    if (secretInput.value.length > 0 && secretInput.value.length !== 16) {
        helpText.style.display = 'block';
    } else {
        helpText.style.display = 'none';
    }

    saveBtn.disabled = secretInput.value.length !== 16;
    successText.style.display = 'none';
});