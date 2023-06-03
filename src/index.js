//База Данных (БД)
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const app = express()
const db = new sqlite3.Database('database.db')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static(path.join(__dirname, 'public')))

//Получение списка услуг
app.get('/api/services', (req, res) => {
  db.all('SELECT * FROM services', (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

//Получение списка кабинетов
app.get('/api/cabinets', (req, res) => {
  db.all('SELECT * FROM cabinets', (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

//Получение списка забронированных дат для определенного типа услуги
app.get('/api/booked-dates/:serviceType', async (req, res) => {
  try {
    const serviceType = req.params.serviceType
    // Здесь можно выполнить запрос к базе данных для получения забронированных дат
    const bookedDates = await getBookedDates(serviceType)
    res.json(bookedDates)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка при получении забронированных дат.' })
  }
})

//Бронирование даты и времени
app.post('/api/book', async (req, res) => {
  try {
    const { cabinet, serviceType, date, time, username, phone } = req.body
    const isBooked = await isDateBooked(cabinet, serviceType, date, time)
    if (!isBooked) {
      await bookDateAndTime(cabinet, serviceType, date, time, username, phone)
      res.json({ message: 'Успешное бронирование.' })
    } else throw new Error()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка при бронировании даты и времени.' })
  }
})

//Подписка на email
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body
  const stmt = db.prepare('INSERT INTO subscriptions (email) VALUES (?)')
  stmt.run([email], (err) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({ message: 'Successfully subscribed' })
  })
})

async function isDateBooked (cabinetId, serviceType, date, time) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM bookings WHERE cabinet_id = ? AND service_type = ? AND date = ? AND time = ?', [cabinetId, serviceType, date, time], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows.length > 0)
      }
    })
  })
}

async function getBookedDates (serviceType) {
  return new Promise((resolve, reject) => {
    db.all('SELECT cabinet_id, date, time FROM bookings WHERE service_type = ?', [serviceType], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

async function bookDateAndTime (cabinet, serviceType, date, time, username, phone) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO bookings (cabinet_id, service_type, date, time, username, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [cabinet, serviceType, date, time, username, phone],
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

//Сервер
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
