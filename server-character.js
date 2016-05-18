var http = require('http');
var util = require('util');
var formidable = require('formidable');

module.exports = {
    handleRequest: function (request, response) {
        if (request.method.toLowerCase() == 'post' && request.url.toLowerCase() == '/character-creator.html'){
            //debugLog('create');
            this.submitCharacterForm(request, response);
            return true;
        }
        return false;
    },

    // Parses form to store in database and redirects
    submitCharacterForm: function (request, response) {
        // Creating form object
        var form = new formidable.IncomingForm();
        // Parsing form input to store in file or database
        form.parse(request, function (err, fields, files) {
            // Deal with form
            console.log('Adding to database');

            // redirects
            var locationHeader = { 'Location': '/book.html' };
            response.writeHead(307, locationHeader);
            response.end();

            /*  response.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            response.write('Received Data: \n\n');
            response.end(util.inspect({
                fields: fields,
                files: files
            }));*/
        });
    },

    debugLog: function(output){
        console.log('server-character.js: '+output);
    }
}