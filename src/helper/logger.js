export const log = (
    /** @type {string} */ level,
    /** @type {string} */ text
) => {
    switch (level) {
        case "info":
            console.log(level + ": " + text);
            break;
        case "debug":
            console.log(level + ": " + text);
            break;
    }
};
