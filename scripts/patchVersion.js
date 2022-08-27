var fs = require("fs");

const rootUrl = "https://github.com/GCComment/GCComment2/releases/download";
const tag = process.argv[2];

// update link to map file and inject correct version into header
fs.readFile("dist/gccomment.user.js", "utf8", function (err, data) {
    if (err) {
        return console.log(err);
    }

    if (tag !== "main") {
        var result = data.replace(
            /gccomment\.user\.js\.map/g,
            `${rootUrl}/${tag}/gccomment_${tag}.user.js.map`
        );
        var result = result.replace(
            /@version  0.0.0/g,
            `@version  ${tag.replace("v", "")}`
        );
    }

    fs.writeFile(`dist/gccomment.user.js`, result, "utf8", function (err) {
        if (err) return console.log(err);
    });
});
