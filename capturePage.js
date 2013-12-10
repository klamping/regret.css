var capture = require("capture");

function capturePage (url) {
    console.log("Capturing: " + url);

    capture([url], {}, function () {
        console.log("Page captured");
    });
}

module.exports = capturePage;