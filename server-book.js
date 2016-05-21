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
                "texture"+
            ") VALUES ('"+
                user+"','"+
                fields['book-title']+"',"+
                "'A "+fields['category']+" book.',"+
                2+",'"+
                fields['colour']+"',"+
                "'leather')"
            , dbErr);
        // get new book id and create event
        db.get("SELECT last_insert_rowid()",function(err,data){
            addNewEvent(data['last_insert_rowid()'],2);
        });
        
    });
}

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

    db.get("SELECT * FROM Books WHERE b_id = "+bookId, function(err, row) {
        callback(err,row);
    });

    db.close();
}

// retrieve random event
function retrieveRandomEvent(callback){
    var db = new sql.Database("westory.db");

    db.get("SELECT * FROM BookEvents ORDER BY RANDOM() LIMIT 1", function(err, row) {
        callback(err,row);
    });

    db.close();
}

// retrieve book entry with page number and book id
function retrieveBookEntry(bookId,page,callback){
    var db = new sql.Database("westory.db");
    db.get("SELECT * FROM BookEntries WHERE b_id="+bookId+" and page_id="+page, function(err, row) {
        callback(err,row);
    });

    db.close();
}

// retrieve event with event id 
function retrieveBookEvent(eventId,callback){
    var db = new sql.Database("westory.db");
    db.get("SELECT * FROM BookEvents WHERE e_id="+eventId, function(err, row) {
        callback(err,row);
    });

    db.close();
}

function insertNewEventData(bookId,page,eventId){
    var db = new sql.Database("westory.db");
    // Increment total page count of book
    //db.run("UPDATE Books SET pages=pages+1"+" WHERE b_id = "+bookId, dbErr);

    // insert new page event into database
    db.run("INSERT INTO BookEntries VALUES("+
            bookId+","+
            page+","+
            eventId+","+
            "0,"+
            "0"+
        ")"
        , dbErr);

    db.close();
}

function updateEventChoice(bookId,page,choice){
    var db = new sql.Database("westory.db");
    // Increment total page count of book
    db.run("UPDATE Books SET pages=pages+1"+" WHERE b_id = "+bookId, dbErr);

    // insert new page event into database
    db.run("UPDATE BookEntries SET is_completed = 1, choice_id="+choice+
        " WHERE b_id="+bookId+" and page_id="+page
        , dbErr);

    db.close();
}

exports.sendBooks = function (user,response) {
    retrieveUserBooks(user, function(err,rows){
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

exports.setOutcome = function(user,bookId,choice,response){
    retrieveBookById(bookId, function(err, row) {
            if(row['username']===user) {
                // event is last page of book
                var page = row['pages'];
                // update book size and entry to reflect choice
                updateEventChoice(bookId,page,choice);
                addNewEvent(bookId,page+1);
                var pageObj = {"pages" : page+1};
                
                response.end(JSON.stringify(pageObj));
            }
    });
}

exports.getAndSendEvent = function (user,bookId,page,response) {
    retrieveBookById(bookId, function(err, row) {
            if(row['username']===user) {
                // send existing event
                retrieveBookEntry(bookId,page,function(err,bookEntry){
                    retrieveBookEvent(bookEntry['e_id'], function(err,eventEntry) {
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
    console.log(bookEntry['is_completed']);
    var jsonObj = JSON.stringify(eventObj);
    response.end(jsonObj);
}

function addNewEvent(bookId,page){
    retrieveRandomEvent(function(err,row){
        var eventObj = {
            "eventName" : row['title'],
            "eventDesc" : row['description'],
            "choice1" : row['choice1'],
            "choice2" : row['choice2']
        }
        // record new event in bookentries table
        insertNewEventData(bookId,page,row['e_id']);
    });
}

function dbErr(e) { if (e) throw e; }