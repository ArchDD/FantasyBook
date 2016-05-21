"use strict";
var http = require('http');
var util = require('util');
var formidable = require('formidable');

module.exports = {
    // Parses form to store in database and redirects
    submitCharacterForm: function (request, response, db) {
        // Creating form object
        var form = new formidable.IncomingForm();
        // Parsing form input to store in file or database
        form.parse(request, function (err, fields, files) {
            // Deal with form
            console.log('Add to database here');
            /*db.run("INSERT INTO Characters (name, hair_type, nose_type, mouth_type, head_type, skin_type, eye_colour, mouth_colour)\
                    VALUES ('"+fields['']+"', '"+fields['']+"', '"+fields['']+"')",
            dbErr);*/
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
