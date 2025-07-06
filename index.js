const btn = document.getElementById("btn");
const blockbtn = document.getElementById("blockbutton");
let state = false;

let blockedList = []

chrome.storage.local.get(['myFlag'], (res) => {
    console.log("Got the state from storage ", res.myFlag);
    if (res.myFlag !== undefined) {
        state = res.myFlag;
        updateButtonUI();
    }
});

chrome.storage.local.get(['myArray'], (res) => {
    console.log("Got the array from storage ", res.myArray);
    if (res.myArray !== undefined && res.myArray.length > 0) {
        blockedList = res.myArray;
        displayBlockedSites();
    } else {
        chrome.storage.local.set({ myArray: blockedList }, () => {
            console.log('myArray = blockedList', blockedList);
        });
    }
});

function updateButtonUI() {
    if (state) {
        btn.classList.add("btnon");
        btn.classList.remove("btnoff");
        btn.innerText = "On";
    } else {
        btn.classList.add("btnoff");
        btn.classList.remove("btnon");
        btn.innerText = "Off";
    }
}

function displayBlockedSites() {
    var blockedSitesList = document.querySelector(".blockeddiv ul");
    blockedSitesList.innerHTML = ''; // Clear existing list

    blockedList.forEach(domain => {
        let newSite = document.createElement("li");
        newSite.textContent = domain;
        newSite.classList = "blockli";

        let deletebtn = document.createElement("button");
        deletebtn.innerText = "-";
        deletebtn.classList = "delete";
        deletebtn.onclick = () => {
            newSite.remove();
            let index = blockedList.indexOf(domain);
            if (index > -1) {
                blockedList.splice(index, 1);
            }
            chrome.storage.local.set({ myArray: blockedList }, () => {
                console.log("Updated storage after deletion", blockedList);
            });
        };

        let favicon = document.createElement('img');

        try {
            favicon.src = `http://${domain}/favicon.ico`;
        } catch (error) {
            console.log(error);
            try {
                favicon.src = 'default_favicon.png';
            } catch (error) {
                console.log("Couldn't find favicon")
            }
        }

        favicon.style.width = '20px';
        favicon.style.height = '20px';
        favicon.classList = "icon";

        newSite.prepend(favicon);
        newSite.prepend(deletebtn);
        blockedSitesList.appendChild(newSite);
    });
}


btn.onclick = () => {
    state = !state;

    chrome.storage.local.set({ myFlag: state }, () => {
        console.log('State saved to storage');
    });

    updateButtonUI();
}

blockbtn.onclick = (tab) => {
    function getDomain() {
        return window.location.hostname;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Get the first tab in the array
        let tab = tabs[0];

        // Log the tab ID and URL
        console.log(tab.id);
        console.log(tab.url);

        var url = new URL(tab.url);
        var domain = url.hostname;

        // Check if domain is already in the blockedList
        if (!blockedList.includes(domain)) {
            blockedList.push(domain);
            chrome.storage.local.set({ myArray: blockedList }, () => {
                console.log("Updated storage ", blockedList);
            });

            // Use the displayBlockedSites function to update the UI
            displayBlockedSites();
        } else {
            alert("This site is already blocked!");
        }
    });
}
