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
                3,                                  \
                '#2a6f41',                          \
                'leather'                           \
            )"
    , err);

    db.run(
            "INSERT INTO Books VALUES               \
            (                                       \
                1,                                  \
                'guest',                            \
                'Chasing Centaurs',                 \
                '[Theme description]',              \
                3,                                  \
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
                3,                                  \
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
                3,                                  \
                '#4d3960',                          \
                'leather'                           \
            )"
    , err);

    db.close();
}

function err(e) { if (e) throw e; }