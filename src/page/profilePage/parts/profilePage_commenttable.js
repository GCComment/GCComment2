// Filter icons for Show my comments
import $ from 'jquery';
import * as dt from 'datatables.net';

import { html, render } from "lighterhtml";
import { COMPREFIX, stateOptions } from "../../../consts/general";
import { ARCHIVED } from "../../../consts/general.js";
import { archive, archiveAdd, archiveRemove, commentIconDelete, commentIconEdit, finalIcon, state_clear, state_default, state_found, state_solved, state_unsolved } from "../../../consts/icons.js";
import { lang } from "../../../consts/language";
import {
    ARCHIVE_FILTER_INCLUDE_ARCHIVED,
    ARCHIVE_FILTER_NO_ARCHIVED,
    ARCHIVE_FILTER_ONLY_ARCHIVED,
    LAZY_TABLE_REFRESH,
    SETTING_ARCHIVE_FILTER
} from "../../../consts/preferences";
import { doLoadCommentFromGUID, doSaveCommentToGUID } from "../../../function/db.js";
import { calculateDistance, convertDec2DMS } from "../../../helper/coordinates.js";
import { log } from "../../../helper/logger";
import { GCC_getValue, GCC_listValues, GCC_setValue } from "../../../helper/storage.js";
import { createViewerFromDivDataAttr } from '../../../helper/commentEditor.js';

// @ts-ignore
// connect datatables with jquery
dt(window, $);

let filter = null;

export const generateDisplayFilters = () => {
    const archivedFilter = GCC_getValue(SETTING_ARCHIVE_FILTER);
    var selectedArchivedFilter = 'include_archived';
    if(archivedFilter !== ARCHIVE_FILTER_INCLUDE_ARCHIVED && archivedFilter !== ARCHIVE_FILTER_ONLY_ARCHIVED){
        selectedArchivedFilter = 'no_archived';
    }
    else if(archivedFilter === ARCHIVE_FILTER_INCLUDE_ARCHIVED){
        selectedArchivedFilter = 'include_archived';
    }
    else if(archivedFilter === ARCHIVE_FILTER_ONLY_ARCHIVED){
        selectedArchivedFilter = 'only_archived';
    }

    return html`
                <div id="displayFilters" style="display:none;">
                    &nbsp;
                    <img id="filterclearIcon" title="${lang.table_filter_all}" src="${state_clear}" onmouseup=${onFilterclearIconMouseUp} style="cursor:pointer;vertical-align:bottom;opacity:1.0" />
                    &nbsp;
                    <img id="filterallIcon" title="${lang.table_filter_untyped}" src="${state_default}" onmouseup=${onFilterallIconMouseUp} style="cursor:pointer;vertical-align:bottom;opacity:0.3" />
                    &nbsp;
                    <img id="filterunsolvedIcon" title="${lang.table_filter_unsolved}" src="${state_unsolved}" onmouseup=${onFilterunsolvedIconMouseUp} style="cursor:pointer;vertical-align:bottom;opacity:0.3" />
                    &nbsp;
                    <img id="filtersolvedIcon" title="${lang.table_filter_solved}" src="${state_solved}" onmouseup=${onFiltersolvedIconMouseUp} style="cursor:pointer;vertical-align:bottom;opacity:0.3" />
                    &nbsp;
                    <img id="filterFoundIcon" title="${lang.table_filter_found}" src="${state_found}" onmouseup=${onFilterFoundIconMouseUp} style="cursor:pointer;vertical-align:bottom;opacity:0.3" />
                    
                    <select id="archivedSelector" style="margin-left:5px;background: none;" onchange=${onArchivedSelectorChanged}>
                        <option id="archivedSelector_no_archived" selected="${selectedArchivedFilter === 'no_archived'}">
                            ${lang.archived_filter_no_archived}
                        </option>
                        <option id="archivedSelector_include_archived" selected="${selectedArchivedFilter === 'include_archived'}">
                            ${lang.archived_filter_include_archived}
                        </option>
                        <option id="archivedSelector_only_archived" selected="${selectedArchivedFilter === 'only_archived'}">
                            ${lang.archived_filter_only_archived}
                        </option>
                    </select>
                </div>
            `;
};

