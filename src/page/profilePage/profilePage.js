// @ts-ignore
// css hack
import jquery_dataTables_css from "bundle-text:datatables.net-dt/css/jquery.dataTables.css";
import $ from 'jquery';
import { html, render } from "lighterhtml";
import { LAST_EXPORT, LAST_IMPORT } from "../../consts/general";
import { gccIcon } from "../../consts/icons";
import { lang } from "../../consts/language";
import { ARCHIVE_FILTER_NO_ARCHIVED, SETTING_ARCHIVE_FILTER } from "../../consts/preferences.js";
import { getNumberOfComments } from "../../function/db";
import { appendCSS } from "../../helper/css.js";
import { log } from "../../helper/logger";
import { GCC_getValue, GCC_setValue } from "../../helper/storage.js";
import { createTimeString } from "../../helper/time";
import { tooltip } from '../../helper/tooltip.js';
import { version } from "../../helper/versionInfo";
import { addCommentBubblesToPage } from "../other/addCommentBubblesToPage.js";
import { generateDisplayFilters, generateTableDiv, refreshTableDiv } from "./parts/profilePage_commenttable";
import { generateConfigDiv } from "./parts/profilePage_config";
import { generateDeleteAllDiv } from "./parts/profilePage_delete";
import { generateExportDiv } from "./parts/profilePage_export";
import { generateImportDiv } from "./parts/profilePage_import";
import { generatePatchDiv } from "./parts/profilePage_patch";

const generateGccRoot = (targetNode) => { 
    return render(targetNode, html`
                <div id="gccRoot" class="tableGCComment" style="outline:1px solid #D7D7D7;margin-bottom:-10px;padding:2px;min-width:1000px;max-width:1300px;margin:auto;">
                    <a id="configDivButton" title="${lang.menu_options}" onmouseup=${onConfigDivButtonMouseUp} onmouseover=${onConfigDivButtonMouseover} onmouseout=${onConfigDivButtonMouseOut} style="cursor:pointer;padding-left:5px;padding-right:5px;margin-left:5px">
                        <img src="${gccIcon}" style="vertical-align:middle;"/>
                    </a>
                    &nbsp;|&nbsp;
                    <a id="gccommenttabledivButton" onmouseup=${onGccommenttabledivButtonMouseUp} style="cursor:pointer;text-decoration:none;padding-left:5px;padding-right:5px">
                        ${lang.menu_showmycomments}
                    </a>
                    
                    ${generateDisplayFilters()}
                    
                    &nbsp;|&nbsp;
                    <a id="exportDivButton" onmouseup=${onExportDivButtonMouseUp} style="cursor:pointer;text-decoration:none;padding-left:5px;padding-right:5px">
                        ${lang.menu_export}
                    </a>
                    &nbsp;|&nbsp;
                    <a id="importDivButton" onmouseup=${onImportDivButtonMouseUp} style="cursor:pointer;text-decoration:none;padding-left:5px;padding-right:5px">
                        ${lang.menu_import}
                    </a>
                    &nbsp;|&nbsp;
                    <a id="deleteAllDivButton" onmouseup=${onDeleteAllDivButtonMouseUp} style="cursor:pointer;text-decoration:none;padding-left:5px;padding-right:5px">
                        ${lang.menu_delete}
                    </a>
                    &nbsp;|&nbsp;
                    <a id="patchDivButton" onmouseup=${onPatchDivButtonMouseUp} style="display:none;cursor:pointer;text-decoration:none;padding-left:5px;padding-right:5px">
                        ${lang.menu_patchgpx}
                    </a>
                    
                    ${generateConfigDiv()}
                    ${generateTableDiv()}
                    ${generateExportDiv()}
                    ${generateImportDiv()}
                    ${generatePatchDiv()}
                    ${generateDeleteAllDiv()}
                </div>
            `);
}

const onGccommenttabledivButtonMouseUp = function () {
    toggleTabOnProfile('gccommenttablediv');
};


const onDeleteAllDivButtonMouseUp = function () {
    toggleTabOnProfile('deleteAllDiv');
};


const onExportDivButtonMouseUp = function () {
    toggleTabOnProfile('exportDiv');
};

const onImportDivButtonMouseUp = function () {
    toggleTabOnProfile('importDiv');
};

const onPatchDivButtonMouseUp = function () {
    toggleTabOnProfile('patchDiv');
};


