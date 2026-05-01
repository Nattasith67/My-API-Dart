const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())

const pool = mysql.createPool(process.env.DATABASE_URL);

// --- 1. Route สำหรับดึงข้อมูลภาพรวม (Static Routes) ---

// ดึงหมวดหมู่ (ย้ายขึ้นมาแล้ว Log จะทำงานปกติ)
app.get('/list/categories', (req, res) => {
    console.log('Category route hit');
    pool.query(
        'SELECT * FROM `category`',
        function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(results);
            }
        }
    )
})

// นับจำนวนทั้งหมด
app.get('/list/count', (req, res) => {
    pool.query(
        'SELECT COUNT(*) as total FROM `tasks`',
        function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(results);
            }
        }
    )
})

app.get('/list/completedCount', (req, res) => {
    pool.query(
        'SELECT COUNT(*) as total FROM `tasks` WHERE `status` = "Completed"',
        function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(results);
            }
        }
    )
})

app.get('/list/pendingCount', (req, res) => {
    pool.query(
        'SELECT COUNT(*) as total FROM `tasks` WHERE `status` = "pending"',
        function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(results);
            }
        }
    )
})

app.get('/list/pending', (req, res) => {
    pool.query(
        'SELECT * FROM `tasks` WHERE `status` = "pending"',
        function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(results);
            }
        }
    )
})

app.get('/list/completed', (req, res) => {
    pool.query(
        'SELECT * FROM `tasks` WHERE `status` = "Completed"',
        function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(results);
            }
        }
    )
})

// ดึงรายการทั้งหมด
app.get('/list', (req, res) => {
    pool.query(
        'SELECT * FROM `tasks`',
        function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(results);
            }
        }
    )
})

// --- 2. Route สำหรับเพิ่มข้อมูล (POST) ---

app.post('/list/category', (req, res) => {
    pool.query(
        'INSERT INTO `category` (`name`) VALUES (?)',
        [req.body.name],
        function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(results);
            }
        }
    )
})

app.post('/list', (req, res) => {
    pool.query(
        'INSERT INTO `tasks` (`name`, `taskdate`, `status`, `createDate`, `type`) VALUES (?, ?, ?, NOW(), ?)',
        [req.body.name, req.body.date, req.body.status, req.body.type],
        function (err, results) {
            if (err) {
                console.error(err);
                res.status(500).send('Error adding item');
            } else {
                res.status(200).send(results);
            }
        }
    )
})

// --- 3. Route ที่มีการใช้ Parameter (Dynamic Routes) ---
// ** ต้องอยู่ด้านล่าง Static Routes เสมอ **

app.get('/list/:id', (req, res) => {
    const id = req.params.id;
    pool.query(
        'SELECT * FROM `tasks` WHERE id = ?', [id],
        function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(results);
            }
        }
    )
})

app.patch('/list/:id/status', (req, res) => {
    pool.query(
        'UPDATE `tasks` SET `status`= ? WHERE id = ?',
        [req.body.status, req.params.id],
        function (err, results) {
            if (err) {
                console.error(err);
                res.status(500).send('Error updating item');
            } else {
                res.send(results);
            }
        }
    )
})

app.patch('/list/:id', (req, res) => {
    pool.query(
        'UPDATE `tasks` SET `name`= ?, `taskdate`= ?, `status`= ?, `type`= ?, `updateDate` = NOW() WHERE id = ?',
        [req.body.name, req.body.taskdate, req.body.status, req.body.type, req.params.id],
        function (err, results) {
            if (err) {
                console.error(err);
                res.status(500).send('Error updating item');
            } else {
                res.send(results);
            }
        }
    )
})

app.delete('/list/:id', (req, res) => {
    pool.query(
        'DELETE FROM `tasks` WHERE id = ?',
        [req.params.id],
        function (err, results) {
            if (err) {
                console.error(err);
                res.status(500).send('Error deleting item');
            } else {
                res.send(results);
            }
        }
    )
})

app.listen(process.env.PORT || 3000)

module.exports = app;