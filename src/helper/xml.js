export const escapeXML = (/** @type {string} */ unescaped) => {
    if (unescaped === null || unescaped === undefined) {
        return null;
    }
    var result = unescaped.replace(/&/g, "&amp;");
    result = result.replace(/>/g, "&gt;");
    result = result.replace(/</g, "&lt;");
    result = result.replace(/"/g, "&quot;");
    result = result.replace(/'/g, "&apos;");

    // escape line breaks
    // result = result.replace(/\n/g, "&#10;");
    return result;
};

export const unescapeXML = (/** @type {string} */ escaped) => {
    if (escaped === null || escaped === undefined) {
        return null;
    }
    var result = escaped.replace(/&gt;/g, ">");
    result = result.replace(/&lt;/g, "<");
    result = result.replace(/&quot;/g, '"');
    result = result.replace(/&amp;/g, "&");
    result = result.replace(/&apos;/g, "'");
    // result = result.replace(/&#10;/g, "\n");
    return result;
};
