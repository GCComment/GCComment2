import $ from 'jquery';
import { html, render } from 'lighterhtml';
import { ARCHIVED, COMPREFIX, stateOptions } from '../../consts/general.js';
import { state_found, state_solved, state_unsolved } from '../../consts/icons.js';
import { lang } from '../../consts/language.js';
import { AUTOMOVEMYSTERIESBETA, AUTOMOVEMYSTERIESBETAAREA, AUTOMOVEMYSTERIESBETAFOUND, AUTOMOVEMYSTERIESBETAHOME, AUTOMOVEMYSTERIESBETAINCLUDEWPT, AUTOMOVEMYSTERIESBETASOLVED, AUTOMOVEMYSTERIESBETAUNSOLVED } from '../../consts/preferences.js';
import { doLoadCommentFromGUID } from '../../function/db.js';
import { parseCoordinates } from '../../helper/coordinates.js';
import { GMWindow } from '../../helper/gmWindow.js';
import { waitForPropOfObject } from '../../helper/wait.js';
import { appendCheckBox } from '../other/controls.js';
import { createMovedFinal, drawCircle, drawMarker, drawMultiline, setMap} from './mapHelper/mapDraw.js';

const toggleMoveMysteries = () =>{
    $('#mmSub').slideToggle();
    updateMoveMysteries();
};

const removeAllGccMarkers = () =>{

}; 

const updateMoveMysteries = () =>{
    removeAllGccMarkers();
    if (! $(`#${AUTOMOVEMYSTERIESBETA}`).prop('checked')){
        return;
    }

    const found = GM_getValue(AUTOMOVEMYSTERIESBETAFOUND);
    const solved = GM_getValue(AUTOMOVEMYSTERIESBETASOLVED);
    const unsolved = GM_getValue(AUTOMOVEMYSTERIESBETAUNSOLVED);
    const drawOrigPos = GM_getValue(AUTOMOVEMYSTERIESBETAHOME);
    const includeWaypoints = GM_getValue(AUTOMOVEMYSTERIESBETAINCLUDEWPT);

    var stUnsolved = null;
    if (unsolved){
        stUnsolved = stateOptions[1];
    }

    var stSolved = null;
    if (solved){
        stSolved = stateOptions[2];
    }

    var stFound = null;
    if (found){
        stFound = stateOptions[3];
    }    

    var keys = GM_listValues();
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.indexOf(COMPREFIX) > -1) {
            var guid = key.substring(COMPREFIX.length, key.length);
            var comment = doLoadCommentFromGUID(guid);

            if (((comment.state == stSolved) || (comment.state == stFound) || (comment.state == stUnsolved))
                    && (comment.archived != ARCHIVED)) {

                if (comment.lat && comment.lng) {
                    createMovedFinal(comment, drawOrigPos);
                }

                if (includeWaypoints && comment.waypoints && (comment.waypoints.length > 0)) {
                    var aWaypoints = [];
                    aWaypoints.push([comment.origlat, comment.origlng]);

                    for (var j = 0; j < comment.waypoints.length; j++) {
                        var coords = parseCoordinates(comment.waypoints[j].coordinate);
                        if (coords.length == 2) {
                            aWaypoints.push([coords[0], coords[1]]);
                            drawMarker(coords[0], coords[1], "wpt", null, comment.gccode);
                            if (GM_getValue(AUTOMOVEMYSTERIESBETAAREA)) {
                                drawCircle(coords[0], coords[1], "161");
                            }
                        }
                    }
                    // add final wpt to link the last wpt to it
                    if (comment.lat && comment.lng) {
                        aWaypoints.push([comment.lat, comment.lng]);
                    }

                    drawMultiline(aWaypoints, comment.state);
                }
            }
        }
    }
};

const generateMapMenue = () =>{  

    return html`
        <b>
            ${appendCheckBox(AUTOMOVEMYSTERIESBETA, lang.map_enablemm, toggleMoveMysteries)}
        </b>
        <div id="mmSub" style="display:none; padding: 0 15px;">
            <div id="mmSubCacheOptions">
                ${appendCheckBox(AUTOMOVEMYSTERIESBETASOLVED, lang.type_solved, updateMoveMysteries, true, state_solved)}
                ${appendCheckBox(AUTOMOVEMYSTERIESBETAFOUND, lang.type_found, updateMoveMysteries, true, state_found)}
                ${appendCheckBox(AUTOMOVEMYSTERIESBETAUNSOLVED, lang.type_unsolved, updateMoveMysteries, false, state_unsolved)}
            </div>
            ${appendCheckBox(AUTOMOVEMYSTERIESBETAHOME, lang.map_home, updateMoveMysteries)}
            ${appendCheckBox(AUTOMOVEMYSTERIESBETAAREA, lang.map_area, updateMoveMysteries)}
            ${appendCheckBox(AUTOMOVEMYSTERIESBETAINCLUDEWPT, lang.map_includewpt, updateMoveMysteries)}
        </div>
    `;
};

const getMapInsance = () =>{
    // @ts-ignore
    return GMWindow.MapSettings.Map;
};

export const gccommentOnMapPage = () => {
    waitForPropOfObject("L.Map", GMWindow, () => {
        setMap(getMapInsance());
        $(`<div id="mysterymover" style="width:98%;border:1px solid lightgrey"></div>`).insertAfter('#search > div.SearchBox');
        render($("#mysterymover")[0], generateMapMenue());
        setTimeout(function() {
            toggleMoveMysteries();
        }, 1000);
    });
};