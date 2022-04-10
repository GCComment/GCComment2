import $ from "jquery";
import { GCC_getValue } from "../../helper/storage.js";
import {
    SETTINGS_LANGUAGE,
    SETTINGS_LANGUAGE_AUTO,
    SETTINGS_LANGUAGE_DE,
    SETTINGS_LANGUAGE_EN
} from "../preferences.js";
import { Language } from "./languageClass.js";
import { language_de } from "./language_de.js";
import { language_en } from "./language_en.js";

/**
 * @type {Record<string, Language>}
 */
const languages = {};

const loadLanguages = () => {
    registerLanguage(SETTINGS_LANGUAGE_EN, language_en);
    registerLanguage(SETTINGS_LANGUAGE_DE, language_de);
};

const registerLanguage = (
    /** @type {string} */ langName,
    /** @type {Language} */ lang
) => {
    var languageWithFallback = language_en;
    Object.assign(languageWithFallback, lang);
    languages[langName] = languageWithFallback;
};

/**
 * @returns {Language}
 */
const getLanguage = () => {
    loadLanguages();
    const langsetting = GCC_getValue(SETTINGS_LANGUAGE);

    if (langsetting === SETTINGS_LANGUAGE_AUTO) {
        if ($(".selected-language > a:first")) {
            const gslang = $(".selected-language > a:first").text();
            if (gslang.indexOf("English") > -1)
                return languages[SETTINGS_LANGUAGE_EN];
            else if (gslang.indexOf("Deutsch") > -1)
                return languages[SETTINGS_LANGUAGE_DE];
        }
    } else if (languages[langsetting]) {
        return languages[langsetting];
    }

    return languages[SETTINGS_LANGUAGE_EN];
};

/**
 * @type {Language}
 */
export const lang = getLanguage();
