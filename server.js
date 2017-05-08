const http  = require('http');
const fs    = require('fs');

let server = http.createServer(function ad (request, response) {
    if (request.url === '/') {
        let index = fs.readFileSync('index.html');
        response.end(index);
    } else {
        let asset = request.url.substr(1);
        console.log(asset);
        if (fs.existsSync(asset)) {
            response.end(fs.readFileSync(asset));
        } else {
            response.end('No');
        }
    }
});

server.listen('3000', () => {
    console.log('App listening on port 3000');
});
