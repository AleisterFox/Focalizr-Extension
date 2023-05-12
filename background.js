let activeTabId = null;

function onActivatedTab(activeInfo) {
    
    activeTabId = activeInfo.tabId;
}

function onSendMessage(message) {
    if (activeTabId !== null) {
        
        actionMessage = message.action
        chrome.tabs.sendMessage(activeTabId, { action: actionMessage });
        
    } else {
        console.log('No active tab found');
    }
}

function toggleOverlay(message) {
    actionOverlayMessage = message.action;
    if (actionOverlayMessage === "overlay_on") {
        // Inyectar el archivo CSS
        chrome.scripting.insertCSS({
            target: {tabId: activeTabId},
            files: ['overlay.css']
        });
    } else if (actionOverlayMessage === "overlay_off") {
        // Quitar el archivo CSS
        chrome.scripting.removeCSS({
            target: {tabId: activeTabId},
            files: ['overlay.css']
        });
    }
}

chrome.tabs.onActivated.addListener(onActivatedTab);
chrome.runtime.onMessage.addListener(onSendMessage);
chrome.runtime.onMessage.addListener(toggleOverlay);
