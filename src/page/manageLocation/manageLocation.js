import $ from "jquery";
import { parseCoordinates } from "../../helper/coordinates.js";
import { log } from "../../helper/logger.js";
import { waitForEl } from "./../../helper/wait";

export const gccommentOnManageLocations = () => {
    var homeCoordinates = [null, null];
    waitForEl(".search-coordinates", () => {
        const updateHomeCoords = () => {
            const newHomeCoordinates = parseCoordinates(
                String($(".search-coordinates").val()).replace("′", "")
            );

            if (
                newHomeCoordinates.length >= 2 &&
                newHomeCoordinates[0] != homeCoordinates[0] &&
                newHomeCoordinates[1] != homeCoordinates[1]
            ) {
                homeCoordinates = newHomeCoordinates;

                GM_setValue("HOMELAT", "" + homeCoordinates[0]);
                GM_setValue("HOMELNG", "" + homeCoordinates[1]);
                log(
                    "info",
                    "stored new Home : " +
                        GM_getValue("HOMELAT") +
                        " " +
                        GM_getValue("HOMELNG")
                );
            }
        };

        setInterval(() => {
            if ($("#messages").hasClass("alert-success")) {
                updateHomeCoords();
            }
        }, 250);

        updateHomeCoords();
    });
};
