import { deleteCommentFromDB, doSaveCommentToGUID } from "../function/db.js";
import { Waypoint } from "./waypoint.js";

const { StateEnum } = require("./stateEnum");

export class CacheComment {
    /**
     * @type {string}
     */
    guid;

    /**
     * @type {string}
     */
    gccode;

    /**
     * @type {string}
     */
    name;

    /**
     * @type {string}
     */
    commentValue = "";

    /**
     * @type {number}
     */
    saveTime = null;

    /**
     * @type {StateEnum}
     */
    state = StateEnum.unknown;

    /**
     * @type {number}
     */
    lat = null;

    /**
     * @type {number}
     */
    lng = null;

    /**
     * @type {number}
     */
    origlat = null;

    /**
     * @type {number}
     */
    origlng = null;

    /**
     * @type {boolean}
     */
    archived = false;

    /**
     * @type {Array<Waypoint>}
     */
    waypoints = [];

    constructor(init) {
        Object.assign(this, init);
    }

    save() {
        doSaveCommentToGUID(this);
    }

    delete() {
        deleteCommentFromDB(this);
    }
}
