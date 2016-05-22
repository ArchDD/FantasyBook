var exports = module.exports = {};
var sql = require("sqlite3").verbose();
var formidable = require("formidable");
var util = require('util');

exports.submitBookForm = function(user,request,db) {
    var form = new formidable.IncomingForm();
    // Parsing form input to store in file or database
    form.parse(request, function (err, fields, files) {
        db.run("INSERT INTO Books "+ 
            "("+
                "username,"+
                "name,"+
                "desc,"+
                "pages,"+
                "colour,"+
                "theme,"+
                "texture"+
            ") VALUES ('"+
                user+"','"+
                fields['book-title']+"',"+
                "'A "+fields['theme']+" book.',"+
                2+",'"+
                fields['colour']+"','"+
                fields['theme']+"',"+
                "'leather')"
            , dbErr);
        // get new book id and create event
        db.get("SELECT last_insert_rowid()",function(err,data){
            var bookId = data['last_insert_rowid()'];
            // add event entry to book
            addNewEvent(bookId,2,fields['theme'],db);
            // register users who can participate in book
            insertContributorRow(bookId,user,db);
            var players = fields['player'];
            if(players) {
                if(typeof(players)==='object') {
                    for(var i = 0; i < players.length; i++)
                        insertContributorRow(bookId,players[i],db);
                }
                else {
                    insertContributorRow(bookId,players,db);
                }
            }
        });
    });

}

function insertContributorRow(bookId,user,db) {
    retrieveUser(user,db,function(err,row) {
        if(row){
            db.run("INSERT OR IGNORE INTO BookContributors VALUES ('"+
                bookId+"','"+
                user+"')"
            , dbErr);
        }
    });
}

// retrieve book by book id
function retrieveUser(user,db,callback){
    db.get("SELECT * FROM Users WHERE username = '"+user+"'", function(err, row) {
        callback(err,row);
    });
}

// retrieve books associated with username from database
function retrieveUserBooks(username,db,callback){
    // select books which the user is registered with
    db.all("SELECT * FROM Books WHERE b_id IN "+
        "(SELECT b_id FROM BookContributors WHERE "+
            "username = '"+username+"')", function(err, rows) {
        callback(err,rows);
    });
}

// retrieve book row from database if user owns it
function retrieveUserBook(username,bookId,db,callback){
    // select books which the user is registered with
    db.get("SELECT * FROM Books WHERE b_id IN "+
        "(SELECT b_id FROM BookContributors WHERE "+
            "username='"+username+
            "' and b_id="+bookId+") LIMIT 1"
    , function(err, row) {
        callback(err,row);
    });
}

// retrieve book by book id
function retrieveBookById(bookId,db,callback){
    db.get("SELECT * FROM Books WHERE b_id = "+bookId, function(err, row) {
        callback(err,row);
    });
}

// retrieve random event
function retrieveRandomEvent(theme,db,callback){
    db.get("SELECT * FROM BookEvents WHERE theme='"+theme+"' ORDER BY RANDOM() LIMIT 1", function(err, row) {
        callback(err,row);
    });
}

// retrieve book entry with page number and book id
function retrieveBookEntry(bookId,page,db,callback){
    db.get("SELECT * FROM BookEntries WHERE b_id="+bookId+" and page_id="+page, function(err, row) {
        callback(err,row);
    });
}

// retrieve event with event id 
function retrieveBookEvent(eventId,db,callback){
    db.get("SELECT * FROM BookEvents WHERE e_id="+eventId, function(err, row) {
        callback(err,row);
    });
}

function insertNewEventData(bookId,page,eventId,db){
    // insert new page event into database
    db.run("INSERT INTO BookEntries VALUES("+
            bookId+","+
            page+","+
            eventId+","+
            "0,"+
            "0"+
        ")"
        , dbErr);
}

function updateEventChoice(bookId,page,choice,db){
    // Increment total page count of book
    db.run("UPDATE Books SET pages=pages+1"+" WHERE b_id = "+bookId, dbErr);

    // insert new page event into database
    db.run("UPDATE BookEntries SET is_completed = 1, choice_id="+choice+
        " WHERE b_id="+bookId+" and page_id="+page
        , dbErr);
}

exports.sendBooks = function (user,response,db) {
    retrieveUserBooks(user, db, function(err,rows){
        var books = {};
        for(var i = 0; i < rows.length; i++){
            row = rows[i];
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

exports.setOutcome = function(user,bookId,choice,response,db){
    retrieveUserBook(user, bookId, db, function(err, row) {
        // if the user was found in possession of the book
        if(row) {   
            // event is last page of book
            var page = row['pages'];
            // update book size and entry to reflect choice
            updateEventChoice(bookId,page,choice,db);
            addNewEvent(bookId,page+1,row['theme'],db);
            var pageObj = {"pages" : page+1};
            
            response.end(JSON.stringify(pageObj));
        }
    });
}

exports.getAndSendEvent = function (user,bookId,page,response,db) {
    retrieveUserBook(user, bookId, db, function(err, row) {
            // if the user was found in possession of the book
            if(row) {
                // send existing event
                retrieveBookEntry(bookId,page,db,function(err,bookEntry){
                    retrieveBookEvent(bookEntry['e_id'], db, function(err,eventEntry) {
                        sendEvent(bookEntry,eventEntry,response);
                    });
                });
            }
    });
}



function sendEvent(bookEntry,eventEntry,response){
    var eventObj;
    if(bookEntry['is_completed']==true) {
        // return event title and outcome
        var choice = bookEntry['choice_id'];
        eventObj = {
            "eventName" : eventEntry['title'],
            "eventDesc" : eventEntry['description']+" "+eventEntry['outcome'+choice],
            "isCompleted" : true
        }
    } else {
        // return choices and desc
        eventObj = {
            "eventName" : eventEntry['title'],
            "eventDesc" : eventEntry['description'],
            "isCompleted" : false,
            "choice1" : eventEntry['choice1'],
            "choice2" : eventEntry['choice2']
        }
    }
    var jsonObj = JSON.stringify(eventObj);
    response.end(jsonObj);
}

function addNewEvent(bookId,page,theme,db){
    retrieveRandomEvent(theme,db,function(err,row){
        // record new event in bookentries table
        insertNewEventData(bookId,page,row['e_id'],db);
    });
}

function dbErr(e) { if (e) throw e; }