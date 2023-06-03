-- TABLE
CREATE TABLE bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cabinet_id INTEGER,
      service_type TEXT,
      date TEXT,
      time TEXT,
      username TEXT,
      phone TEXT
    );
CREATE TABLE cabinets (id INTEGER PRIMARY KEY, type TEXT, floor INTEGER, number INTEGER);
CREATE TABLE services (id INTEGER PRIMARY KEY, title TEXT, image TEXT, type TEXT);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE subscriptions (id INTEGER PRIMARY KEY, email TEXT UNIQUE);
 
-- INDEX
 
-- TRIGGER
 
-- VIEW
 
