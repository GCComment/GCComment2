// @ts-nocheck

// based on https://github.com/unbam/Leaflet.SlideMenu
/*
    Copyright (c) 2016, Masashi Takeshita
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met: 

    1. Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer. 
    2. Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution. 

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
    ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
// licence end
import $ from "jquery";
import { GMWindow } from "../helper/gmWindow.js";
// @ts-ignore
// css hack
import leafletMenuCss from "bundle-text:./leafletMenu.css";
import { appendCSS } from "./../helper/css";
import { close } from "../consts/icons.js";

appendCSS("text", leafletMenuCss);

const SlideMenu = () => {
    const leaflet = GMWindow.L;
    return leaflet.Control.extend({
        options: {
            position: "topleft",
            menuposition: "topleft", // topleft,topright,bottomleft,bottomright
            width: "300px",
            height: "100%",
            direction: "horizontal", // vertical or horizontal
            marginvertical: "0",
            changeperc: "10",
            delay: "10",
            icon: "fas fa-bars",
            iconImg: "",
            hidden: false
        },

        initialize: (innerHTML, options) => {
            leaflet.Util.setOptions(this, options);
            this._innerHTML = innerHTML;
            this._isLeftPosition =
                this.options.menuposition == "topleft" ||
                this.options.menuposition == "bottomleft"
                    ? true
                    : false;
            this._isTopPosition =
                this.options.menuposition == "topleft" ||
                this.options.menuposition == "topright"
                    ? true
                    : false;
            this._isHorizontal =
                this.options.direction == "horizontal" ? true : false;
        },

        onAdd: (map) => {
            this._container = leaflet.DomUtil.create(
                "div",
                "leaflet-control-slidemenu leaflet-bar leaflet-control"
            );
            $(this._container).css(
                "margin-top",
                parseInt(this.options.marginvertical, 10) + "px"
            );
            var link = leaflet.DomUtil.create(
                "a",
                "leaflet-bar-part leaflet-bar-part-single",
                this._container
            );
            link.title = "Menu";
            if (this.options.iconImg !== "") {
                const img = leaflet.DomUtil.create(
                    "img",
                    this.options.icon,
                    link
                );
                img.src = this.options.iconImg;
                img.style = "margin-top: 5px;";
            } else {
                leaflet.DomUtil.create("span", this.options.icon, link);
            }

            this._menu = leaflet.DomUtil.create(
                "div",
                "leaflet-menu",
                map._container
            );

            this._menu.style.width = this.options.width;
            this._menu.style.height = this.options.height;

            if (this._isHorizontal) {
                var frominit = -parseInt(this.options.width, 10);
                if (this._isLeftPosition) {
                    this._menu.style.left = "-" + this.options.width;
                } else {
                    this._menu.style.right = "-" + this.options.width;
                }

                if (this._isTopPosition) {
                    this._menu.style.top = "0px";
                } else {
                    this._menu.style.bottom = "0px";
                }
            } else {
                var frominit = -parseInt(this.options.height, 10);
                if (this._isLeftPosition) {
                    this._menu.style.left = "0px";
                } else {
                    this._menu.style.right = "0px";
                }
                var frominit = parseInt(this.options.marginvertical, 10);
                if (this._isTopPosition) {
                    this._menu.style.top = "-" + this.options.height;
                } else {
                    this._menu.style.bottom = "-" + this.options.height;
                }
            }

            var closeButton = leaflet.DomUtil.create(
                "button",
                "leaflet-menu-close-button",
                this._menu
            );
            var closeButtonImg = leaflet.DomUtil.create("img", "", closeButton);
            closeButtonImg.src = close;
            if (this._isHorizontal) {
                if (this._isLeftPosition) {
                    closeButton.style.float = "right";
                } else {
                    closeButton.style.float = "left";
                }
            } else {
                if (this._isTopPosition) {
                    closeButton.style.float = "right";
                } else {
                    closeButton.style.float = "right";
                }
            }

            this._contents = leaflet.DomUtil.create(
                "div",
                "leaflet-menu-contents",
                this._menu
            );
            this._contents.innerHTML = this._innerHTML;
            this._contents.style.clear = "both";

            if (this._isHorizontal) {
                var ispx = this.options.width.slice(-1) == "x" ? true : false;
                var unit =
                    (parseInt(this.options.width, 10) *
                        parseInt(this.options.changeperc, 10)) /
                    100;
            } else {
                var ispx = this.options.height.slice(-1) == "x" ? true : false;
                var unit =
                    (parseInt(this.options.height, 10) *
                        parseInt(this.options.changeperc, 10)) /
                    100;
            }

            leaflet.DomEvent.disableClickPropagation(this._menu);
            leaflet.DomEvent.on(link, "click", leaflet.DomEvent.stopPropagation)
                .on(
                    link,
                    "click",
                    (e) => {
                        // Open
                        $("#search-map-cta").hide();
                        this.show();
                        this._animate(
                            this._menu,
                            frominit,
                            0,
                            true,
                            ispx,
                            unit
                        );
                        e.preventDefault();
                        e.stopPropagation();
                    },
                    this
                )
                .on(closeButton, "click", leaflet.DomEvent.stopPropagation)
                .on(
                    closeButton,
                    "click",
                    (e) => {
                        // Close
                        this._animate(
                            this._menu,
                            0,
                            frominit,
                            false,
                            ispx,
                            unit
                        );
                        $("#search-map-cta").show();
                        e.preventDefault();
                        e.stopPropagation();
                    },
                    this
                );
            leaflet.DomEvent.on(this._menu, "mouseover", () => {
                map.scrollWheelZoom.disable();
            });
            leaflet.DomEvent.on(this._menu, "mouseout", () => {
                map.scrollWheelZoom.enable();
            });

            if (this.options.hidden) {
                this.hide();
            }

            return this._container;
        },

        onRemove: (map) => {
            //Remove sliding menu from DOM
            map._container.removeChild(this._menu);
            delete this._menu;
        },

        setContents: (innerHTML) => {
            this._innerHTML = innerHTML;
            this._contents.innerHTML = this._innerHTML;
        },

        _animate: (menu, from, to, isOpen, ispx, unit) => {
            if (this._isHorizontal) {
                if (this._isLeftPosition) {
                    menu.style.left = from + (ispx ? "px" : "%");
                } else {
                    menu.style.right = from + (ispx ? "px" : "%");
                }
            } else {
                if (this._isTopPosition) {
                    menu.style.top = from + (ispx ? "px" : "%");
                } else {
                    menu.style.bottom = from + (ispx ? "px" : "%");
                }
            }

            if (from != to) {
                setTimeout(
                    (slideMenu) => {
                        var value = isOpen ? from + unit : from - unit;
                        slideMenu._animate(
                            slideMenu._menu,
                            value,
                            to,
                            isOpen,
                            ispx,
                            unit
                        );
                    },
                    parseInt(this.options.delay),
                    this
                );
            } else {
                return;
            }
        },

        hide: () => {
            this._container.style.display = "none";
        },

        show: () => {
            this._container.style.display = "inherit";
        }
    });
};

export const NewSlideMenu = (innerHTML, options) =>
    new (SlideMenu())(innerHTML, options);
