
import $ from 'jquery';
import {log} from '../../helper/logger.js';
import {doLoadCommentFromGCCode, doLoadCommentFromGUID} from "../../function/db.js";
import { state_default, state_found, state_solved, state_unsolved } from '../../consts/icons.js';
import { html } from 'lighterhtml';
import { lang } from '../../consts/language.js';
import { convertDec2DMS } from '../../helper/coordinates.js';
import { tooltip } from '../../helper/tooltip.js';
import { StateEnum } from '../../dataClasses/stateEnum';


export const addCommentBubblesToPage = () => {
    log("info", "weaving comments into table...");    

    const style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'screen';
    style.innerHTML = '* {margin:0; padding:0}#text {margin:50px auto; width:500px}.hotspot {color:#900; padding-bottom:1px; border-bottom:1px dotted #900; cursor:pointer}#tt {position:absolute; display:block}#tt_top {display:block; height:5px; margin-left:5px; overflow:hidden}#tt_cont {display:block; padding:2px 12px 3px 7px; margin-left:5px; background:#666; color:#FFF}#tt_bot {display:block; height:5px; margin-left:5px; overflow:hidden}';
    document.getElementsByTagName('head')[0].appendChild(style);

    const anchors = document.getElementsByTagName('a');

    // old regex
    const regGUID = /cache_details\.aspx\?guid=([^&]*)/;

    // schema for
    // http://www.geocaching.com/geocache/GC1P7MN_eine-dunkle-seite-der-stadt
    const regGCCode = /geocache\/(\w*)_/;

    // schema for
    // https://coord.info/XYZ123
    const regCoordInfo = /coord\.info\/(\w*)/;

    let previousAnchor = null;

    for (let i = 0; i < anchors.length; i++) { // check all links
        let comment = null;
        const a = anchors[i];

        if (regGCCode.exec(a.href)) { // anchor is a GCCode link to a cache
            comment = doLoadCommentFromGCCode(RegExp.$1);
        } else if (regGUID.exec(a.href)) { // anchor is a GUID link to a cache
            comment = doLoadCommentFromGUID(RegExp.$1);
        } else if (regCoordInfo.exec(a.href)) { // anchor is a CoordInfo link to a cache
            comment = doLoadCommentFromGCCode(RegExp.$1);
        }
        if (a.href == previousAnchor) {
            continue;
        }
        previousAnchor = a.href;

        if (!comment)
            continue;

        const target = document.createElement('img');

        if (!comment.state)
            target.src = state_default;
        else {
            if (comment.state == StateEnum.unsolved)
                target.src = state_unsolved;
            else if (comment.state == StateEnum.solved)
                target.src = state_solved;
            else if (comment.state == StateEnum.found)
                target.src = state_found;
            else
                target.src = state_default;
        }

        target.width = 16;
        target.height = 16;
        target.alt = 'Comment available';
        target.setAttribute("guid", comment.guid);

        target.addEventListener('mouseover', (evt) => {
            let targetNode = evt.relatedTarget;
            if (!targetNode)
                return;

            let cacheLink, commValue;

            while (targetNode.nodeName.toLowerCase() != "td") {
                targetNode = targetNode.parentNode;
                if (!targetNode)
                    break;
            }
            if (!targetNode || (targetNode.nodeName.toLowerCase() != "td"))
                return;

            const gccimg = $(targetNode).find("img[guid]");
            const guid = gccimg.attr("guid");
            commValue = doLoadCommentFromGUID(guid);

            if (commValue == null) {
                log('debug', 'could not load comment for guid ' + guid);
                return;
            }

            var commentTooltip = null;
            if ((commValue.lat != null) && (commValue.lng != null)) {
                commentTooltip = html`
                    <strong>${lang.myfinalcoords}</strong>
                    <br/>
                    ${convertDec2DMS(commValue.lat, commValue.lng)}
                `;
            }
            if (commValue.commentValue) {
                commentTooltip = html`
                    ${commentTooltip}
                    <br/>
                    <br/>
                    <strong>${lang.mycomment}</strong>
                    <br/>
                    ${commValue.commentValue.replace(/\n/g, '<br/>')}
                `;
            }
            tooltip.show(commentTooltip, 400);
        }, false);
        $(target).mouseout(tooltip.hide);

        a.parentNode.appendChild(document.createTextNode(' '));
        a.parentNode.appendChild(target);

        target.style.display = 'inline';
    }
}