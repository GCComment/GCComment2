var _browser = "unknown";
if (typeof chrome !== "undefined") {
    // Chrome detected
    _browser = "Chrome";
} else {
    _browser = "FireFox";
}

export const browser = _browser;

export const isTampermonkey =
    typeof GM_info != "undefined" &&
    typeof GM_info.scriptHandler != "undefined" &&
    GM_info.scriptHandler == "Tampermonkey"
        ? true
        : false;
