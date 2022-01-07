import $ from 'jquery';
import {lang} from "../../../consts/language";
import {html} from "lighterhtml";
import {
    AUTO_UPDATE_GS_FINAL,
    AUTO_UPLOAD_CACHE_NOTES,
    ENABLE_EXPORT,
    LAZY_TABLE_REFRESH,
    SETTINGS_LANGUAGE,
    SETTINGS_LANGUAGE_DE,
    SETTINGS_LANGUAGE_EN
} from "../../../consts/preferences";
import {appendCheckBox} from "../../other/controls";
import {GCC_setValue} from "../../../helper/storage.js"
import {GCC_getValue} from "../../../helper/storage.js"

export const generateConfigDiv = () => {
    return html`
        <div id="configDiv" onload=${initLangSettings} style="display:none;margin:5px;padding:10px;outline:1px solid #D7D7D7;position:relative;background-color:#EBECED">
            <p style="width:600px">
                ${lang.settings_intro}
            </p>
            <a target="_blank" rel="noopener" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8FK6XVH5SULGL" style="position:absolute;left:650px;top:10px;text-align:center;text-decoration:none;">
                ${lang.settings_feelfree}
                <br>
                <img src="https://www.paypal.com/en_US/i/btn/btn_donate_SM.gif">
                <br>
                ${lang.thank_you}
            </a>
            ${appendCheckBox(ENABLE_EXPORT, lang.settings_allowExport)}
            ${appendCheckBox(LAZY_TABLE_REFRESH, lang.settings_lazyTable)}
            ${appendCheckBox(AUTO_UPDATE_GS_FINAL, lang.settings_syncWithGS)}
            ${appendCheckBox(AUTO_UPLOAD_CACHE_NOTES, lang.settings_saveCacheNotes)}
            ${lang.settings_language}:
            <select id="languageSelector" name="languageSelector" onchange=${onLanguageSelectorChange} size=1 style="margin-left:5px;">
                <option>${lang.SETTINGS_LANGUAGE_AUTO}</option>
                <option>${lang.SETTINGS_LANGUAGE_EN}</option>
                <option>${lang.SETTINGS_LANGUAGE_DE}</option>
            </select>           
        </div>          
    `;
};

const initLangSettings = function(){
    var langsetting = GCC_getValue(SETTINGS_LANGUAGE);
    if (langsetting === SETTINGS_LANGUAGE_EN || langsetting === SETTINGS_LANGUAGE_DE)
        $('#languageSelector').val(langsetting);
    else
        $('#languageSelector').val(lang.SETTINGS_LANGUAGE_AUTO);
};

const onLanguageSelectorChange = function () {
    GCC_setValue(SETTINGS_LANGUAGE, $('#languageSelector option:selected').text());
    // showSuccessIcon(languageSelector);
};
