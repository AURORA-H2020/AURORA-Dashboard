// import(`./${language}/${namespace}.json`);

var en = require(`./en/translations.json`);
var de = require(`./de/translations.json`);

const i18n = {
    translations: {
        en,
        de,
    },
    defaultLang: "en",
    useBrowserDefault: true,
    // optional property will default to "query" if not set
    languageDataStore: "localStorage",
};

module.exports = i18n;
