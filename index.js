const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())

const connection = mysql.createConnection(process.env.DATABASE_URL)

app.get('/', (req, res) => {
    res.send('Hello world!!')
})

// ดึงข้อมูลทั้งหมดจากตาราง list
app.get('/list', (req, res) => {
    connection.query(
        'SELECT * FROM `tasks`',
        function (err, results, fields) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(results);
            }
        }
    )
})

// ดึงข้อมูลราย item จากตาราง tasks ด้วย id
app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    connection.query(
        'SELECT * FROM `tasks` WHERE id = ?', [id],
        function (err, results, fields) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(results);
            }
        }
    )
})

// เพิ่มข้อมูลลงในตาราง tasks
app.post('/tasks', (req, res) => {
    connection.query(
        'INSERT INTO `tasks` (`name`, `date`, `status`) VALUES (?, ?, ?)',
        [req.body.name, req.body.date, req.body.status],
         function (err, results, fields) {
            if (err) {
                console.error('Error in POST /tasks:', err);
                res.status(500).send('Error adding item');
            } else {
                res.status(200).send(results);
            }
        }
    )
})

// อัปเดตข้อมูลในตาราง tasks
app.put('/tasks/:id', (req, res) => {
    connection.query(
        'UPDATE `tasks` SET `name`=?, `date`=?, `status`=? WHERE id =?',
        [req.body.name, req.body.date, req.body.status, req.params.id],
         function (err, results, fields) {
            if (err) {
                console.error('Error in PUT /tasks/:id:', err);
                res.status(500).send('Error updating item');
            } else {
                res.send(results);
            }
        }
    )
})

// ลบข้อมูลออกจากตาราง tasks
app.delete('/tasks/:id', (req, res) => {
    connection.query(
        'DELETE FROM `tasks` WHERE id =?',
        [req.params.id],
         function (err, results, fields) {
            if (err) {
                console.error('Error in DELETE /tasks/:id:', err);
                res.status(500).send('Error deleting item');
            } else {
                res.send(results);
            }
        }
    )
})

app.listen(process.env.PORT || 3000, () => {
    console.log('CORS-enabled web server listening on port 3000')
})

// export the app for vercel serverless functions
module.exports = app;