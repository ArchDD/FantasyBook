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
            title VARCHAR(32) NOT NULL,                             \
            description VARCHAR(255) NOT NULL,                      \
            choice1 VARCHAR(255) NOT NULL,                          \
            choice2 VARCHAR(255) NOT NULL,                          \
            outcome1 VARCHAR(255) NOT NULL,                         \
            outcome2 VARCHAR(255) NOT NULL                          \
        )"
    , err);

    db.close();
}

function err(e) { if (e) throw e; }