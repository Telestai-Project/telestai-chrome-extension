/*
The only thing this content script does is, is to respond back with the current URL to the popup.

On idp.ravenrebels.com the URL contains an orderRef query parameter.
The popup can then do the sign in for the user (singel sign on).

So if we get a message, we respond with the URL, just that.
*/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.popup && request.popup.status === "alive") {
    sendResponse({ url: window.location.href });
  } else {
    sendResponse({ status: "ok" });
  }
});
