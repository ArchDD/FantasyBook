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

// retrieve book by book id
function retrieveBookById(bookId,callback){
    var db = new sql.Database("westory.db");

    db.all("SELECT * FROM Books WHERE b_id = "+bookId, function(err, rows) {
        callback(err,rows);
    });

    db.close();
}

// retrieve book event with event id and book id from database
function retrieveBookEvent(bookId,page,callback){
    var db = new sql.Database("westory.db");
    console.log("lookin for"+bookId+","+page);
    db.all("SELECT * FROM BookEvents WHERE b_id="+bookId+" and e_id="+page, function(err, rows) {
        callback(err,rows);
    });

    db.close();
}

function setNewEventData(bookId,page,bookEvent){
    var db = new sql.Database("westory.db");
    // Increment total page count of book
    db.run("UPDATE Books SET pages="+(page+2)+" WHERE b_id = "+bookId, dbErr);

    // insert new page event into database
    db.run("INSERT INTO BookEvents VALUES("+
            page+","+
            bookId+",'"+
            bookEvent['eventName']+"','"+
            bookEvent['eventDesc']+
        "')"
        , dbErr);

    db.close();
}

exports.sendBooks = function (user,response) {
    retrieveUserBooks(user, function(err,rows){
        var books = {};
        for(var i = 0; i < rows.length; i++){
            row = rows[i];
            console.log(row);
            books[i] = {
                bookId : row['b_id'],
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

exports.sendEvent = function (user,bookId,page,response) {
    retrieveBookById(bookId, function(err, rows) {
        if(rows) {
            var row = rows[0];
            if(row['username']===user) {
                console.log((page+1)+","+row['pages']);
                if(row['pages'] == page+1) 
                    sendNewEvent(bookId,page,response);
                else
                    sendExistingEvent(bookId,page,response);
            }
        }
    });
}

function sendNewEvent(bookId,page,response){
    var bookEvent = {
        "eventName" : "DRAGONS!??!?!",
        "eventDesc" : "A dragon nest has been left empty! You spot eggs. What to do?!"
    };
    console.log("new event");
    setNewEventData(bookId,page,bookEvent);
    var jsonObj = JSON.stringify(bookEvent);
    response.end(jsonObj);
}

function sendExistingEvent(bookId,page,response){
    retrieveBookEvent(bookId,page,function(err,rows){
        if(rows) {
            var row = rows[0];
            var eventObj = {
                "eventName" : row['title'],
                "eventDesc" : row['description']
            }
            var jsonObj = JSON.stringify(eventObj);
            response.end(jsonObj);
        }
    }); 
}

function dbErr(e) { if (e) throw e; }