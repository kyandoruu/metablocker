async function execute() {
    const array = await chrome.runtime.sendMessage({ type: "getArray" })
    const state = await chrome.runtime.sendMessage({ type: "getState" })

    // console.log(array.data)
    // console.log(state.data)

    if (state.data === true) {
        if (array.data.includes(window.location.hostname)) {
            window.location.href = chrome.runtime.getURL("block.html");
        }
    }

}

execute()