import $ from 'jquery';
import { html } from "lighterhtml";
import { render } from 'lighterhtml';

export const tooltip = ( () => {
    var top = 3;
    var left = 3;
    var maxw = 500;
    var speed = 10;
    var timer = 20;
    var endalpha = 95;
    var alpha = 0;
    var tt, h

    const init = () =>{
        tt = document.createElement("div");
        tt.setAttribute("id", "tt");
        document.body.appendChild(tt);
        $(tt).css('opacity', 0);
        $(tt).css('filter', 'alpha(opacity=0)');
        document.onmousemove = funcCollection.pos;

        render(tt, html`
            <div id="tt_top"> </div>
            <div id="tt_cont"> </div>
            <div id="tt_bot"> </div>
        `);
    }

    const funcCollection = {
        show: function (v, w) {
            tt.style.display = "block";
            if (typeof(v) === "object"){
                render($("#tt_cont")[0], v);
            }
            else{
                $("#tt_cont")[0].innerHTML = v;
            }
            tt.style.width = w ? w + "px" : "auto";            
            if (tt.offsetWidth > maxw) {
                tt.style.width = maxw + "px";
            }
            h = parseInt(tt.offsetHeight) + top;
            clearInterval(tt.timer);
            tt.timer = setInterval(function () {
                funcCollection.fade(1);
            }, timer);
        },
        pos: function (/** @type {{ pageY: any; pageX: any; }} */ e) {
            var u = e.pageY;
            var l = e.pageX;
            tt.style.top = u - h + "px";
            tt.style.left = l + left + "px";
        },
        fade: function (d) {
            var a = alpha;
            if ((a != endalpha && d == 1) || (a != 0 && d == -1)) {
                var i = speed;
                if (endalpha - a < speed && d == 1) {
                    i = endalpha - a;
                } else if (alpha < speed && d == -1) {
                    i = a;
                }
                alpha = a + i * d;
                tt.style.opacity = alpha * 0.01;
                tt.style.filter = "alpha(opacity=" + alpha + ")";
            } else {
                clearInterval(tt.timer);
                if (d == -1) {
                    tt.style.display = "none";
                }
            }
        },
        hide: function () {
            clearInterval(tt.timer);
            tt.timer = setInterval(function () {
                funcCollection.fade(-1);
            }, timer);
        },
    };

    init();
    return funcCollection;
})();