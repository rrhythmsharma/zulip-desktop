'use strict';

const { SpellCheckHandler, ContextMenuListener, ContextMenuBuilder } = require('electron-spellchecker');

const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
 
const isoConv = require('isolanguageconverter');
 
const ConfigUtil = require(__dirname + '/utils/config-util.js');
const Logger = require(__dirname + '/utils/logger-util.js');

const logger = new Logger({
	file: 'errors.log',
	timestamp: true
});

class SetupSpellChecker {
	init(input) {
		if (ConfigUtil.getConfigItem('enableSpellchecker')) {
			this.enableSpellChecker();
		}
		this.enableContextMenu(input);
	}

	enableSpellChecker() {
		try {
			this.SpellCheckHandler = new SpellCheckHandler();
		} catch (err) {
			logger.error(err);
		}
	}

	enableContextMenu(input) {
		if (this.SpellCheckHandler) {
			this.SpellCheckHandler.attachToInput();

			alert(input);
			let langname = lngDetector.detect(input, 1);
			alert(langname[0][0]);

			alert(isoConv(langname[0][0]));
			// const userLanguage = ConfigUtil.getConfigItem('spellcheckerLanguage');

			// eslint-disable-next-line no-unused-expressions
			// process.platform === 'darwin' ?
				// On macOS, spellchecker fails to auto-detect the lanugage user is typing in
				// that's why we need to mention it explicitly
				// this.SpellCheckHandler.switchLanguage(userLanguage) :
				// On Linux and Windows, spellchecker can automatically detects the language the user is typing in
				// and silently switches on the fly; thus we can start off as US English
			
			
			this.SpellCheckHandler.switchLanguage('en-US');
		}

		const contextMenuBuilder = new ContextMenuBuilder(this.SpellCheckHandler);
		this.contextMenuListener = new ContextMenuListener(info => {
			contextMenuBuilder.showPopupMenu(info);
		});
	}

	unsubscribeSpellChecker() {
		// eslint-disable-next-line no-undef
		if (this.SpellCheckHandler) {
			this.SpellCheckHandler.unsubscribe();
		}
		if (this.contextMenuListener) {
			this.contextMenuListener.unsubscribe();
		}
	}
}

module.exports = new SetupSpellChecker();
