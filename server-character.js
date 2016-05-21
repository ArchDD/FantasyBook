"use strict";
var http = require('http');
var util = require('util');
var formidable = require('formidable');

module.exports = {
    // Parses form to store in database and redirects
    submitCharacterForm: function (request, response, db){
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

    loadCharacter: function (request, response, db, secret) {
        console.log("ay");
        // Check if a session exists
        db.all("SELECT username FROM Sessions WHERE secret = '"+secret+"'", function(err, u_row) {
            // Retrieve logged user's character or show default
            if (u_row[0])
            {
                db.all("SELECT * FROM Characters WHERE username = '"+u_row[0]['username']+"'", function(err, c_row) {
                    // All users must have a character, return character data to client in json format
                    var jsonObj = JSON.stringify(c_row[0]);
                    response.end(jsonObj);
                    console.log("Found character");
                });
            }
            else
            {
                console.log("Guest");
                // Return default character data to client for guests
                var character = {
                    "name"          : "Guest",
                    "hair_type"     : 1,
                    "nose_type"     : 1,
                    "mouth_type"    : 1,
                    "head_type"     : 1,
                    "hair_tint"     : "ffffff",
                    "skin_tint"     : "ffffff",
                    "eye_tint"      : "ffffff",
                    "mouth_tint"    : "ffffff"
                };
                var jsonObj = JSON.stringify(character);
                response.end(jsonObj);
            }
        });
    }
}