const onFilterclearIconMouseUp = function () {
    $('#displayFilters > img').css('opacity', '0.3');
    $('#filterclearIcon').css('opacity', '1');
    filter = null;
    refreshTableDiv(true);
};

const onFilterallIconMouseUp = function () {
    $('#displayFilters > img').css('opacity', '0.3');
    $('#filterallIcon').css('opacity', '1');
    filter = stateOptions[0];
    refreshTableDiv(true);
};

const onFilterunsolvedIconMouseUp = function () {
    $('#displayFilters > img').css('opacity', '0.3');
    $('#filterunsolvedIcon').css('opacity', '1');
    filter = stateOptions[1];
    refreshTableDiv(true);
}

const onFiltersolvedIconMouseUp = function () {
    $('#displayFilters > img').css('opacity', '0.3');
    $('#filtersolvedIcon').css('opacity', '1');
    filter = stateOptions[2];
    refreshTableDiv(true);
};

const onFilterFoundIconMouseUp = function () {
    $('#displayFilters > img').css('opacity', '0.3');
    $('#filterFoundIcon').css('opacity', '1');
    filter = stateOptions[3];
    refreshTableDiv(true);
};


const onArchivedSelectorChanged = function () {
    var indexSelected = $('#archivedSelector option:selected').index();
    var archivedFilter = "";
    if (indexSelected === 0) {
        archivedFilter = ARCHIVE_FILTER_NO_ARCHIVED;
    } else if (indexSelected === 1) {
        archivedFilter = ARCHIVE_FILTER_INCLUDE_ARCHIVED;
    } else if (indexSelected === 2) {
        archivedFilter = ARCHIVE_FILTER_ONLY_ARCHIVED;
    } else {
        log("error", "unknown archive filter selector: " + indexSelected);
    }
    GCC_setValue(SETTING_ARCHIVE_FILTER, archivedFilter);
    refreshTableDiv(true);
};

export const generateTableDiv = () => {
    return html`
        <div id="gccommenttablediv" style="display:none; margin: 5px; padding: 4px; outline: 1px solid rgb(215, 215, 215); position: relative; background-color: rgb(235, 236, 237);"/>        
    `;
};

