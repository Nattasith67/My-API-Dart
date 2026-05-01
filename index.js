const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())

const pool = mysql.createPool(process.env.DATABASE_URL);

// Get all tasks
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

// Get total count of tasks
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

app.post('/list', (req, res) => {
    pool.query(
        'INSERT INTO `tasks` (`name`, `taskdate`, `status`, `createDate`, `category`) VALUES (?, ?, ?, NOW(), ?)',
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
        'UPDATE `tasks` SET `name`= ?, `taskdate`= ?, `status`= ?, `category`= ?, `updateDate` = NOW() WHERE id = ?',
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