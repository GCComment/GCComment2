/**
 *
 * @returns {Number}
 *
 * v1 > v2 : 1
 *
 * v1 == v2: 0
 *
 * v1 < v2 : -1
 */
export const versionCompare = (
    /** @type {string} */ v1,
    /** @type {string} */ v2
) => {
    const v1Splitted = v1.split(".");
    const v2Splitted = v2.split(".");

    var len = Math.max(v1Splitted.length, v2Splitted.length);

    for (var i = 0; i < len; i++) {
        if (v1Splitted.length < len) {
            v1Splitted[i] = "0";
        }
        if (v2Splitted.length < len) {
            v2Splitted[i] = "0";
        }
        if (Number(v1Splitted[i]) > Number(v2Splitted[i])) {
            return 1;
        } else if (Number(v1Splitted[i]) < Number(v2Splitted[i])) {
            return -1;
        }
    }

    return 0;
};
