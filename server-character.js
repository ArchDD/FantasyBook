"use strict";
var http = require('http');
var util = require('util');
var formidable = require('formidable');

module.exports = {
    // Parses form to store in database and redirects
    submitCharacterForm: function (request, response) {
        // Creating form object
        var form = new formidable.IncomingForm();
        // Parsing form input to store in file or database
        form.parse(request, function (err, fields, files) {
            // Deal with form
            console.log('Add to database here');
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