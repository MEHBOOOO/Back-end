//SQLite
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('database.db')

db.serialize(() => {
  db.run('CREATE TABLE services (id INTEGER PRIMARY KEY, title TEXT, image TEXT, type TEXT)')

  db.run('INSERT INTO services (title, image, type) VALUES (?, ?, ?)', [
    'Бронирование Open Rooms',
    '/static/images/openrooms.jpg',
    'open_rooms'
  ])

  db.run('INSERT INTO services (title, image, type) VALUES (?, ?, ?)', [
    'Бронирование Кабинетов/аудиторий',
    '/static/images/cabinets.jpg',
    'cabinet'
  ])

  db.run('CREATE TABLE cabinets (id INTEGER PRIMARY KEY, type TEXT, floor INTEGER, number INTEGER)')

  for (let i = 1; i <= 5; i++) {
    db.run('INSERT INTO cabinets (type, floor, number) VALUES (?, ?, ?)', ['open_rooms', 1, i])
  }

  for (let floor = 1; floor <= 4; floor++) {
    for (let number = 1; number <= 40; number++) {
      db.run('INSERT INTO cabinets (type, floor, number) VALUES (?, ?, ?)', ['cabinet', floor, number])
    }
  }

  db.run(`
    CREATE TABLE bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cabinet_id INTEGER,
      service_type TEXT,
      date TEXT,
      time TEXT,
      username TEXT,
      phone TEXT
    )
  `)

  db.run('CREATE TABLE subscriptions (id INTEGER PRIMARY KEY, email TEXT UNIQUE)', () => {
    console.log('База данных успешно инициализирована!')
  })
})
