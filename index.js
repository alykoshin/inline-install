/**
 * Created by alykoshin on 9/30/14.
 */

/* globals chrome */

'use strict';

if ( typeof module !== 'undefined' && typeof require !== 'undefined') {
  var Emitter = require('mini-emitter');
}

//

/**
 *
 * @param options
 * @param {string} options.itemId                  - itemId of the Extension in Chrome Web Store
 * @param {boolean} [options.checkInstalled=true]  - Check if the extension is already installed in the browser
 * @param {boolean} [options.reloadOnSuccess=true] - Reload page on success
 * @param {string} [options.prompt.text='This site requires Chrome Extension to be installed. Proceed with the installation?] - Text to show to the user
 * @param {string} [options.prompt.ok='OK]         - OK button text
 * @param {string} [options.prompt.cancel='Cancel] - Cancel button text
 * @returns {InlineInstall}
 * @constructor
 */
var InlineInstall = function(options) {
  var self = this;
  Emitter(self);

  if (!options || !options.itemId) {
    throw 'InlineInstall: execute(): options and options.id are mandatory.';
  }
  var baseStoreUrl = 'https://chrome.google.com/webstore/detail/';
  var extensionUrl = baseStoreUrl + options.itemId;
  options.prompt = options.prompt || {};
  options.prompt.text   = options.prompt.text   || 'This site requires Chrome Extension to be installed. Proceed with the installation?';
  options.prompt.ok     = options.prompt.ok     || 'OK';
  options.prompt.cancel = options.prompt.cancel || 'Cancel';
  if (typeof options.checkInstalled  === 'undefined') { options.checkInstalled  = true; }
  if (typeof options.reloadOnSuccess === 'undefined') { options.reloadOnSuccess = true; }

  var h = 40; // Prompt height

  var showPrompt = function (text, okText, cancelText, onClickCb) {
    var w = window;

    var i = document.createElement('iframe');
    i.style.position = 'fixed';
    i.style.top = '-' + (h+1) + 'px';
    i.style.left  = 0;
    i.style.right = 0;
    i.style.width  = '100%';
    i.style.height = h+'px';
    i.style.backgroundColor = '#ffffe0';
    i.style.border = 'none';
    i.style.borderBottom = '1px solid #888888';
    i.style.zIndex = '9999999';
    if (typeof i.style.webkitTransition === 'string') {
      i.style.webkitTransition = 'all .25s ease-out';
    } else if(typeof i.style.transition === 'string') {
      i.style.transition       = 'all .25s ease-out';
    }
    document.body.appendChild(i);
    var c = (i.contentWindow) ? i.contentWindow :
            (i.contentDocument.document) ? i.contentDocument.document : i.contentDocument;
    c.document.open();
    c.document.write(
      '<span style="' +
      '  font-family: Helvetica, Arial, sans-serif; ' +
      '  font-size: .9rem; ' +
      '  padding: 7px; ' +
      '  vertical-align: middle; ' +
      '  cursor: default;' +
      '">' +
      text +
      '</span>');

    if (okText && onClickCb) {
      c.document.write(
        '<button id="okay">' + okText + '</button>' +
        '&nbsp;'+
        '<button>' + cancelText + '</button>');
      c.document.close();

      c.document.getElementById('okay').addEventListener('click', function(e) {
        // window.open(buttonLink, '_top');

        if (onClickCb) { onClickCb(); }

        e.preventDefault();
        try {
          event.cancelBubble = true;
        } catch(error) {
          // Mute the exception
        }
      });
    } else {
      c.document.close();
    }

    c.document.addEventListener('click', function() {
      w.document.body.removeChild(i);
    });

    setTimeout(function() {
      if (typeof i.style.webkitTransform === 'string') { i.style.webkitTransform = 'translateY('+h+'px)';
      } else if(typeof i.style.transform === 'string') { i.style.transform       = 'translateY('+h+'px)';
      } else {
        i.style.top = '0px';
      }
    }, 300);

  };

  self.init = function() {

  };


  var successCallback = function () {
    chrome.webstore.onInstallStageChanged.removeListener(onInstallStageChanged);
    chrome.webstore.onDownloadProgress.removeListener(onDownloadProgress);
    self.emit('success');
    if (options.reloadOnSuccess) {
      location.reload();
    }
  };

  var failureCallback = function (failureDetailString, errorCode) {
    chrome.webstore.onInstallStageChanged.addListener(onInstallStageChanged);
    chrome.webstore.onDownloadProgress.addListener(onDownloadProgress);
    self.emit('error', failureDetailString, errorCode);
  };

  var addLink = function(url) {
    var a  = document.createElement('link');
    a.href = url;
    a.rel = 'chrome-webstore-item';
    document.head.appendChild(a);
  };

  var onInstallStageChanged = function (installStage) {
    self.emit('installstagechanged', installStage);
  };

  var onDownloadProgress = function (percentDownloaded) {
    self.emit('downloadprogress', percentDownloaded);
  };

  var checkInstalled = function(responseCb) {
    chrome.runtime.sendMessage(
      options.id,
      { message: 'inline-install-check' },
      function (reply) {
        var isInstalled = reply && reply.installed;
        responseCb( isInstalled );
      });
  };

  var doInstall = function() {
    addLink(extensionUrl);
    try {
      chrome.webstore.onInstallStageChanged.addListener(onInstallStageChanged);
      chrome.webstore.onDownloadProgress.addListener(onDownloadProgress);

      return chrome.webstore.install(
        extensionUrl,
        successCallback,
        failureCallback
      );
    } catch (e) {
      failureCallback(e);
      return false;
    }
  };

  self.execute = function() {
    if (!window.chrome) {
      self.emit('error', 'You must use Chrome browser to enable Inline Installation for the extensions from Chrome Web Store');
    } else if (!chrome.webstore || !chrome.webstore.install) {
      self.emit('error', 'Your version of Chrome does not support Inline Installation for the extensions from Chrome Web Store');
    } else {
      if (options.checkInstalled) {
        checkInstalled(function(isInstalled) {
          if (isInstalled) {
            self.emit('success');
          } else {
            showPrompt(options.prompt.text, options.prompt.ok, options.prompt.cancel, doInstall);
          }
        });
      } else {
        showPrompt(options.prompt.text, options.prompt.ok, options.prompt.cancel, doInstall);
      }
    }
  };

  return self;
};


if (typeof module !== 'undefined') {
  module.exports = InlineInstall;
}

if (typeof window !== 'undefined') {
  window.InlineInstall = function(options) {
    console.log('window.InlineInstall: deprecated. Use require() instead');
    return InlineInstall.call(this, options);
  };
}
