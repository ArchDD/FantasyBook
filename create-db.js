"use strict";
var sql = require("sqlite3").verbose();
var db = new sql.Database("westory.db");
db.serialize(startup);

function startup() {
        db.run(
        "CREATE TABLE IF NOT EXISTS Users                           \
        (                                                           \
            u_id INT NOT NULL PRIMARY KEY,                          \
            username VARCHAR(32) NOT NULL,                          \
            password VARCHAR(32) NOT NULL,                          \
            email VARCHAR(64) NOT NULL                              \
        )"
    , err);

    // Character table: IDs, Info, Appearance
    db.run(
        "CREATE TABLE IF NOT EXISTS Character                       \
        (                                                           \
            c_id INT NOT NULL PRIMARY KEY,                          \
            u_id INT NOT NULL,                                      \
            name VARCHAR(64) NOT NULL,                            \
            hair_type INT NOT NULL,                                 \
            nose_type INT NOT NULL,                                 \
            lash_type INT NOT NULL,                                 \
            brow_type INT NOT NULL,                                 \
            socket_type INT NOT NULL,                               \
            pupil_type INT NOT NULL,                                \
            mouth_type INT NOT NULL,                                \
            cheek_type INT NOT NULL,                                \
            ear_type INT NOT NULL,                                  \
            chin_type INT NOT NULL,                                 \
            head_type INT NOT NULL,                                 \
            neck_type INT NOT NULL,                                 \
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
            b_id INT NOT NULL PRIMARY KEY,                          \
            u_id INT NOT NULL,                                      \
            name VARCHAR(64) NOT NULL,                              \
            FOREIGN KEY(u_id) REFERENCES Users(u_id)                \
        )"
    , err);

    // Possibly character status per book?

    // List of entries of a book : IDs, Info
    db.run(
        "CREATE TABLE IF NOT EXISTS BookEntries                     \
        (                                                           \
            e_id INT NOT NULL PRIMARY KEY,                          \
            b_id INT NOT NULL,                                      \
            title VARCHAR(32) NOT NULL,                             \
            description VARCHAR(255) NOT NULL,                      \
            FOREIGN KEY(b_id) REFERENCES Users(b_id)                \
        )"
    , err);


    db.close();
}

function err(e) { if (e) throw e; }