const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./parkease.db")

db.serialize(() => {

db.run(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
fullName TEXT,
email TEXT UNIQUE,
phone TEXT,
password TEXT,
role TEXT
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS services (
id INTEGER PRIMARY KEY AUTOINCREMENT,
service TEXT,
name TEXT,
identifier TEXT,
phone TEXT,
amount REAL,
receipt TEXT,
date TEXT,
userEmail TEXT
)
`)

})

module.exports = db