const onConfigDivButtonMouseover = function (evt) {
    var lastim = GCC_getValue(LAST_IMPORT);
    var lastex = GCC_getValue(LAST_EXPORT);

    var stats = html`
            <p style="font-size:13px;">
                <u>
                    <b>GCComment v${version}</b>
                </u>
                <br>
                <b>${lang.ov_totalamount}</b>
                ${getNumberOfComments()} (${GCC_getValue('countWhite')} ${lang.type_untyped}, ${GCC_getValue('countRed')} ${lang.type_unsolved},
                ${GCC_getValue('countGreen')} ${lang.type_solved}, ${lang.and} ${GCC_getValue('countGray')} ${lang.type_found})
                <br/>
                <b>${lang.ov_amountarchive}</b> ${GCC_getValue('countArchive')}
                <br/>
                <b>${lang.ov_lastim}: </b> ${lastim ? createTimeString(lastim) : lang.never}
                <br/>
                <b>${lang.ov_lastex}: </b> ${lastex ? createTimeString(lastex) : lang.never}
                <br/>
                <b>${lang.ov_lastup}: </b> ${createTimeString(parseInt(GCC_getValue('updateDate')))}
            </p>
        `;
    tooltip.show(stats, 500);
};

const onConfigDivButtonMouseUp = function (evt) {
    toggleTabOnProfile('configDiv');
};

const onConfigDivButtonMouseOut = function (evt) {
    tooltip.hide();
};

export const toggleTabOnProfile = function (tabid) {
    log('debug', 'tabid ' + tabid);
    // do specials
    if ((tabid == 'gccommenttablediv')
            && ($('#gccommenttablediv').css('display') === 'none')) {
        refreshTableDiv(false);
        $("#displayFilters").css("display", "inline");
    } else {
        $("#displayFilters").css("display", "none");
    }

    // perfom actual toggle
    $('#' + tabid).slideToggle('slow');
    $('#' + tabid + 'Button').toggleClass('gccselect');

    // hide others
    if ((tabid != 'configDiv') && ($('#configDiv').css('display') != 'none')) {
        $('#configDiv').slideToggle('slow');
        $('#configDivButton').removeClass('gccselect');
    }
    if ((tabid != 'exportDiv') && ($('#exportDiv').css('display') != 'none')) {
        $('#exportDiv').slideToggle('slow');
        $('#exportDivButton').removeClass('gccselect');
    }
    if ((tabid != 'importDiv') && ($('#importDiv').css('display') != 'none')) {
        $('#importDiv').slideToggle('slow');
        $('#importDivButton').removeClass('gccselect');
    }
    if ((tabid != 'deleteAllDiv') && ($('#deleteAllDiv').css('display') != 'none')) {
        $('#deleteAllDiv').slideToggle('slow');
        $('#deleteAllDivButton').removeClass('gccselect');
    }
    if ((tabid != 'patchDiv') && ($('#patchDiv').css('display') != 'none')) {
        $('#patchDiv').slideToggle('slow');
        $('#patchDivButton').removeClass('gccselect');
    }
    if ((tabid != 'gccommenttablediv') && ($('#gccommenttablediv').css('display') != 'none')) {
        $('#gccommenttablediv').slideToggle('slow');
        $('#gccommenttabledivButton').removeClass('gccselect');
        $('#displayFilters').css("display", "none");
    }
}

export const gccommentOnProfilePage = function (newGcDesign = false) {
    // append Datatables CSS
    appendCSS('text',  jquery_dataTables_css);

    appendCSS('text', '.odd{background-color:#ffffff} .even{background-color:#E8E8E8}'
        + '.ui-icon{display:inline-block;}' + ' .tableStateIcon{width: 11px;margin-right:3px}'
        + '.haveFinalIcon{margin-left:3px;width:14px}');

    // styling the table's content
    appendCSS('text', '.tableFinal, .tableComment, .tableWaypoints{margin: 0px;} .tableComment{font-family:monospace;font-size:small; white-space: pre-line; word-wrap: break-word;} .tableWaypoints{width: 100%}');
    appendCSS('text', '.tableGCComment {text-transform:none; font-size:small;} label{font-size: small; font-weight:400;text-transform:none;display:initial;margin-bottom:4px;max-width:100%} select{display:initial;font-size: small; background: none; width:auto;padding:initial;-moz-appearance:listbox;-webkit-appearance:listbox;}');


    // load settings
    let archivedFilter = GCC_getValue(SETTING_ARCHIVE_FILTER);
    if (!archivedFilter) {
        archivedFilter = ARCHIVE_FILTER_NO_ARCHIVED;
        GCC_setValue(SETTING_ARCHIVE_FILTER, ARCHIVE_FILTER_NO_ARCHIVED);
    }

    // add links to each entry on that page
    addCommentBubblesToPage();

    
    // add overview of all comments on top of page
    var anchorNode;
    if(newGcDesign){
        anchorNode = document.getElementsByClassName('alert');
    }
    else{
        anchorNode = document.getElementsByTagName('h2');
    }   
    
    if (anchorNode.length > 0) {
        const root = anchorNode[0];
        root.parentNode.insertBefore(html.node`<div id="gccRootContainer"/>`, root.nextSibling);
        generateGccRoot($('#gccRootContainer')[0]);
    }
}