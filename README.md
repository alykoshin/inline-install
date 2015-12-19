[![npm version](https://badge.fury.io/js/inline-install.svg)](http://badge.fury.io/js/inline-install)
[![Build Status](https://travis-ci.org/alykoshin/inline-install.svg)](https://travis-ci.org/alykoshin/inline-install)
[![Coverage Status](https://coveralls.io/repos/alykoshin/inline-install/badge.svg?branch=master&service=github)](https://coveralls.io/github/alykoshin/inline-install?branch=master)
[![Code Climate](https://codeclimate.com/github/alykoshin/inline-install/badges/gpa.svg)](https://codeclimate.com/github/alykoshin/inline-install)
[![Inch CI](https://inch-ci.org/github/alykoshin/inline-install.svg?branch=master)](https://inch-ci.org/github/alykoshin/inline-install)

[![Dependency Status](https://david-dm.org/alykoshin/inline-install/status.svg)](https://david-dm.org/alykoshin/inline-install#info=dependencies)
[![devDependency Status](https://david-dm.org/alykoshin/inline-install/dev-status.svg)](https://david-dm.org/alykoshin/inline-install#info=devDependencies)


# inline-install

Inline Installation helper (prompt user and install) for Chrome Web Store Extensions.
Intended to be used with Browserify.

This package allows to:
- ask the user for the extension installation (user action is required to allow the installation)
- add \<link\> element for the extension to document \<head\> (required for the installation) 
- trigger Chrome extension installation from Chrome Web Store.

In order to enable Inline Install for the extension, please refer to the link 'Using Inline Installation' in 'More Info' section (
- Inline install option must be enabled for your extension 
- Your site must be on the list of verified sites for this extension 
For more info on configuring Inline Install for Chrome extensions please refer to the link 'Using Inline Installation' in 'More Info' section (

!!! This package adds `InlineInstall` to global browser namespace `window`. This is temporarily solution for backward compatibility with WRTC package.

If you have different needs regarding the functionality, please add a [feature request](https://github.com/alykoshin/inline-install/issues).


## Installation

```sh
npm install --save inline-install
```

## Usage

```
var InlineInstall = require('inline-install');

if ( window.chrome ) {

  var inlineInstall = new InlineInstall({
    url:  'https://chrome.google.com/webstore/detail/<itemId>', // URL for the installation. Replace <itemId> with your extension ID
    text: 'This site requires Chrome Extension to be installed. Proceed?', // Text to show to the user
    reloadOnSuccess: true  // Reload current page on successful installation 
  });
  
  inlineInstall.on('error', function(errorString, errorCode) {
    alert( error + (errorCode || '') );
  });
  
  inlineInstall.on('downloadprogress', function(percentDownloaded) {
    console.log('Download Progress: '+percentDownloaded+'%');
  });
  
  inlineInstall.on('installstagechanged', function(installStage) {
    console.log('Install Stage changed, new stage: \'' + installStage + '\'');
  });
  
  inlineInstall.on('success', function() {
    console.log('Extension successfully installed.');
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
Emitted when extension was successfully installed in browser (triggered when chrome.webstore fires onDownloadProgress event). More Info: https://developer.chrome.com/extensions/webstore#event-onDownloadProgress

### Event: 'installstagechanged'
- `installStage` - {'installing' or 'downloading'} - The [InstallStage](https://developer.chrome.com/extensions/webstore#type-InstallStage) () that just began.
Emitted when extension was successfully installed in browser (triggered when chrome.webstore fires onInstallStageChanged event). More Info: https://developer.chrome.com/extensions/webstore#event-onInstallStageChanged 

### Event: 'success'
Emitted when extension was successfully installed in browser (triggered when chrome.webstore.install() called success callback). 

### new InlineInstall(options)
Construct a new object. 
- options
-- `url`             - URL for the installation in form 'https://chrome.google.com/webstore/detail/<itemId>'; replace <itemId> with your extension ID
-- `text`            - Text to show to the user
-- `reloadOnSuccess` - Reload current page on successful installation


### execute()
- Adds \<link\> to the extension to \<head\> section of the document
- Prompts user for the permission
- Triggers the extension installation



## More Info
Using Inline Installation - https://developer.chrome.com/webstore/inline_installation
Developer Dashboard - Chrome Web Store - https://chrome.google.com/webstore/developer/dashboard/
chrome.webstore - https://developer.chrome.com/extensions/webstore

## Credits
[Alexander](https://github.com/alykoshin/)


# Links to package pages:

[github.com](https://github.com/alykoshin/inline-install) &nbsp; [npmjs.com](https://www.npmjs.com/package/inline-install) &nbsp; [travis-ci.org](https://travis-ci.org/alykoshin/inline-install) &nbsp; [coveralls.io](https://coveralls.io/github/alykoshin/inline-install) &nbsp; [inch-ci.org](https://inch-ci.org/github/alykoshin/inline-install)


## License

MIT
