import $ from "jquery";
import { html, render } from "lighterhtml";
import { ARCHIVED, browser, DEFAULTCOORDS } from "../../consts/general.js";
import {
    archiveAdd,
    commentIcon,
    commentIconAdd,
    commentIconDelete,
    commentIconEdit,
    commentIconEditCancel,
    commentIconSave,
    commentIconShare,
    deleteMysteryIcon
} from "../../consts/icons.js";
import { lang } from "../../consts/language.js";
import { AUTO_UPDATE_GS_FINAL } from "../../consts/preferences.js";
import {
    doLoadCommentFromGUID,
    doSaveCommentToGUID
} from "../../function/db.js";
import { convertDec2DMS, parseCoordinates } from "../../helper/coordinates.js";
import { appendCSS } from "../../helper/css.js";
import { log } from "../../helper/logger.js";
import { appendScript } from "../../helper/script.js";
import { createTimeString } from "../../helper/time.js";
import { archiveRemove } from "./../../consts/icons";
import { createEditor, createViewer } from "./../../helper/commentEditor";
// @ts-ignore
// css hack
import toastuiEditorCss from "bundle-text:@toast-ui/editor/dist/toastui-editor.css";
// @ts-ignore
// css hack
import toastuiEditorViewerCss from "bundle-text:@toast-ui/editor/dist/toastui-editor-viewer.css";
// @ts-ignore
// css hack
import editorFullscreenCss from "bundle-text:./../../css/editorFullscreen.css";
import { unescapeXML } from "../../helper/xml.js";
import { trim } from "../../helper/string.js";
import { StateEnum } from "../../dataClasses/stateEnum";
import { CacheComment } from "../../dataClasses/cacheComment.js";

var viewer_instance;
var editor_instance;

const generateHeaderSection = (comment) => {
    return html``;
};

