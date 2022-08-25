var fs = require("fs");

fs.readFile(
    "greasemonkey/greasemonkey_dev.user.js",
    "utf8",
    function (err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(
            /\${rootfolder}/g,
            process.cwd().replace(/\\/g, "/")
        );

        fs.writeFile(
            "distDev/greasemonkey_dev.user.js",
            result,
            "utf8",
            function (err) {
                if (err) return console.log(err);
            }
        );

        console.log("\x1b[32mTo install the dev script (once) open:");
        console.log(
            `\x1b[0m    file:///${process
                .cwd()
                .replace(/\\/g, "/")}/distDev/greasemonkey_dev.user.js`
        );
        console.log("\n");
    }
);
