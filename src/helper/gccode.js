
import {COMGCPREFIX} from "../consts/general.js"
import {GCC_getValue} from "../helper/storage.js"

export const getGUIDFromGCCode = function(gcCode) {
    var value = GCC_getValue(COMGCPREFIX + gcCode);
    if (value)
        return value;
    // else
    // log('info', 'no GUID for GCCode ' + gcCode + ' saved. ');
}

export const GC2DBId = function(gcCode) {
    var gcId = 0;

    var sequence = "0123456789ABCDEFGHJKMNPQRTVWXYZ";

    var rightPart = gcCode.substring(2).toUpperCase();

    var base = 31;
    if ((rightPart.length < 4) || ((rightPart.length == 4) && (sequence.indexOf(rightPart.charAt(0)) < 16))) {
        base = 16;
    }

    for (var p = 0; p < rightPart.length; p++) {
        gcId *= base;
        gcId += sequence.indexOf(rightPart.charAt(p));
    }

    if (base == 31) {
        gcId += Math.pow(16, 4) - 16 * Math.pow(31, 3);
    }
    return gcId;
}

export const DBId2GCNew = function(newGcId) {
    var gcNewCode = "";
    var sequence = "tHpXJR8gyfzCrdV5G0Kb3Y92N47lTBPAhWnvLZkaexmSwq6sojDcEQMFO";

    var base = 57;

    var rest = 0;
    var divResult = newGcId;

    do {
        rest = divResult % base;
        divResult = Math.floor(divResult / base);
        gcNewCode = sequence.charAt(rest) + gcNewCode;
    } while (divResult != 0);

    return gcNewCode;
}
