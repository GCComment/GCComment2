import $ from 'jquery';
import { GMWindow } from '../../helper/gmWindow.js';
import { waitForPropOfObject } from '../../helper/wait.js';
import { mapFinderHook } from './mapHelper/newMapHook.js';
import { createMovedFinal, drawCircle, drawMarker, drawMultiline, setMap } from './mapHelper/mapDraw';
import { COMPREFIX } from '../../consts/general.js';
import { doLoadCommentFromGUID } from '../../function/db.js';
import { parseCoordinates } from '../../helper/coordinates.js';


const dummy = () =>{
    var keys = GM_listValues();
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.indexOf(COMPREFIX) > -1) {
            var guid = key.substring(COMPREFIX.length, key.length);
            var comment = doLoadCommentFromGUID(guid);

            

            if (comment.lat && comment.lng) {
                createMovedFinal(comment, true);
            }

            if (comment.waypoints && (comment.waypoints.length > 0)) {
                var aWaypoints = [];
                aWaypoints.push([comment.origlat, comment.origlng]);

                for (var j = 0; j < comment.waypoints.length; j++) {
                    var coords = parseCoordinates(comment.waypoints[j].coordinate);
                    if (coords.length == 2) {
                        aWaypoints.push([coords[0], coords[1]]);
                        drawMarker(coords[0], coords[1], "wpt", null, comment.gccode);                        
                        drawCircle(coords[0], coords[1], "161");                        
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
};

export const gccommentOnNewMapPage = () => {
    waitForPropOfObject("L.Map", GMWindow, () => {
        mapFinderHook((mapInstance) => {
            console.log("asd");   
            console.log(mapInstance);
            setMap(mapInstance);
            dummy();
        });
 
    });
};