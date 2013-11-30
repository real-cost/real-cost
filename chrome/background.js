var active = false;
chrome.browserAction.onClicked.addListener(function(tab) {
    active = !active;
    console.log(active);
    if (active) {
	chrome.tabs.executeScript({
	    file: 'script.js'
	});
    } else {
        // TODO: it would be slicker to store the old price in a hidden div
	// and restore from there, it would prevent the reload flicker.
	chrome.tabs.executeScript({
	    code: 'location.reload();'
	});
    }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      sendResponse({"active": active});
  }
);

