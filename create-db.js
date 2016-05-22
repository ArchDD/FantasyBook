"use strict";
var sql = require("sqlite3").verbose();
var db = new sql.Database("westory.db");
db.serialize(startup);

function startup() {
    db.run(
        "PRAGMA foreign_keys = ON"
    , err);

    db.run(
        "CREATE TABLE IF NOT EXISTS Users                           \
        (                                                           \
            username VARCHAR(32) PRIMARY KEY NOT NULL,              \
            password VARCHAR(32) NOT NULL,                          \
            email VARCHAR(64)                                       \
        )"
    , err);

    db.run(
        "CREATE TABLE IF NOT EXISTS Sessions                        \
        (                                                           \
            secret VARCHAR(64) PRIMARY KEY NOT NULL,                \
            username VARCHAR(32) NOT NULL,                          \
            date INTEGER NOT NULL,                                  \
            FOREIGN KEY(username) REFERENCES Users(username)        \
        )"
    , err);

    // Character table: IDs, Info, Appearance
    db.run(
        "CREATE TABLE IF NOT EXISTS Characters                      \
        (                                                           \
            c_id INTEGER PRIMARY KEY AUTOINCREMENT,                 \
            username VARCHAR(32) NOT NULL,                          \
            name VARCHAR(64) NOT NULL,                              \
            hair_type INTEGER NOT NULL,                             \
            eye_type INTEGER NOT NULL,                              \
            nose_type INTEGER NOT NULL,                             \
            mouth_type INTEGER NOT NULL,                            \
            head_type INTEGER NOT NULL,                             \
            hair_tint VARCHAR(6) NOT NULL,                          \
            skin_tint VARCHAR(6) NOT NULL,                          \
            eye_tint VARCHAR(6) NOT NULL,                           \
            mouth_tint VARCHAR(6) NOT NULL,                         \
            FOREIGN KEY(username) REFERENCES Users(username)        \
        )"
    , err);

    // Books owned by user : IDs, Info
    db.run(
        "CREATE TABLE IF NOT EXISTS Books                           \
        (                                                           \
            b_id INTEGER PRIMARY KEY AUTOINCREMENT,                 \
            username VARCHAR(32) NOT NULL,                          \
            name VARCHAR(64) NOT NULL,                              \
            desc VARCHAR(128) NOT NULL,                             \
            pages INTEGER NOT NULL,                                 \
            colour CHAR(7) NOT NULL,                                \
            theme VARCHAR(32) NOT NULL,                             \
            texture VARCHAR(32) NOT NULL,                           \
            FOREIGN KEY(username) REFERENCES Users(username)        \
        )"
    , err);

    // Possibly character status per book?

    db.run(
        "CREATE TABLE IF NOT EXISTS BookContributors                \
        (                                                           \
            b_id INTEGER NOT NULL,                                  \
            username VARCHAR(32) NOT NULL,                          \
            FOREIGN KEY(b_id) REFERENCES Books(b_id),               \
            FOREIGN KEY(username) REFERENCES Users(username)        \
            PRIMARY KEY(b_id,username)                              \
        )"
    , err);

    db.run(
        "CREATE TABLE IF NOT EXISTS BookEntries                     \
        (                                                           \
            b_id INTEGER NOT NULL,                                  \
            page_id INTEGER NOT NULL,                               \
            e_id INTEGER NOT NULL,                                  \
            choice_id INTEGER,                                      \
            is_completed INTEGER NOT NULL,                          \
            FOREIGN KEY(b_id) REFERENCES Books(b_id),               \
            FOREIGN KEY(e_id) REFERENCES BookEvents(e_id),          \
            PRIMARY KEY(b_id,page_id)                               \
        )"
    , err);

    db.run(
        "CREATE TABLE IF NOT EXISTS BookEvents                      \
        (                                                           \
            e_id INTEGER PRIMARY KEY AUTOINCREMENT,                 \
            theme VARCHAR(32) NOT NULL,                             \
            title VARCHAR(32) NOT NULL,                             \
            description VARCHAR(255) NOT NULL,                      \
            choice1 VARCHAR(255) NOT NULL,                          \
            choice2 VARCHAR(255) NOT NULL,                          \
            outcome1 VARCHAR(255) NOT NULL,                         \
            outcome2 VARCHAR(255) NOT NULL                          \
        )"
    , err);

db.run(
            "INSERT INTO BookEvents ("+
                "theme,"+
                "title,"+
                "description,"+
                "choice1,"+
                "choice2,"+
                "outcome1,"+
                "outcome2"+
            ") "+
            "VALUES ("+
                "'fantasy',"+
                "'Dragons on the Horizon!',"+
                "'A scout up ahead spotted a dragon!',"+
                "'Prepare to shoot.',"+
                "'Attempt to go around.',"+
                "'You order your men to prepare their bows.',"+
                "'You try to go around but stumble upon its nest!'"+
            ")"
    , err);

    db.run(
            "INSERT INTO BookEvents ("+
                "theme,"+
                "title,"+
                "description,"+
                "choice1,"+
                "choice2,"+
                "outcome1,"+
                "outcome2"+
            ") "+
            "VALUES ("+
                "'science-fiction',"+
                "'Warp drive busted!',"+
                "'The ship stalled while exploring a new star system. ',"+
                "'Broadcast for help.',"+
                "'Attempt to fix it yourself.',"+
                "'You broadcasted for help and it was heard loud and clear."+
                " By aliens. They are now circling the ship.',"+
                "'You tried to fix it yourself, however perhaps that was not the best idea. The engine is now on fire."+
                " Do you even know how spaceship engines work?'"+
            ")"
    , err);

    db.run(
            "INSERT INTO BookEvents ("+
                "theme,"+
                "title,"+
                "description,"+
                "choice1,"+
                "choice2,"+
                "outcome1,"+
                "outcome2"+
            ") "+
            "VALUES ("+
                "'murder-mystery',"+
                "'A Murder in the Dining Room!',"+
                "'Lying on the table, a letter in one hand and a key in the other. Dead.',"+
                "'Read the letter.',"+
                "'Walk away. Not anyone you knew afterall.',"+
                "'You decide to read the letter. However, as you do so, you have a niggling feeling that you forgot something."+
                " Ah yes, you forgot to check if the murderer was still in the room..',"+
                "'You decide to leave. Unfortunately as you are leaving the house, the police arrive. They saw you attempting to leave the scene of the crime."+
                " You are arrested.'"+
            ")"
    , err);

    db.run(
            "INSERT INTO BookEvents ("+
                "theme,"+
                "title,"+
                "description,"+
                "choice1,"+
                "choice2,"+
                "outcome1,"+
                "outcome2"+
            ") "+
            "VALUES ("+
                "'nonsense',"+
                "'The Sky is Falling',"+
                "'Top scientists said that the sky is falling at an alarming rate.',"+
                "'Maybe it is.',"+
                "'No it is not.',"+
                "'You are open to the idea. What is a sky anyway?',"+
                "'You rejected that the sky may be falling. But perhaps it is. We will never know.'"+
            ")"
    , err);

    db.run(
            "INSERT INTO Users VALUES "+
            "("+
                "'guest',"+
                "'Guest1',"+
                "'guest@guest'"+
            ")"
    , err);

    db.close();
}

function err(e) { if (e) throw e; }