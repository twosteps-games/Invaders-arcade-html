const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs");

const port = 3000;

const mimeTypes = {
    html: "text/html",
    jpeg: "image/jpeg",
    jpg: "image/jpg",
    png: "image/png",
    js: "text/javascript",
    css: "text/css",
}

http.createServer((req, res) => {
    let uri = url.parse(req.url).pathname;
    let fileName = path.join(process.cwd(), unescape(uri));
    let stats;

    try {
        stats = fs.lstatSync(fileName);
    } catch (e) {
        res.writeHead(400, {
            "Content-type": "text/plain"
        });
        res.write("404 Not Found\n");
        res.end();
        return;
    }

    if (stats.isFile()) {
        let mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, {
            "Content-type": mimeType
        });
        let fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            "Location": "index.html",
        })
        console.log("Nain")
        res.end();
    } else {
        res.writeHead(500, {
            "Content-type": "text/plain"
        });
        res.write("500 Internal Error\n");
        res.end();
    }

}).listen(port, () => {
    console.log("Listening on port:", port);
})