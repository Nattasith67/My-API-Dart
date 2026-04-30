const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())

const pool = mysql.createPool(process.env.DATABASE_URL);

// ดึงข้อมูลทั้งหมดจากตาราง list
app.get('/list', (req, res) => {
    pool.query(
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
    pool.query(
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
app.post('/list', (req, res) => {
    pool.query(
        'INSERT INTO `tasks` (`name`, `taskdate`, `status`, createDate) VALUES (?, ?, ?, NOW())',
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
    pool.query(
        'UPDATE `tasks` SET `name`= ?, `taskdate`= ?, `status`= ?, createDate = NOW() WHERE id =?',
        [req.body.name, req.body.taskdate, req.body.status, req.params.id],
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
app.delete('/list/:id', (req, res) => {
    pool.query(
        'DELETE FROM `tasks` WHERE id =?',
        [req.params.id],
         function (err, results, fields) {
            if (err) {
                console.error('Error in DELETE /list/:id:', err);
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