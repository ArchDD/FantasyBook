module.exports = {
    handleRequest: function (request, response) {
        if (request.method.toLowerCase() == 'post') {
            this.debugLog("rawr");
        }
        this.debugLog(request.method);
    },

    submitCharacterForm: function (request, response) {
        // Creating form object
        var form = new formidable.IncomingForm();
        // Parsing form input to store in file or database
        form.parse(request, function (err, fields, files) {
            response.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            response.write('Received Data: \n\n');    
            response.end(util.inspect({
                fields: fields,
                files: files
            }));
        });
    },

    debugLog: function(output){
        console.log('server-character.js: '+output);
    }
}