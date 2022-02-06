import $ from "jquery";
import { html, render } from "lighterhtml";
import { DEFAULTCOORDS } from "../../consts/general.js";
import {
    archiveAdd,
    archiveRemove,
    commentIcon,
    commentIconAdd,
    commentIconDelete,
    commentIconEdit,
    commentIconEditCancel,
    commentIconFullscreen,
    commentIconSave,
    commentIconShare,
    deleteMysteryIcon
} from "../../consts/icons.js";
import { lang } from "../../consts/language.js";
import { AUTO_UPDATE_GS_FINAL } from "../../consts/preferences.js";
import { doLoadCommentFromGUID } from "../../function/db.js";
import { convertDec2DMS, parseCoordinates } from "../../helper/coordinates.js";
import { appendCSS } from "../../helper/css.js";
import { log } from "../../helper/logger.js";
import { createTimeString } from "../../helper/time.js";
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
import { getStateKeyByValue, StateEnum } from "../../dataClasses/stateEnum";
import { CacheComment } from "./../../dataClasses/cacheComment";
import {
    resetUserCoordinate,
    retrieveOriginalCoordinates,
    setUserCoordinate
} from "./gsHelper.js";
import { patchSmallMap } from "./smallMap.js";

var viewer_instance;
var editor_instance;
/**
 * @type CacheComment
 */
var comment = null;
var updateCommentSectionFunc;

const generateHeaderSection = () => {
    return html``;
};

