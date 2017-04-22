/**
 * Created by alykoshin on 20.12.15.
 */

// start of checkInstalled handler of InlineInstall package
// https://www.npmjs.com/package/inline-install
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponseCb) {
  if (request && request.message && request.message === 'inline-install-check') {
    sendResponseCb({
      installed: true
    });
  }
  return true;
});
// end of checkInstalled handler