const generateCommentSection = (comment) => {
    const generateCommentSectionHeader = (
        /** @type {import("../../dataClasses/cacheComment.js").CacheComment} */ comment
    ) => {
        const mouseupAdd = () => {
            $("#commentCommandAdd").hide();
            $("#detailCommentCacheState").prop("disabled", false);
            $("#commentCommandSave").show();
            $("#commentCommandCancel").show();
            $("#gccommentViewer").hide();
            editor_instance.setMarkdown(comment.commentValue);
            $("#gccommentEditor").show();
            $("#detailCommentInputLatLng").prop("disabled", false);
            setTimeout(() => {
                editor_instance.focus();
            }, 50);
        };

        const mouseupEdit = () => {
            $("#gccommentViewer").hide();
            editor_instance.setMarkdown(comment.commentValue);
            $("#gccommentEditor").show();

            $("#detailCommentCacheState").prop("disabled", false);
            $("#detailCommentInputLatLng").prop("disabled", false);

            $("#commentCommandAdd").hide();
            $("#commentCommandSave").show();
            $("#commentCommandEdit").hide();
            $("#commentCommandShare").hide();
            $("#commentCommandArchive").hide();
            $("#commentCommandCancel").show();
            setTimeout(() => {
                editor_instance.focus();
            }, 50);
        };

        const mouseupShare = () => {
            console.log("TODO: share");
        };

        const mouseupCancel = () => {
            $("#gccommentEditor").hide();
            $("#gccommentViewer").show();
            $("#detailCommentCacheState").prop("disabled", true);
            $("#commentCommandSave").hide();
            $("#detailCommentInputLatLng").prop("disabled", true);
            $("#commentCommandCancel").hide();
            if (comment == null) {
                $("#commentCommandAdd").show();
                $("#commentCommandEdit").hide();
                $("#commentCommandShare").hide();
                $("#commentCommandArchive").hide();
                $("#gccommentEditor").hide();
                $("#gccommentEditor").hide();
            } else {
                $("#commentCommandAdd").hide();
                $("#commentCommandEdit").show();
                $("#commentCommandShare").show();
                $("#commentCommandArchive").show();
                $("#commentCommandDelete").show();
                $("#gccommentEditor").hide();
                viewer_instance.setMarkdown(comment.commentValue);
                $("#gccommentViewer").show();
                if (comment.lat && comment.lng) {
                    $("#detailCommentInputLatLng").val(
                        convertDec2DMS(comment.lat, comment.lng)
                    );
                } else $("#detailCommentInputLatLng").val(DEFAULTCOORDS);
            }
        };

        const mouseupSave = () => {
            console.log("debug", "Saving comment");
            if (!comment) {
                comment = new CacheComment({
                    guid: getGUID(),
                    gccode: getCachecode(),
                    name: getCachename()
                });
                const orgigCoords = retrieveOriginalCoordinates();
                if (comment && orgigCoords.length === 2) {
                    if (!comment.origlat || !comment.origlng) {
                        comment.origlat = orgigCoords[0];
                        comment.origlng = orgigCoords[1];
                    }
                }
            }

            var fin = parseCoordinates($("#detailCommentInputLatLng").val());
            var finlat, finlng;
            if (fin.length == 2) {
                finlat = fin[0];
                finlng = fin[1];
            } else if ($("#detailCommentInputLatLng").val() != DEFAULTCOORDS) {
                alert(lang.alert_couldnotparse + fin[0]);
                return;
            }
            //TODO
            // detailFinalCacheState.options.selectedIndex = detailCommentCacheState.options.selectedIndex;

            comment.commentValue = editor_instance.getMarkdown();
            $("#gccommentEditor").hide();
            viewer_instance.setMarkdown(comment.commentValue);
            $("#gccommentViewer").show();

            $("#detailCommentCacheState").prop("disabled", true);
            $("#detailCommentInputLatLng").prop("disabled", "");

            $("#commentCommandSave").hide();
            $("commentCommandCancel").hide();
            $("#commentCommandAdd").hide();
            $("#commentCommandEdit").show();
            $("#commentCommandShare").show();
            $("#commentCommandArchive").show();
            $("#commentCommandDelete").show();
            lastSaveTime = createTimeString(new Date());

            comment.save();
            // TODO
            // saveToCacheNote(comment);

            var clean = DEFAULTCOORDS;
            if (comment.lat && comment.lng) {
                clean = convertDec2DMS(comment.lat, comment.lng);
            }
            $("#detailCommentInputLatLng").val(clean);
            // TODO
            // $("#detailFinalInputLatLng").val(clean);
        };

        const mouseupFinalSave = () => {
            console.log("TODO: finalSave");
        };

        const mouseupFinalDelete = () => {
            var check = confirm(lang.detail_finaldeleteconfirmation);
            if (check) {
                $("#detailFinalInputLatLng").val(DEFAULTCOORDS);
                $("#detailFinalInputLatLng").css("color", "grey");

                saveFinalCoords();
                if (GM_getValue(AUTO_UPDATE_GS_FINAL) == 1) {
                    var pageMethodCaller = (userToken) => {
                        $.pageMethod(
                            "/seek/cache_details.aspx/ResetUserCoordinate",
                            JSON.stringify({
                                dto: {
                                    ut: userToken
                                }
                            }),
                            (response) => {
                                var r = JSON.parse(response.d);
                                if (r.status == "success") {
                                    window.location.reload();
                                }
                            }
                        );
                    };

                    if (browser === "FireFox") {
                        appendScript(
                            "text",
                            "(" +
                                pageMethodCaller.toString() +
                                ")('" +
                                unsafeWindow.userToken.replace(/'/g, "%27") +
                                "'.replace('%27','\\''));"
                        );
                    } else {
                        pageMethodCaller(unsafeWindow.userToken);
                    }
                }
            }
        };

        const mouseupArchive = () => {
            console.log("TODO: archive");
        };

        const mouseupDelete = () => {
            var check = confirm(lang.detail_deleteconfirmation);
            if (check) {
                comment.delete();
                comment = null;

                $(".customWaypointRow").remove();
                var $table = $("#ctl00_ContentBody_Waypoints");
                if ($table.find("tbody").children().length === 0) {
                    $table.remove();
                }
                $("#detailCommentCacheState").prop("disabled", true);
                detailFinalCacheState.options.selectedIndex = $(
                    "#detailCommentCacheState"
                ).val();
                $("#gccommentEditor").hide();
                $("#gccommentEditor").hide();
                $("#commentCommandAdd").show();
                $("#commentCommandEdit").hide();
                $("#commentCommandShare").hide();
                $("#commentCommandArchive").hide();
                $("#commentCommandSave").hide();
                $("#commentCommandDelete").hide();
                $("#commentCommandCancel").hide();
                $("#detailCommentInputLatLng").prop("disabled", true);
                $("#detailCommentInputLatLng").val(DEFAULTCOORDS);
                $("#detailFinalInputLatLng").val(DEFAULTCOORDS);
                lastSaveTime = createTimeString(-1);
            }
        };

        const editorEnterFullscreen = () => {
            $("#gccommentCloseFullscreenheader").addClass("fsHeader");
            $("#gccommentViewer").addClass("fsViewer");
            $("#gccommentEditor").addClass("fsEditor");
        };

        const editorExitFullscreen = () => {
            $("#gccommentCloseFullscreenheader").removeClass("fsHeader");
            $("#gccommentViewer").removeClass("fsViewer");
            $("#gccommentEditor").removeClass("fsEditor");
        };

        var currentlyArchived =
            comment !== null && comment.archived === ARCHIVED;
        var lastSaveTime = comment.saveTime
            ? createTimeString(comment.saveTime)
            : createTimeString(comment.saveTime);
        var commentState = comment.state;

        return html`
            <p>
                <strong>My comments</strong>
                <a id="commentCommandAdd" style="display: none;" onmouseup=${mouseupAdd}>
                    <img src="${commentIconAdd}" title="${
            lang.detail_add
        }" style="cursor:pointer">
                </a> 
                <a id="commentCommandEdit" style="display: inline;" onmouseup=${mouseupEdit}>
                    <img src="${commentIconEdit}" title="${
            lang.detail_edit
        }" style="cursor:pointer">
                </a>
                <a id="commentCommandShare" style="display: inline;" onmouseup=${mouseupShare}>
                    <img src="${commentIconShare}" title="${
            lang.detail_share
        }" style="cursor:pointer">
                </a>
                <a id="commentCommandCancel" style="display: none;" onmouseup=${mouseupCancel}>
                    <img src="${commentIconEditCancel}" title="${
            lang.detail_cancel
        }" style="cursor:pointer">
                </a>
                <a id="commentCommandSave" style="display: none;" onmouseup=${mouseupSave}>
                    <img src="${commentIconSave}" title="${
            lang.detail_save
        }" style="cursor:pointer">
                </a>
                <a id="commentCommandFinalSave" style="display: none;" onmouseup=${mouseupFinalSave}>
                    <img src="${commentIconSave}" title="${
            lang.detail_finalsave
        }" style="cursor:pointer">
                </a>
                <a id="commentFinalDelete" style="display: none;" onmouseup=${mouseupFinalDelete}>
                    <img src="${deleteMysteryIcon}" title="${
            lang.detail_finaldelete
        }" style="cursor:pointer">
                </a>
                <a id="commentCommandJump" style="display: none;" href="#gccommentarea">
                    <img src="${commentIcon}" title="${
            lang.detail_jumptocomment
        }" style="cursor:pointer">
                </a>
                <a id="commentCommandArchive" style="display: none;" onmouseup=${mouseupArchive}>
                    <img src="${
                        currentlyArchived ? archiveRemove : archiveAdd
                    }" title="${
            currentlyArchived
                ? lang.table_removefromarchive
                : lang.table_addtoarchive
        }" style="cursor:pointer">
                </a>
                <a id="commentCommandDelete" style="display: none;" onmouseup=${mouseupDelete}>
                    <img src="${commentIconDelete}" title="${
            lang.detail_delete
        }" style="cursor:pointer">
                </a>
                <a id="commentCommandFullscreen" style="" onmouseup=${editorEnterFullscreen}>
                    <img src="${commentIconShare}" title="Enter Fullscreen" style="cursor:pointer">
                </a>

                <small>last saved: ${
                    lang.detail_lastsaved + ": " + lastSaveTime
                }</small>
                <br>
                State:
                <select id="detailCommentCacheState" name="detailCommentCacheState" disabled="true" style="margin-right: 10px; width: 115px; padding-right: 0px; display: inline; background-position: right;" size="1" >
                    ${Object.values(StateEnum).map((state) => {
                        if (state == commentState) {
                            return html`<option
                                val="${state}"
                                selected="selected"
                            >
                                ${state}
                            </option>`;
                        }
                        return html`<option>${state}</option>`;
                    })}
                                       
                </select>
                Final:
                <input id="detailCommentInputLatLng" value=${
                    comment.lat && comment.lng
                        ? convertDec2DMS(comment.lat, comment.lng)
                        : DEFAULTCOORDS
                } style="margin-left:5px; margin-right:5px; height:35px;" disabled="true" size="30"></input>
                <div id="gccommentarea">
                    <div class="defaultFsHeader" id="gccommentCloseFullscreenheader">
                        <div class="headerBlue" onmouseup=${editorExitFullscreen}>
                            <a>
                                Click here to close the fullscreen view.
                            </a>
                        </div>                        
                    </div>
                    <div id="gccommentViewer" style="display:none;" ondblclick=${mouseupEdit}></div>
                    <div id="gccommentEditor" style="display:none;"></div>
                </div>
            </p>
        `;
    };

    return html` ${generateCommentSectionHeader(comment)} `;
};

const generateCoordinateSection = (comment) => {
    return html``;
};

const getGUID = () => {
    const url = document
        .getElementById("ctl00_ContentBody_lnkPrintFriendly")
        .getAttribute("href");
    const guidIndex = url.indexOf("guid=");
    const length = "3331cc55-49a2-4883-a5ad-06657e8c1aab".length;
    return url.substr(guidIndex + 5, length);
};

const getCachename = () => {
    return unescapeXML(
        trim(document.getElementById("ctl00_ContentBody_CacheName").innerHTML)
    );
};

const getCachecode = () => {
    return trim(
        document.getElementById(
            "ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode"
        ).innerHTML
    );
};

const retrieveOriginalCoordinates = () => {
    var origCoordinates;
    // try to get it from GS
    if (
        window.userDefinedCoords &&
        window.userDefinedCoords.data &&
        window.userDefinedCoords.data.oldLatLngDisplay
    ) {
        origCoordinates = parseCoordinates(
            window.userDefinedCoords.data.oldLatLngDisplay
        );
    } else {
        // grab it from page
        origCoordinates = parseCoordinates(
            document.getElementById("uxLatLon").innerHTML
        );
    }

    if (origCoordinates.length == 2) {
        return origCoordinates;
    } else {
        log("error", "Original Coordinates of cache could not be determined.");
        return ["", ""];
    }
};

export const gccommentOnDetailpage = () => {
    // append Toast UI Editor CSS
    appendCSS("text", toastuiEditorCss);
    appendCSS("text", toastuiEditorViewerCss);
    // custom fullscreen css
    appendCSS("text", editorFullscreenCss);

    const comment = doLoadCommentFromGUID(getGUID());

    const hookForHeaderSection = $("#Print");
    if (hookForHeaderSection.length > 0) {
        render(hookForHeaderSection[0], generateHeaderSection(comment));
    } else {
        log("info", "Hook for header section not found.");
    }

    const hookForCommentSection = $("#ctl00_ContentBody_uxFindLinksHeader");
    if (hookForCommentSection.length > 0) {
        hookForCommentSection
            .parent()
            .before('<div id="gccommentarea" name="mycomments"><div>');
        render($("#gccommentarea")[0], generateCommentSection(comment));
    } else {
        log("info", "Hook for comment section not found.");
    }

    var hookForCoordinateSection = $("#ctl00_ContentBody_WaypointsInfo");
    if (hookForCoordinateSection.length == 0) {
        $("#ctl00_ContentBody_bottomSection > p:first")
            .first()
            .html(
                '<span id="ctl00_ContentBody_WaypointsInfo" style="font-weight:bold;">Additional Waypoints</span><br>'
            );
        hookForCoordinateSection = $("#ctl00_ContentBody_WaypointsInfo");
    }
    render(hookForCoordinateSection[0], generateCoordinateSection(comment));

    viewer_instance = createViewer(
        $("#gccommentViewer")[0],
        comment.commentValue
    );
    editor_instance = createEditor(
        $("#gccommentEditor")[0],
        comment.commentValue
    );
    if (comment && comment.commentValue !== "") {
        $("#gccommentViewer").show();
    }
};
