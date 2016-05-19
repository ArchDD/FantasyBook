"use strict";
var sql = require("sqlite3").verbose();
var db = new sql.Database("westory.db");
db.serialize(startup);

function startup() {
        db.run(
        "CREATE TABLE IF NOT EXISTS Users                           \
        (                                                           \
            u_id INTEGER PRIMARY KEY AUTOINCREMENT,                 \
            username VARCHAR(32) NOT NULL,                          \
            password VARCHAR(32) NOT NULL,                          \
            email VARCHAR(64)                                       \
        )"
    , err);

    // Character table: IDs, Info, Appearance
    db.run(
        "CREATE TABLE IF NOT EXISTS Character                       \
        (                                                           \
            c_id INTEGER PRIMARY KEY AUTOINCREMENT,                 \
            u_id INTEGER NOT NULL,                                  \
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
            FOREIGN KEY(u_id) REFERENCES Users(u_id)                \
        )"
    , err);

    // Books owned by user : IDs, Info
    db.run(
        "CREATE TABLE IF NOT EXISTS Books                           \
        (                                                           \
            b_id INTEGER PRIMARY KEY AUTOINCREMENT,                 \
            u_id INTEGER NOT NULL,                                  \
            name VARCHAR(64) NOT NULL,                              \
            FOREIGN KEY(u_id) REFERENCES Users(u_id)                \
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

    // Default user
    db.run("INSERT INTO Users (username, password, email) VALUES ('Admin','COMS32500', '')", err);

    db.close();
}

function err(e) { if (e) throw e; }