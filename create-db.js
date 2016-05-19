"use strict";
var sql = require("sqlite3").verbose();
var db = new sql.Database("westory.db");
db.serialize(startup);

function startup() {
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
            date VARCHAR(128) NOT NULL,                             \
            FOREIGN KEY(username) REFERENCES Users(username)        \
        )"
    , err);

    // Character table: IDs, Info, Appearance
    db.run(
        "CREATE TABLE IF NOT EXISTS Character                       \
        (                                                           \
            c_id INTEGER PRIMARY KEY AUTOINCREMENT,                 \
            username INTEGER NOT NULL,                              \
            name VARCHAR(64) NOT NULL,                              \
            hair_type INTEGER NOT NULL,                             \
            nose_type INTEGER NOT NULL,                             \
            lash_type INTEGER NOT NULL,                             \
            brow_type INTEGER NOT NULL,                             \
            socket_type INTEGER NOT NULL,                           \
            pupil_type INTEGER NOT NULL,                            \
            mouth_type INTEGER NOT NULL,                            \
            cheek_type INTEGER NOT NULL,                            \
            ear_type INTEGER NOT NULL,                              \
            chin_type INTEGER NOT NULL,                             \
            head_type INTEGER NOT NULL,                             \
            neck_type INTEGER NOT NULL,                             \
            hair_colour VARCHAR(6) NOT NULL,                        \
            skin_colour VARCHAR(6) NOT NULL,                        \
            pupil_colour VARCHAR(6) NOT NULL,                       \
            FOREIGN KEY(username) REFERENCES Users(username)        \
        )"
    , err);

    // Books owned by user : IDs, Info
    db.run(
        "CREATE TABLE IF NOT EXISTS Books                           \
        (                                                           \
            b_id INTEGER PRIMARY KEY AUTOINCREMENT,                 \
            username INTEGER NOT NULL,                              \
            name VARCHAR(64) NOT NULL,                              \
            FOREIGN KEY(username) REFERENCES Users(username)        \
        )"
    , err);

    // Possibly character status per book?

    // List of entries of a book : IDs, Info
    db.run(
        "CREATE TABLE IF NOT EXISTS BookEntries                     \
        (                                                           \
            e_id INTEGER PRIMARY KEY AUTOINCREMENT,                 \
            b_id INTEGER NOT NULL,                                  \
            title VARCHAR(32) NOT NULL,                             \
            description VARCHAR(255) NOT NULL,                      \
            FOREIGN KEY(b_id) REFERENCES Users(b_id)                \
        )"
    , err);

    db.close();
}

function err(e) { if (e) throw e; }