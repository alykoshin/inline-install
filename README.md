[![npm version](https://badge.fury.io/js/inline-install.svg)](http://badge.fury.io/js/inline-install)
[![Build Status](https://travis-ci.org/alykoshin/inline-install.svg)](https://travis-ci.org/alykoshin/inline-install)
[![Coverage Status](https://coveralls.io/repos/alykoshin/inline-install/badge.svg?branch=master&service=github)](https://coveralls.io/github/alykoshin/inline-install?branch=master)
[![Code Climate](https://codeclimate.com/github/alykoshin/inline-install/badges/gpa.svg)](https://codeclimate.com/github/alykoshin/inline-install)
[![Inch CI](https://inch-ci.org/github/alykoshin/inline-install.svg?branch=master)](https://inch-ci.org/github/alykoshin/inline-install)

[![Dependency Status](https://david-dm.org/alykoshin/inline-install/status.svg)](https://david-dm.org/alykoshin/inline-install#info=dependencies)
[![devDependency Status](https://david-dm.org/alykoshin/inline-install/dev-status.svg)](https://david-dm.org/alykoshin/inline-install#info=devDependencies)


# inline-install

Inline Installation helper (check if installed, prompt user and install) for Chrome Web Store Extensions. Intended to be used with Browserify.

This package allows to:
- check if the extension is already installed (requires minor changes to the extension)
- ask the user for the extension installation (user action is required to allow the installation)
- add \<link\> element for the extension to document \<head\> (required for the installation) 
- trigger Chrome extension installation from Chrome Web Store.


Compatibility note

!!! This package adds `InlineInstall` to global browser namespace `window`. This is temporarily solution for backward compatibility with WRTC package.



If you have different needs regarding the functionality, please add a [feature request](https://github.com/alykoshin/inline-install/issues).


## Installation

```sh
npm install --save inline-install
```

## Usage

## Prerequisites

In order to enable Inline Install for the extension, please refer to 'Using Inline Installation' in '[More Info](#more-info)' section.
- Inline install option must be **enabled** for your extension at extension page in Developer Dashboard: 
 ![doc/img/this-item-must-use-inline-install.png](doc/img/this-item-must-use-inline-install.png)
- Your site must be on the list of verified sites for this extension 
- Enable automatic check if the extension is already installed in browser (see below)

### Enable automatic check if extension is already installed in browser 

#### Step 1. Add to background page of your extension following code:

```js
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
```

You may also add new script (for example, if you do not have yet background pages in your extension), like `bInlineInstall.js` containing only the code above and add this file name to `background` `scripts` array of your `manifest.json` to make it looking like below:

```
  "background": {
    "scripts": [
      "bInlineInstall.js"
    ],
    "persistent": false
  },
```

#### Step 2. Add an entry to the `manifest.json` list of the allowed domains:

```json
  "externally_connectable": {
    "matches": [
      "*://localhost/*",
      "*://127.0.0.1/*"
    ]
  },
},
```

For more info on configuring Inline Install for Chrome extensions please refer to 'Using Inline Installation' in '[More Info](#more-info)' section


```
var InlineInstall = require('inline-install');

if ( window.chrome ) {

  var inlineInstall = new InlineInstall({
    // Extension Id in Chrome Web Store. Replace <itemId> with your 
    // value which is a part of extension url 
    // 'https://chrome.google.com/webstore/detail/<itemId>'
    itemId: <itemId>,
    // Check if the extension is already installed in the browser
    checkInstalled: true,
    // Object defining the prompt to be show to the user
    prompt: {
      // Inline Install must be initiated by user action; if you start the installation by some user action,
      // you may set `prompt.enabled` to `false` to avoid default prompt to be shown
      enabled: true,
      // Prompt text
      text: 'This site requires Chrome Extension to be installed. Proceed?'
    },
    // Reload current page in browser after successful installation    
    reloadOnSuccess: true   
  });
  
  inlineInstall.on('error', function(errorString, errorCode) {
    alert( 'InlineInstall: Error: ' + errorString + 
      ', code: ' + (errorCode || '') );
  });
  
  inlineInstall.on('downloadprogress', function(percentDownloaded) {
    console.log('InlineInstall: Download Progress: '+percentDownloaded+'%');
  });
  
  inlineInstall.on('installstagechanged', function(installStage) {
    console.log('InlineInstall: Install Stage changed'+
      ', new stage: \'' + installStage + '\'');
  });
  
  inlineInstall.on('success', function() {
    console.log('InlineInstall: Extension is installed.');
  });
  
  inlineInstall.execute();
}
```

## Class InlineInstall

This class is used to create Chrome Web Store Extension installation helper.

InlineInstall is a [MiniEmitter](https://www.npmjs.com/package/mini-emitter) with following methods and events:


### Event: 'error'

- `errorString` - contains string description of error
- [`errorCode`] - optional, contains error code. More Info: https://developer.chrome.com/extensions/webstore#type-ErrorCode

Emitted when error occurs.  


### Event: 'downloadprogress'

- `percentDownloaded` number

Emitted when extension was successfully installed in browser (triggered when `chrome.webstore` fires `onDownloadProgress` event). More Info: https://developer.chrome.com/extensions/webstore#event-onDownloadProgress


### Event: 'installstagechanged'

- `installStage` - {'installing' or 'downloading'} - The [InstallStage](https://developer.chrome.com/extensions/webstore#type-InstallStage) that just began.

Emitted when extension was successfully installed in browser (triggered when `chrome.webstore` fires `onInstallStageChanged` event). More Info: https://developer.chrome.com/extensions/webstore#event-onInstallStageChanged 


### Event: 'success'

Emitted in one of following cases:
- when extension was already installed before and no action was taken
- when extension was successfully installed in browser during the last call to `execute()` (triggered when `chrome.webstore.install()` called success callback). 

At the moment there is no option to differentiate between this two situations.


### new InlineInstall(options)

- Parameter `options` is an object consisting of following properties:
  - `itemId`          - Extension Id in Chrome Web Store which is a part of extension url 'https://chrome.google.com/webstore/detail/\<itemId\>'
  - `checkInstalled`  - Check if the extension is already installed in the browser (default: `true`)
  - `prompt`          - Object defining the prompt to be shown to the user, containing of following properties:
    - `enabled`       - Inline Install must be initiated by user action;
                        if you start this installation code by some user action,
                        you may set `prompt.enabled` to `false` to avoid default prompt to be shown
                        (default: `true`)
    - `text`          - Text to prompt the user (default: `This site requires Chrome Extension to be installed. Proceed with the installation?`)
    - `ok`            - Optional, OK button text (default: `OK`)
    - `cancel`        - Optional, Cancel button text (default: `Cancel`)
  - `reloadOnSuccess` - Reload current page on successful installation (default: `true`)
  
Construct a new object. 


### execute()
Main method, executing following:
- Checks if the extension is already installed
- Adds `<link>` element referencing the extension to `<head>` section of the document
- Prompts user for the permission
- Starts the extension installation
- Proxies `chrome.webstore` events and errors to own events 
- Reloads page on successful installation (if `reloadOnSuccess` set to `true`) with `location.reload()`


## More Info

- Using Inline Installation - https://developer.chrome.com/webstore/inline_installation
- Developer Dashboard       - Chrome Web Store - https://chrome.google.com/webstore/developer/dashboard/
- chrome.webstore           - https://developer.chrome.com/extensions/webstore
- Packaging                 - https://developer.chrome.com/extensions/packaging
                              
                              
## Todo

- Replace `checkInstalled()` with `checkVersion()`
- Provide info if the extension was installed before or just now, during this call to `execute()`
- Add one more call to `checkInstalled()` after the extension installation which was reported as successful by `chrome.webstore.install()`.


## Credits

[Alexander](https://github.com/alykoshin/)


## Links to package pages:

[github.com](https://github.com/alykoshin/inline-install) &nbsp; [npmjs.com](https://www.npmjs.com/package/inline-install) &nbsp; [travis-ci.org](https://travis-ci.org/alykoshin/inline-install) &nbsp; [coveralls.io](https://coveralls.io/github/alykoshin/inline-install) &nbsp; [inch-ci.org](https://inch-ci.org/github/alykoshin/inline-install)


## License

MIT
