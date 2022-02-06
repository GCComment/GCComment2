import $ from "jquery";
import { html } from "lighterhtml";
import { AUTOMARKARCHIVE, AUTOMARKFOUND } from "../consts/preferences.js";
import { doLoadCommentFromGUID, doSaveCommentToGUID } from "../function/db.js";
import { GCC_getValue } from "../helper/storage.js";

export const gccommentOnLogPage = () => {
    if (("" + window.location).indexOf("LUID=") >= 0) {
        // do something if we watch the user log.
    } else {
        var guid = $("#ctl00_ContentBody_LogBookPanel1_WaypointLink")[0]
            .getAttribute("href")
            .split("guid=")[1];
        if (guid) {
            // Load comment from db
            var comment = doLoadCommentFromGUID(guid);

            // Skip if no comment is found
            if (comment) {
                var submitButton = $(
                    "#ctl00_ContentBody_LogBookPanel1_btnSubmitLog"
                )[0];
                $(submitButton).css("margin-top", "10px");

                var generateGccActionDiv = () => {
                    var markfoundCheckbox = "";
                    var markarchiveCheckbox = "";
                    return html`
                        <div style="padding:5px; border:solid 1px lightgray;">
                            ${markfoundCheckbox} ${markarchiveCheckbox}
                        </div>
                    `;
                };

                $(generateGccActionDiv())
                    .insertBefore(submitButton)
                    .append(submitButton);

                $(
                    "#ctl00_ContentBody_LogBookPanel1_btnSubmitLog"
                )[0].addEventListener(
                    "click",
                    (event) => {
                        var input = $(
                            "#ctl00_ContentBody_LogBookPanel1_ddLogType"
                        )[0];

                        var c = doLoadCommentFromGUID(guid);
                        if (c !== null) {
                            var markFoundState =
                                input.value == 2 && GCC_getValue(AUTOMARKFOUND)
                                    ? StateEnum.found
                                    : c.state;
                            var markArchiveState = GCC_getValue(AUTOMARKARCHIVE)
                                ? true
                                : c.archived;

                            c.state = markFoundState;
                            c.archived = markArchiveState;

                            doSaveCommentToGUID(c);
                        }
                    },
                    false
                );

                var input = $("#ctl00_ContentBody_LogBookPanel1_ddLogType")[0];
                if (input.value == 2) markfound.style.display = "inline";
                else markfound.style.display = "none";

                input.addEventListener(
                    "change",
                    () => {
                        if (input.value == 2) {
                            markfound.style.display = "inline";
                        } else markfound.style.display = "none";
                    },
                    false
                );
            }
        }
    }
};
