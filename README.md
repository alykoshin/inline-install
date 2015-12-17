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
  inlineInstall.on('error', function(error) {
    alert(error);
  });
  inlineInstall.on('error', function() {
    console.log('Extension successfully installed.');
  });
  inlineInstall.execute();
}
```

### Events


## More Info
Using Inline Installation - https://developer.chrome.com/webstore/inline_installation
Developer Dashboard - Chrome Web Store - https://chrome.google.com/webstore/developer/dashboard/

## Credits
[Alexander](https://github.com/alykoshin/)


# Links to package pages:

[github.com](https://github.com/alykoshin/inline-install) &nbsp; [npmjs.com](https://www.npmjs.com/package/inline-install) &nbsp; [travis-ci.org](https://travis-ci.org/alykoshin/inline-install) &nbsp; [coveralls.io](https://coveralls.io/github/alykoshin/inline-install) &nbsp; [inch-ci.org](https://inch-ci.org/github/alykoshin/inline-install)


## License

MIT
