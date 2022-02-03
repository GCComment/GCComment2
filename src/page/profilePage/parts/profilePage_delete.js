// event handler delete button (#deleteAllDivButton)
import $ from 'jquery';
import {lang} from "../../../consts/language";
import {html} from "lighterhtml";
import {
    DELETEALL_FILTER_ALL,
    DELETEALL_FILTER_ARCHIVED,
    DELETEALL_FILTER_ARCHIVED_ARCHIVED,
    DELETEALL_FILTER_ARCHIVED_BOTH,
    DELETEALL_FILTER_ARCHIVED_NOT_ARCHIVED,
    DELETEALL_FILTER_FOUND,
    DELETEALL_FILTER_SOLVED,
    DELETEALL_FILTER_UNSOLVED,
    DELETEALL_FILTER_UNTYPED,
    EXPORT_FILTER_ALL
} from "../../../consts/preferences";
import {appendCheckBox, appendRadioGroup} from "../../other/controls";
import {log} from "../../../helper/logger";
import {ARCHIVED, COMPREFIX} from "../../../consts/general";
import {doLoadCommentFromGUID} from "../../../function/db";
import {GCC_getValue} from "../../../helper/storage.js"
import { StateEnum } from '../../../dataClasses/stateEnum';

const toggleDeleteAllFilterOptions = () => {
    if (GCC_getValue(DELETEALL_FILTER_ALL)) {
        $('#DELETEALL_FILTER_UNTYPED').attr('disabled', 'disabled');
        $('#DELETEALL_FILTER_UNSOLVED').attr('disabled', 'disabled');
        $('#DELETEALL_FILTER_SOLVED').attr('disabled', 'disabled');
        $('#DELETEALL_FILTER_FOUND').attr('disabled', 'disabled');
    } else {
        $('#DELETEALL_FILTER_UNTYPED').removeAttr('disabled');
        $('#DELETEALL_FILTER_UNSOLVED').removeAttr('disabled');
        $('#DELETEALL_FILTER_SOLVED').removeAttr('disabled');
        $('#DELETEALL_FILTER_FOUND').removeAttr('disabled');
    }
};

function performFilteredDeleteAll() {
    const check = confirm(lang.delete_confirmation);
    if (check) {
        const keys = GM_listValues();
        // log("info", "all keys: " + keys);
        let resultRemoved = "<ul>";
        let removedCount = 0;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key.indexOf(COMPREFIX) > -1) {
                const comment = doLoadCommentFromGUID(key.substr(COMPREFIX.length));

                const isArchived = (comment.archived === ARCHIVED);
                const archiveSetting = GCC_getValue(DELETEALL_FILTER_ARCHIVED);
                const includeArchive = ((archiveSetting === DELETEALL_FILTER_ARCHIVED_BOTH)
                    || (archiveSetting === DELETEALL_FILTER_ARCHIVED_ARCHIVED && isArchived) || (archiveSetting === DELETEALL_FILTER_ARCHIVED_NOT_ARCHIVED && !isArchived));

                if ((GCC_getValue(DELETEALL_FILTER_ALL) && includeArchive)
                    || (comment.state === StateEnum.unknown && GCC_getValue(DELETEALL_FILTER_UNTYPED) && includeArchive)
                    || (comment.state === StateEnum.unsolved && GCC_getValue(DELETEALL_FILTER_UNSOLVED) && includeArchive)
                    || (comment.state === StateEnum.solved && GCC_getValue(DELETEALL_FILTER_SOLVED) && includeArchive)
                    || (comment.state === StateEnum.found && GCC_getValue(DELETEALL_FILTER_FOUND) && includeArchive)) {

                    const removeTooltip = createCachePrintout(comment);
                    resultRemoved = resultRemoved
                        + "<li><a target='blank' href='http://www.geocaching.com/seek/cache_details.aspx?guid="
                        + comment.guid
                        + "'>"
                        + comment.name
                        + " ("
                        + comment.gccode
                        + ")</a>. "
                        + lang.tmpl_commentremoved.replace("{{1}}", Base64.encode(removeTooltip)).replace("{{2}}",
                            encodeURIComponent(removeTooltip)) + "</li>";
                    removedCount++;

                    log("info", "deleted: " + key + "(" + GCC_getValue(key) + ")");
                    comment.delete();
                }
            }
        }
        deleteAllResult.innerHTML = "<h4>" + lang.delete_result + ": " + removedCount + "</h4>" + resultRemoved;
    }
}

export const generateDeleteAllDiv = () => {
    const initFilterOptionsDisabledState = () =>{
        setTimeout(toggleDeleteAllFilterOptions, 500);
    };
    
    return html`
        <div id="deleteAllDiv" style="display:none;margin:5px;padding:10px;outline:1px solid #D7D7D7;position:relative;background-color:#EBECED">
            ${lang.delete_select}
            <br>
            ${appendCheckBox(DELETEALL_FILTER_ALL, lang.all, toggleDeleteAllFilterOptions)}
            ${appendCheckBox(DELETEALL_FILTER_UNTYPED, lang.type_untyped)}
            ${appendCheckBox(DELETEALL_FILTER_UNSOLVED, lang.type_unsolved)}
            ${appendCheckBox(DELETEALL_FILTER_SOLVED, lang.type_solved)}
            ${appendCheckBox(DELETEALL_FILTER_FOUND, lang.type_found)}

            ${
                appendRadioGroup(DELETEALL_FILTER_ARCHIVED, [{
                    label: lang.both,
                    attr: DELETEALL_FILTER_ARCHIVED_BOTH
                }, {
                    label: lang.not_archived,
                    attr: DELETEALL_FILTER_ARCHIVED_NOT_ARCHIVED
                }, {
                    label: lang.archived,
                    attr: DELETEALL_FILTER_ARCHIVED_ARCHIVED
                }], GCC_getValue(DELETEALL_FILTER_ARCHIVED, DELETEALL_FILTER_ARCHIVED_BOTH))
            }
            <br>
            <input id="deleteAllButton" type="button" value="${lang.delete_perform}" onclick=${performFilteredDeleteAll}/>
            <div id="deleteAllResult" /> 
            <script>                
                ${initFilterOptionsDisabledState}
            </script>     
        </div>
    `;
};