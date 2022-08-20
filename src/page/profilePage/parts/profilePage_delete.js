// event handler delete button (#deleteAllDivButton)
import $ from "jquery";
import { html } from "lighterhtml";
import { lang } from "../../../consts/language/language";
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
    FILTER_TYPE_DELETE
} from "../../../consts/preferences";
import { getFilteredComments } from "../../../function/db.js";
import { log } from "../../../helper/logger";
import { GCC_getValue } from "../../../helper/storage.js";
import { appendCheckBox, appendRadioGroup } from "../../other/controls";

const toggleDeleteAllFilterOptions = () => {
    if (GCC_getValue(DELETEALL_FILTER_ALL)) {
        $("#DELETEALL_FILTER_UNTYPED").attr("disabled", "disabled");
        $("#DELETEALL_FILTER_UNSOLVED").attr("disabled", "disabled");
        $("#DELETEALL_FILTER_SOLVED").attr("disabled", "disabled");
        $("#DELETEALL_FILTER_FOUND").attr("disabled", "disabled");
    } else {
        $("#DELETEALL_FILTER_UNTYPED").removeAttr("disabled");
        $("#DELETEALL_FILTER_UNSOLVED").removeAttr("disabled");
        $("#DELETEALL_FILTER_SOLVED").removeAttr("disabled");
        $("#DELETEALL_FILTER_FOUND").removeAttr("disabled");
    }
};

function performFilteredDeleteAll() {
    const check = confirm(lang.delete_confirmation);
    if (check) {
        const keys = GM_listValues();
        // log("info", "all keys: " + keys);
        let resultRemoved = "<ul>";
        let removedCount = 0;

        const commentsToDelete = getFilteredComments(FILTER_TYPE_DELETE);
        for (let i = 0; i < commentsToDelete.length; i++) {
            var comment = commentsToDelete[i];
            log("info", `deleted: ${comment.gccode} (${comment.name})`);
            comment.delete();
        }
    }
}

export const generateDeleteAllDiv = () => {
    const initFilterOptionsDisabledState = () => {
        setTimeout(toggleDeleteAllFilterOptions, 500);
    };

    return html`
        <div
            id="deleteAllDiv"
            style="display:none;margin:5px;padding:10px;outline:1px solid #D7D7D7;position:relative;background-color:#EBECED"
        >
            ${lang.delete_select}
            <br />
            ${appendCheckBox(
                DELETEALL_FILTER_ALL,
                lang.all,
                toggleDeleteAllFilterOptions
            )}
            ${appendCheckBox(DELETEALL_FILTER_UNTYPED, lang.type_untyped)}
            ${appendCheckBox(DELETEALL_FILTER_UNSOLVED, lang.type_unsolved)}
            ${appendCheckBox(DELETEALL_FILTER_SOLVED, lang.type_solved)}
            ${appendCheckBox(DELETEALL_FILTER_FOUND, lang.type_found)}
            ${appendRadioGroup(
                DELETEALL_FILTER_ARCHIVED,
                [
                    {
                        label: lang.both,
                        attr: DELETEALL_FILTER_ARCHIVED_BOTH
                    },
                    {
                        label: lang.not_archived,
                        attr: DELETEALL_FILTER_ARCHIVED_NOT_ARCHIVED
                    },
                    {
                        label: lang.archived,
                        attr: DELETEALL_FILTER_ARCHIVED_ARCHIVED
                    }
                ],
                GCC_getValue(
                    DELETEALL_FILTER_ARCHIVED,
                    DELETEALL_FILTER_ARCHIVED_BOTH
                )
            )}
            <br />
            <input
                id="deleteAllButton"
                type="button"
                value="${lang.delete_perform}"
                onclick=${performFilteredDeleteAll}
            />
            <div id="deleteAllResult" />
            <!-- prettier-ignore -->
            <script>
                ${initFilterOptionsDisabledState}
            </script>
        </div>
    `;
};
