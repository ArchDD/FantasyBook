module.exports = {
    submitCharacterForm: function (req, res) {
        // Creating form object
        var form = new formidable.IncomingForm();
        // Parsing form input to store in file or database
        form.parse(req, function (err, fields, files) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.write('Received Data: \n\n');    
            res.end(util.inspect({
                fields: fields,
                files: files
            }));
        });
    }
}