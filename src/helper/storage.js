
export const GCC_setValue = function (name, value){
    window.GM_setValue(name, value);
}

export const GCC_getValue = function (name, default_value) {
    return window.GM_getValue(name, default_value);
}

export const GCC_listValues = function () {
    return window.GM_listValues();
}

