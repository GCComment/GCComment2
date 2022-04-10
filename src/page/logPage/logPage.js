import $ from "jquery";
import { html, render } from "lighterhtml";
import { lang } from "../../consts/language/language";
import { AUTOMARKARCHIVE, AUTOMARKFOUND } from "../../consts/preferences.js";
import { StateEnum } from "../../dataClasses/stateEnum";
import {
    doLoadCommentFromGCCode,
    doLoadCommentFromGUID
} from "../../function/db.js";
import { appendCheckBox } from "../other/controls.js";
import { appendCSS } from "./../../helper/css";
import { waitForEl } from "./../../helper/wait";

export const gccommentOnLogPage = () => {
    var guid = $("#ctl00_ContentBody_LogBookPanel1_WaypointLink")
        .attr("href")
        .split("guid=")[1];
    if (guid) {
        var comment = doLoadCommentFromGUID(guid);
        if (comment) {
            var submitButton = $(
                "#ctl00_ContentBody_LogBookPanel1_btnSubmitLog"
            );
            submitButton.css("margin-top", "10px");

            submitButton.before("<div id='gccActionDiv'></div>");
            render($("#gccActionDiv")[0], generateLogActionSection());

            submitButton.on("click", () => {
                executeLogAction(comment);
            });
            $("#ctl00_ContentBody_LogBookPanel1_ddLogType").on(
                "change",
                updateFoudCheckboxVisibility
            );
            updateFoudCheckboxVisibility();
        }
    }
};

export const gccommentOnNewLogPage = () => {
    const gccode = /geocache\/(\w+)/.exec(location.href)[1].toUpperCase();
    if (gccode) {
        var comment = doLoadCommentFromGCCode(gccode);

        if (comment) {
            waitForEl(".log-types > option", () => {
                var submitButton = $("#submitLog").find("button");
                submitButton.css("margin-top", "10px");

                $("#submitLog")
                    .parent()
                    .before("<section class='region' id='gccActionDiv'/>");
                render($("#gccActionDiv")[0], generateLogActionSection());

                appendCSS(
                    "text",
                    `#${AUTOMARKFOUND}_label { display: inline!important; } 
                #${AUTOMARKARCHIVE}_label { display: inline!important; }`
                );

                submitButton.on("click", () => {
                    executeLogAction(comment);
                });
                $(".log-types").on("change", () => {
                    updateFoudCheckboxVisibility();
                });
                updateFoudCheckboxVisibility();
            });
        }
    }
};

const generateLogActionSection = () => {
    return html`
        <div
            class="tableGCComment"
            id="tableGCComment"
            style="padding: 5px; border: 1px solid lightgray; margin-top: 10px;"
        >
            ${appendCheckBox(AUTOMARKFOUND, lang.log_markfound)}
            ${appendCheckBox(AUTOMARKARCHIVE, lang.log_movearchive)}
        </div>
    `;
};

const updateFoudCheckboxVisibility = () => {
    if (
        $("#ctl00_ContentBody_LogBookPanel1_ddLogType, .log-types").val() == 2
    ) {
        $(`#div${AUTOMARKFOUND}`).show();
    } else {
        $(`#div${AUTOMARKFOUND}`).hide();
    }
};

const executeLogAction = (comment) => {
    const isfoundLog =
        $("#ctl00_ContentBody_LogBookPanel1_ddLogType, .log-types").val() == 2;

    var markFoundState =
        isfoundLog && GM_getValue(AUTOMARKFOUND)
            ? StateEnum.found
            : comment.state;
    var markArchiveState = GM_getValue(AUTOMARKARCHIVE)
        ? true
        : comment.archived;

    comment.state = markFoundState;
    comment.archived = markArchiveState;

    comment.save();
};
