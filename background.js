let state = false;
let blockedList = []

chrome.storage.local.get(['myFlag'], (res) => {
    console.log("Got the state from storage ", res.myFlag)
    state = res.myFlag;
});

chrome.storage.local.get(['myArray'], (res) => {
    console.log("Got the array from storage ", res.myArray)
    blockedList = res.myArray;
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.myFlag) {
        console.log('Boolean changed to:', changes.myFlag.newValue);
    }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.myArray) {
        console.log('Array changed to:', changes.myArray.newValue);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getArray") {
        chrome.storage.local.get("myArray", (result) => {
            sendResponse({ data: result.myArray });
        });
        return true;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getState") {
        chrome.storage.local.get("myFlag", (result) => {
            sendResponse({ data: result.myFlag });
        });
        return true;
    }
});