const generateCommentSection = () => {
    const viewState = {
        isViewMode: true
    };

    const createEmptyComment = () => {
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
    };

    const updateCommentSection = () => {
        // Editor modes
        if (viewState.isViewMode) {
            $("#gccommentEditor").hide();
            $("#gccommentViewer").show();
        } else {
            $("#gccommentViewer").hide();
            $("#gccommentEditor").show();
        }

        // Icon state
        if (viewState.isViewMode) {
            $("#commentCommandSave").hide();
            $("#commentCommandCancel").hide();

            if (comment) {
                $("#commentCommandEdit").show();
                $("#commentCommandShare").show();
                $("#commentCommandArchive").show();
                $("#commentCommandDelete").show();
                $("#commentCommandAdd").hide();
            } else {
                $("#commentCommandAdd").show();
                $("#commentCommandEdit").hide();
                $("#commentCommandShare").hide();
                $("#commentCommandArchive").hide();
                $("#commentCommandDelete").hide();
            }
        } else {
            $("#commentCommandSave").show();
            $("#commentCommandCancel").show();
            $("#commentCommandAdd").hide();
            $("#commentCommandEdit").hide();
            $("#commentCommandShare").hide();
            $("#commentCommandArchive").hide();
            $("#commentCommandDelete").hide();
        }

        // State and final coord field state
        if (viewState.isViewMode) {
            $("#detailCommentCacheState").prop("disabled", true);
            $("#detailCommentInputLatLng").prop("disabled", true);
        } else {
            $("#detailCommentCacheState").prop("disabled", false);
            $("#detailCommentInputLatLng").prop("disabled", false);
        }

        // Archive icon toggle
        if (comment && comment.archived) {
            $("#commentCommandArchive > img").attr("src", archiveRemove);
            $("#commentCommandArchive > img").attr(
                "title",
                lang.table_removefromarchive
            );
        } else {
            $("#commentCommandArchive > img").attr("src", archiveAdd);
            $("#commentCommandArchive > img").attr(
                "title",
                lang.table_addtoarchive
            );
        }

        // Update last save time
        $("#lastSaved").text(
            `${lang.detail_lastsaved}: ${createTimeString(
                comment ? comment.saveTime : -1
            )}`
        );
    };

    updateCommentSectionFunc = updateCommentSection;

    const generateCommentSectionHeader = () => {
        const mouseupAdd = () => {
            if (comment) {
                editor_instance.setMarkdown(comment.commentValue);
            } else {
                createEmptyComment();
            }
            viewState.isViewMode = false;
            updateCommentSection();
            setTimeout(() => {
                editor_instance.focus();
            }, 50);
        };

        const mouseupEdit = mouseupAdd;

        const mouseupShare = () => {
            console.log("TODO: share");
        };

        const mouseupCancel = () => {
            if (comment !== null) {
                viewer_instance.setMarkdown(comment.commentValue);
                $("#gccommentViewer").show();
                if (comment.lat && comment.lng) {
                    $("#detailCommentInputLatLng").val(
                        convertDec2DMS(comment.lat, comment.lng)
                    );
                } else {
                    $("#detailCommentInputLatLng").val(DEFAULTCOORDS);
                }

                $("#detailCommentCacheState").val(comment.state);
            } else {
                $("#detailCommentInputLatLng").val(DEFAULTCOORDS);
                $("#detailCommentCacheState").val(StateEnum.unknown);
                editor_instance.setMarkdown("");
                viewer_instance.setMarkdown("");
            }

            viewState.isViewMode = true;
            updateCommentSection();
        };

        const mouseupSave = () => {
            log("debug", "Saving comment");
            if (!comment) {
                createEmptyComment();
                comment.save();
            }

            var fin = parseCoordinates($("#detailCommentInputLatLng").val());
            // TODO: check if those lines can be removed or needs to be fixed
            var finlat, finlng;
            if (fin.length == 2) {
                finlat = fin[0];
                finlng = fin[1];
                comment.lat = finlat;
                comment.lng = finlng;
            } else if ($("#detailCommentInputLatLng").val() != DEFAULTCOORDS) {
                alert(lang.alert_couldnotparse + fin[0]);
                return;
            }
            // TODO
            // detailFinalCacheState.options.selectedIndex = detailCommentCacheState.options.selectedIndex;

            // a bit complicated but required to not mess with the types (casting not possible as we are here not in ts)
            // first get the Enum key by value to then get the value again...
            comment.state =
                StateEnum[
                    getStateKeyByValue(
                        String($("#detailCommentCacheState").val())
                    )
                ];

            comment.commentValue = editor_instance.getMarkdown();

            viewer_instance.setMarkdown(comment.commentValue);
            viewState.isViewMode = true;

            comment.save();
            updateCommentSection();
            // TODO: add setting for savetoCacheNote
            if (GM_getValue(AUTO_UPDATE_GS_FINAL) == 1) {
                setUserCoordinate(comment.lat, comment.lng);
            }

            var clean = DEFAULTCOORDS;
            if (comment && comment.lat && comment.lng) {
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

                // TODO check and implement saveFinalCoords()
                // saveFinalCoords();

                if (GM_getValue(AUTO_UPDATE_GS_FINAL) == 1) {
                    resetUserCoordinate();
                }

                viewState.isViewMode = true;
                updateCommentSection();
            }
        };

        const mouseupArchive = () => {
            if (comment) {
                if (comment.archived) {
                    comment.archived = false;
                } else {
                    comment.archived = true;
                }
                comment.save();
                updateCommentSection();
            }
        };

        const mouseupDelete = () => {
            var check = confirm(lang.detail_deleteconfirmation);
            if (check) {
                comment.delete();
                comment = null;

                editor_instance.setMarkdown("");
                viewer_instance.setMarkdown("");

                $(".customWaypointRow").remove();
                var $table = $("#ctl00_ContentBody_Waypoints");
                if ($table.find("tbody").children().length === 0) {
                    $table.remove();
                }

                $("#detailCommentCacheState").val(StateEnum.unknown);

                // TODO
                // $("#detailFinalCacheState").val(StateEnum.unknown);

                $("#detailCommentInputLatLng").val(DEFAULTCOORDS);
                $("#detailFinalInputLatLng").val(DEFAULTCOORDS);

                if (GM_getValue(AUTO_UPDATE_GS_FINAL) == 1) {
                    resetUserCoordinate();
                }

                viewState.isViewMode = true;
                updateCommentSection();
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

        var lastSaveTime =
            comment !== null && comment.saveTime
                ? createTimeString(comment.saveTime)
                : createTimeString(-1);
        var commentState = comment ? comment.state : StateEnum.unknown;

        return html`
            <p>
                <strong>My comments</strong>
                <a id="commentCommandAdd" style="display: none;" onmouseup=${mouseupAdd}>
                    <img src="${commentIconAdd}" 
                    title="${lang.detail_add}" style="cursor:pointer">
                </a> 
                <a id="commentCommandEdit" style="display: inline;" onmouseup=${mouseupEdit}>
                    <img src="${commentIconEdit}" 
                    title="${lang.detail_edit}" style="cursor:pointer">
                </a>
                <a id="commentCommandShare" style="display: inline;" onmouseup=${mouseupShare}>
                    <img src="${commentIconShare}" 
                    title="${lang.detail_share}" style="cursor:pointer">
                </a>
                <a id="commentCommandCancel" style="display: none;" onmouseup=${mouseupCancel}>
                    <img src="${commentIconEditCancel}" 
                    title="${lang.detail_cancel}" style="cursor:pointer">
                </a>
                <a id="commentCommandSave" style="display: none;" onmouseup=${mouseupSave}>
                    <img src="${commentIconSave}"
                     title="${lang.detail_save}" style="cursor:pointer">
                </a>
                <a id="commentCommandFinalSave" style="display: none;" onmouseup=${mouseupFinalSave}>
                    <img src="${commentIconSave}" 
                    title="${lang.detail_finalsave}" style="cursor:pointer">
                </a>
                <a id="commentFinalDelete" style="display: none;" onmouseup=${mouseupFinalDelete}>
                    <img src="${deleteMysteryIcon}" 
                    title="${lang.detail_finaldelete}" style="cursor:pointer">
                </a>
                <a id="commentCommandJump" style="display: none;" href="#gccommentarea">
                    <img src="${commentIcon}" 
                    title="${lang.detail_jumptocomment}" style="cursor:pointer">
                </a>
                <a id="commentCommandArchive" style="display: none;" onmouseup=${mouseupArchive}>
                    <img src="${archiveAdd}" 
                    title="${lang.table_addtoarchive}"
                    style="cursor:pointer">
                </a>
                <a id="commentCommandDelete" style="display: none;" onmouseup=${mouseupDelete}>
                    <img src="${commentIconDelete}"
                     title="${lang.detail_delete}" style="cursor:pointer">
                </a>
                <a id="commentCommandFullscreen" style="" onmouseup=${editorEnterFullscreen}>
                    <img src="${commentIconFullscreen}" 
                    title="Enter Fullscreen" style="cursor:pointer">
                </a>

                <small id="lastSaved">${
                    lang.detail_lastsaved + ": " + lastSaveTime
                }</small>
                <br>
                State:
                <select id="detailCommentCacheState" name="detailCommentCacheState" disabled="true" 
                style="margin-right: 10px; width: 115px; padding-right: 0px; display: inline; background-position: right;" size="1" >
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
                    comment && comment.lat && comment.lng
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

    return html` ${generateCommentSectionHeader()} `;
};

const generateCoordinateSection = () => {
    return html``;
};

const getGUID = () => {
    const url = $("form").attr("action");
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

export const gccommentOnDetailpage = () => {
    // append Toast UI Editor CSS
    appendCSS("text", toastuiEditorCss);
    appendCSS("text", toastuiEditorViewerCss);
    // custom fullscreen css
    appendCSS("text", editorFullscreenCss);

    comment = doLoadCommentFromGUID(getGUID());

    const hookForHeaderSection = $("#Print");
    if (hookForHeaderSection.length > 0) {
        render(hookForHeaderSection[0], generateHeaderSection());
    } else {
        log("info", "Hook for header section not found.");
    }

    const hookForCommentSection = $("#ctl00_ContentBody_uxFindLinksHeader");
    if (hookForCommentSection.length > 0) {
        hookForCommentSection
            .parent()
            .before('<div id="gccommentarea" name="mycomments"><div>');
        render($("#gccommentarea")[0], generateCommentSection());
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
    render(hookForCoordinateSection[0], generateCoordinateSection());

    viewer_instance = createViewer(
        $("#gccommentViewer")[0],
        comment ? comment.commentValue : ""
    );
    editor_instance = createEditor(
        $("#gccommentEditor")[0],
        comment ? comment.commentValue : ""
    );
    if (comment && comment.commentValue !== "") {
        $("#gccommentViewer").show();
    }

    updateCommentSectionFunc();
    patchSmallMap(comment);
};