const generateTableRow = (comment, rowCount) => {
    const getStateIcon = (state) =>{
        if (state == stateOptions[1])
            return state_unsolved;
        if (state == stateOptions[2])
            return state_solved;
        if (state == stateOptions[3])
            return state_found;
        
        return state_default;
    };

    const createCachePrintout = (comment) => {
		const homelat = GCC_getValue('HOMELAT');
		const homelng = GCC_getValue('HOMELNG');

        return html`
            ${
                (comment.lat && comment.lng)?
                html`
                    <p class='tableFinal'>
                        ${lang.table_finalat + convertDec2DMS(comment.lat, comment.lng)}
                        ${
                            (homelat && homelng)?
                            " (" + calculateDistance(homelat, homelng, comment.lat, comment.lng).toFixed(2) + "km " + lang.table_fromhome + ")"
                            :""

                        }
                    </p>
                    <hr/>
                `
                :null
            }
            
            ${
                (comment.commentValue)?
                html`
                    <div class='tableComment' data=${comment.commentValue}>
                    </div>
                `
                :null
            }

            ${
                (comment.waypoints && (comment.waypoints.length > 0))?
                html`
                    <hr/>
                    <table class='tableWaypoints'>
                        ${
                            comment.waypoints.map((wp, i) => html`
                                <tr>
                                    <td>
                                        ${wp.prefix}
                                    </td>
                                    <td>
                                        ${wp.lookup}
                                    </td>
                                    <td>
                                        ${wp.name}
                                    </td>
                                    <td>
                                        ${wp.coordinate}
                                    </td>
                                </tr>
                            `)
                        }                      
                    </table>
                `
                :null
            }
        `;	
	};

    const createTimeString = (time, simple) => {
		if (time < 0)
			return lang.never;
		else {
			var lastSave = null;
			if (typeof time === "object")
				lastSave = time;
			else
				lastSave = new Date(parseInt(time));
			// lastSave.setTime(time);
			var month = lastSave.getMonth() + 1;
			var day = lastSave.getDate();
			var hour = lastSave.getHours();
			var minute = lastSave.getMinutes();
			var sec = lastSave.getSeconds();
			if (month < 10)
				month = "0" + month;
			if (day < 10)
				day = "0" + day;
			if (hour < 10)
				hour = "0" + hour;
			if (minute < 10)
				minute = "0" + minute;
			if (sec < 10)
				sec = "0" + sec;

			if (simple)
				return lastSave.getFullYear() + "-" + month + "-" + day;
			else
				return lastSave.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + sec;
		}
	}

    function changeState(event) {
		var url = "" + this;
		var guid = url.split("#")[1].split("=")[0];
		var action = url.split("#")[1].split("=")[1];
		var targetState = "";

		var comment = doLoadCommentFromGUID(guid);

		if (!comment)
			return;

		if (action === "markunsolved") {
			comment.state = stateOptions[1];
			targetState = stateOptions[1];
		} else if (action === "marksolved") {
			comment.state = stateOptions[2];
			targetState = stateOptions[2];
		} else if (action === "markfound") {
			comment.state = stateOptions[3];
			targetState = stateOptions[3];
		} else if (action === "markdefault") {
			comment.state = stateOptions[0];
			targetState = stateOptions[0];
		} else if (action === "addToArchive") {
			comment.archived = ARCHIVED;
			targetState = comment.state;
		} else if (action === "removeFromArchive") {
			comment.archived = null;
			targetState = comment.state;
		}

		doSaveCommentToGUID(comment);

		if (!GCC_getValue(LAZY_TABLE_REFRESH)) {
			refreshTableDiv(true);
		}

		// remove line if change state to sth not matching the filter and not being in
		// archive
		// OR
		// if no filter (show all) and target state is defined
		if (((filter != null) && (targetState != filter) && (filter != ARCHIVED))
				|| ((filter == null) && (targetState != null))) {
			var row = $(event.target).parents('tr');
			$('#gccommentoverviewtable').DataTable().row(row[0]).remove().draw();
		}

		// remove line if change archive state to or from archive
		if (action.indexOf('Archive') > 0) {
			var row = $(event.target).parents('tr');
			$('#gccommentoverviewtable').DataTable().row(row[0]).remove().draw();
		}
	}

    const createActionButtons = (comment)=>{                
        const buttons = [
            {
                "command": `#${comment.guid}=markdefault`,
                "label": `${lang.table_markcacheas} ${lang.type_untyped}`,
                "icon": state_default,
                "callback": changeState
            },
            {
                "command": `#${comment.guid}=markunsolved`,
                "label": `${lang.table_markcacheas} ${lang.type_unsolved}`,
                "icon": state_unsolved,
                "callback": changeState
            },
            {
                "command": `#${comment.guid}=marksolved`,
                "label": `${lang.table_markcacheas} ${lang.type_solved}`,
                "icon": state_solved,
                "callback": changeState
            },
            {
                "command": `#${comment.guid}=markfound`,
                "label": `${lang.table_markcacheas} ${lang.type_found}`,
                "icon": state_found,
                "callback": changeState
            },
            {
                "command": `#${comment.guid}=del`,
                "label": lang.detail_delete,
                "icon": commentIconDelete,
                "callback": (event) => {
                    var check = confirm(lang.delete_confirmation_overview);
                    if (check) {
                        var url = "" + this;
                        var guid = url.split("#")[1].split("=")[0];
                        var action = url.split("#")[1].split("=")[1];
    
                        var row = $(event.target).parents('tr');
                        $('#gccommentoverviewtable').DataTable().row(row[0]).remove().draw();
    
                        if (action === "del") {
                            var oldcomment = doLoadCommentFromGUID(guid);
                            log('info', 'deleting: ' + oldcomment);
                            deleteComment(oldcomment.guid, oldcomment.gccode);
                        }
                        if (GCC_getValue(LAZY_TABLE_REFRESH) == 0) {
                            refreshTableDiv(true);
                        }
                    }
                }
            },
            {
                "command": `https://www.geocaching.com/seek/cache_details.aspx?guid=${comment.guid}#mycomments`,
                "label": lang.table_editondetail,
                "icon": commentIconEdit,
                "callback": null
            },
            {
                "command": (comment.archived === ARCHIVED)?`#${comment.guid}=removeFromArchive`:`#${comment.guid}=addToArchive`,
                "label": (comment.archived === ARCHIVED)?lang.table_removefromarchive:lang.table_addtoarchive,
                "icon": (comment.archived === ARCHIVED)?archiveRemove:archiveAdd,
                "callback": changeState
            }
        ];

        return html`
            ${buttons.map((btn, i) => {
                return html`
                <a style="margin-right:3px" href="${btn["command"]}" onclick=${btn["callback"]}>
                    <img title="${btn["label"]}" src="${btn["icon"]}">
                </a>`
            })}
        `;
    };

    return html`
    <tr role="row" class="${rowCount%2==0?'even':'odd'}">
        <td class="sorting_1">
            <img class="tableStateIcon" src="${getStateIcon(comment.state)}">
                <a href="${'http://www.geocaching.com/seek/cache_details.aspx?guid=' + comment.guid}">
                    ${comment.name}
                </a>
                ${
                    ((comment.lat != null) && (comment.lng != null))?
                    html`<img class="haveFinalIcon" title="${lang.table_ihaveit}" src="${finalIcon}">`
                    : null
                }
                ${
                    (comment.archived === ARCHIVED)?
                    html`<img class="haveFinalIcon" title="${lang.table_isarchived}" src="${archive}">`
                    : null
                }
        </td>
        <td style="width: 505px;">
            ${createCachePrintout(comment)}
        </td>
        <td>
            <small>
                ${createTimeString(comment.saveTime)}
            </small>
        </td>
        <td>
            ${createActionButtons(comment)}
        </td>
    </tr>
    `
}

