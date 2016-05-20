var exports = module.exports = {};
var sql = require("sqlite3").verbose();

// retrieve books associated with username from database
function retrieveUserBooks(username,callback){
    var db = new sql.Database("westory.db");

    db.all("SELECT * FROM Books WHERE username = '"+username+"'", function(err, rows) {
        callback(err,rows);
    });

    db.close();
}

exports.sendBooks = function (response) {
    retrieveUserBooks("guest", function(err,rows){
        var books = {};
        for(var i = 0; i < rows.length; i++){
            row = rows[i];
            console.log(row);
            books[i] = {
                bookTitle: row['name'],
                desc: row['desc'],
                pages: row['pages'],
                colour: row['colour'],
                texture: row['texture']
            };
        }
        var jsonObj = JSON.stringify(books);
        response.end(jsonObj);
    });
};

exports.sendEvent = function (response) {

    return {
        "eventName" : "DRAGONS!??!?!",
        "eventDesc" : "A dragon nest has been left empty! You spot eggs. What to do?!"
    };
}