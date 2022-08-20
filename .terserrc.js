const fs = require("fs");

const header = fs.readFileSync("greasemonkey/greasemonkey.header", "utf8");

module.exports = {
    output: {
        preamble: `${header}`
    }
};
