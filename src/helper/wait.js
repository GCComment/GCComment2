import $ from 'jquery';
export const waitForEl = (selector, callback) => {
    if ($(selector).length) {
        callback();
    } else {
        setTimeout(() => {
            waitForEl(selector, callback);
        }, 100);
    }
};

export const waitForPropOfObject = (selector, obj, callback) => {
    const splittedSelector = selector.split(".");
    var found = true;
    var currentObj = obj;

    for (var i = 0; i < splittedSelector.length; i++) {
        if (currentObj.hasOwnProperty(splittedSelector[i]) && currentObj[splittedSelector[i]] !== null) {
            currentObj = currentObj[splittedSelector[i]];
        }
        else {
            found = false;
            break;
        }
    }

    if (found) {
        callback();
    } else {
        setTimeout(() => {
            waitForPropOfObject(selector, obj, callback);
        }, 1);
    }
};