const updateCounters = (comments) =>{
    var commentCountWhite = 0;
    var commentCountRed = 0;
    var commentCountGreen = 0;
    var commentCountGray = 0;
    var commentCountArchive = 0;

    comments.forEach(comment => {
        if (comment.state == stateOptions[0])
            commentCountWhite++;
        else if (comment.state == stateOptions[1])
            commentCountRed++;
        else if (comment.state == stateOptions[2])
            commentCountGreen++;
        else if (comment.state == stateOptions[3])
            commentCountGray++;

        if (comment.archived === ARCHIVED) {
            commentCountArchive++;
        }
    });
    
    GCC_setValue('countWhite', "" + commentCountWhite);
    GCC_setValue('countRed', "" + commentCountRed);
    GCC_setValue('countGreen', "" + commentCountGreen);
    GCC_setValue('countGray', "" + commentCountGray);
    GCC_setValue('countArchive', "" + commentCountArchive);
}

export const refreshTableDiv = (show) =>{
    const commentKeys = GCC_listValues().filter(key => key.indexOf(COMPREFIX) != -1);
    var comments = commentKeys.map((key) => doLoadCommentFromGUID(key.substr(COMPREFIX.length)));

    updateCounters(comments);


    // filter out caches that should not appear in the table
    var archivedFilter = GCC_getValue(SETTING_ARCHIVE_FILTER);
    
    if (!archivedFilter) {
        archivedFilter = ARCHIVE_FILTER_NO_ARCHIVED;
        GCC_setValue(SETTING_ARCHIVE_FILTER, ARCHIVE_FILTER_NO_ARCHIVED);
    }

    comments = comments.filter(comment => {
        // drop caches that dont match the state
        
        return (!filter || filter == comment.state) 
        && (!archivedFilter
            || (archivedFilter === ARCHIVE_FILTER_INCLUDE_ARCHIVED)
            // take non-archived caches if filter is set to "no archived"
            || ((archivedFilter === ARCHIVE_FILTER_NO_ARCHIVED) && (comment.archived !== ARCHIVED))
            // take archived caches if filter is set to "only archived"
            || ((archivedFilter === ARCHIVE_FILTER_ONLY_ARCHIVED) && (comment.archived === ARCHIVED))
            )
    });

    // recreate div otherwise render renders an empty div
    $('#gccommenttablediv').replaceWith('<div id="gccommenttablediv" style="display:none; margin: 5px; padding: 4px; outline: 1px solid rgb(215, 215, 215); position: relative; background-color: rgb(235, 236, 237);"/>');
    render($('#gccommenttablediv')[0],
    html`
        <table id="gccommentoverviewtable"
        style="width: 857px; outline: rgb(215, 215, 215) solid 1px; position: relative; background-color: rgb(200, 203, 206); margin-bottom: 0px; table-layout: fixed;"
        class="display dataTable no-footer" role="grid" aria-describedby="gccommentoverviewtable_info">
            <thead>
                <tr role="row">
                    <th style="width:200px;font-weight:bold" class="sorting_asc" tabindex="0"
                        aria-controls="gccommentoverviewtable" rowspan="1" colspan="1" aria-sort="ascending"
                        aria-label="Cache: activate to sort column descending">Cache</th>
                    <th style="font-weight: bold; width: 505px;" class="sorting" tabindex="0"
                        aria-controls="gccommentoverviewtable" rowspan="1" colspan="1"
                        aria-label="My comment &amp;amp; final coordinates: activate to sort column ascending">My comment &amp;
                        final coordinates</th>
                    <th style="width: 80px; font-weight: bold;" class="sorting" tabindex="0"
                        aria-controls="gccommentoverviewtable" rowspan="1" colspan="1"
                        aria-label="Last save: activate to sort column ascending">Last save</th>
                    <th style="width: 72px; font-weight: bold;" class="sorting_disabled" rowspan="1" colspan="1"
                        aria-label="Actions">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${comments.map(generateTableRow)}
            </tbody>
        </table>
    `);


    $(".tableComment").each((i,e)=> {
        createViewerFromDivDataAttr(e);
    });


    $('#gccommentoverviewtable').DataTable({
        "autoWidth" : false,
        "stateSave" : true,
        "jQueryUI" : false,
        "columns" : [ {
            "width" : "200px"
        }, {
            "width" : "505px"
        }, {
            "width" : "80px"
        }, {
            "width" : "72px",
            "orderable" : false
        } ]
    });

    if (!show) {
        $('#gccommenttablediv').hide();
    }
    else{
        $('#gccommenttablediv').show();
    }

    var filteredByString = filter;
    if (filter === stateOptions[0]) {
        filteredByString = lang.type_untyped;
    } else if (!filter) {
        filteredByString = lang.nothing;
    }
    $('#gccommentoverviewtable_length').append(
            $('#gccommentoverviewtable_filter > label').css('margin', '10px')).css('padding', '5px').css(
            'font-weight', '500').append($('#gccommentoverviewtable_paginate')).append(
            $('#gccommentoverviewtable_info')).append(
            "<span>" + lang.table_filtered_by + " " + filteredByString + "</span>").children().css('float', 'left')
            .css('margin', '0px 10px 5px 10px').css('padding-top', '0.755em');

    $('#gccommentoverviewtable').css('margin-bottom', '0px');
}