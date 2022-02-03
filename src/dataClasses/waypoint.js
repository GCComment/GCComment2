export class Waypoint {
    /**
     * @type {string}
     */
    prefix;
    /**
     * @type {string}
     */
    lookup;

    /**
     * @type {string}
     */
    name;

    /**
     * @type {Object}
     */
    coordinate;

    /**
     * @param {Waypoint} init
     */
    constructor(init) {
        Object.assign(this, init);
    }
}
