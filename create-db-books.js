"use strict";
var sql = require("sqlite3").verbose();
var db = new sql.Database("westory.db");
db.serialize(startup);

function startup() {
    db.run(
            "INSERT INTO Books VALUES               \
            (                                       \
                0,                                  \
                'guest',                            \
                'Chasing Centaurs',                 \
                '[Theme description]',              \
                2,                                  \
                '#2a6f41',                          \
                'leather'                           \
            )"
    , err);

    db.run(
            "INSERT INTO Books VALUES               \
            (                                       \
                1,                                  \
                'guest',                            \
                'Into Space',                 \
                '[Theme description]',              \
                2,                                  \
                '#42548a',                          \
                'leather'                           \
            )"
    , err);

    db.run(
            "INSERT INTO Books VALUES               \
            (                                       \
                2,                                  \
                'guest',                            \
                'A Murder Mystery',                 \
                '[Theme description]',              \
                2,                                  \
                '#661919',                          \
                'leather'                           \
            )"
    , err);

    db.run(
            "INSERT INTO Books VALUES               \
            (                                       \
                3,                                  \
                'guest',                            \
                'The Adventures of Me',             \
                '[Theme description]',              \
                2,                                  \
                '#4d3960',                          \
                'leather'                           \
            )"
    , err);

    db.run(
            "INSERT INTO BookEvents ("+
                "title,"+
                "description,"+
                "choice1,"+
                "choice2,"+
                "outcome1,"+
                "outcome2"+
            ") "+
            "VALUES ("+
                "'Dragons on the Horizon!',"+
                "'A scout up ahead has spotted a dragon!',"+
                "'Prepare to shoot.',"+
                "'Attempt to go around.',"+
                "'It was not very effective.',"+
                "'You try to go around but stumble upon its nest!'"+
            ")"
    , err);

    db.run(
            "INSERT INTO BookEvents ("+
                "title,"+
                "description,"+
                "choice1,"+
                "choice2,"+
                "outcome1,"+
                "outcome2"+
            ") "+
            "VALUES ("+
                "'A Murder in the Dining Room!',"+
                "'Lying on the table, a letter in one hand and a key in the other."+
                " What should you do?',"+
                "'Read the letter.',"+
                "'Walk away. Not anyone you knew afterall.',"+
                "'Gibberish.',"+
                "'The police see you attempting to leave the scene of the crime."+
                " You are arrested.'"+
            ")"
    , err);

    db.run(
            "INSERT INTO BookEvents ("+
                "title,"+
                "description,"+
                "choice1,"+
                "choice2,"+
                "outcome1,"+
                "outcome2"+
            ") "+
            "VALUES ("+
                "'The Sky is Falling',"+
                "'Is it?',"+
                "'Maybe.',"+
                "'No.',"+
                "'Ridiculous.',"+
                "'Well, it is. So there.'"+
            ")"
    , err);

    db.run(
            "INSERT INTO BookEntries "+
            "VALUES ("+
                "0,"+
                "2,"+
                "1,"+
                "0,"+
                "0"+
            ")"
    , err);

    db.run(
            "INSERT INTO BookEntries "+
            "VALUES ("+
                "1,"+
                "2,"+
                "1,"+
                "0,"+
                "0"+
            ")"
    , err);

    db.run(
            "INSERT INTO BookEntries "+
            "VALUES ("+
                "2,"+
                "2,"+
                "1,"+
                "0,"+
                "0"+
            ")"
    , err);

    db.run(
            "INSERT INTO BookEntries "+
            "VALUES ("+
                "3,"+
                "2,"+
                "1,"+
                "0,"+
                "0"+
            ")"
    , err);

    db.close();
}

function err(e) { if (e) throw e; }