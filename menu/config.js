var saveBtn = document.getElementById('save');

// Save the totp secret to `chrome.sorage.sync` so that the totp secret can be 
// a) accessed by the main login script
// b) synced across devices.
saveBtn.addEventListener('click', () => {
    chrome.storage.sync.set({ '2fa_secret': document.getElementById('2fa_secret').value });
});