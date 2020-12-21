const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;
const app = express();

app.use(bodyParser.json());


// MySql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    // password: 'my-secret-pw',
    database: 'COMPANY_DB',  
});

// Route
app.get('/', (req,res)=>{
    res.send('Welcome ahora sí')
})
 // All customers
app.get('/workers', (req, res)=>{
    const sql = 'SELECT * FROM WORKERS'
    connection.query(sql, (error, results)=>{
        if(error) throw error;
        if(results.length > 0){
            res.json(results);
        }else {
            res.send('Not result available');
        }
    })
});

app.get('/workers/:id', (req, res)=>{
    const {id } = req.params
    const sql = `SELECT * FROM WORKERS WHERE ID= ${id}`
    connection.query(sql, (error, result)=>{
        if(error) throw error;
        if(result.length > 0){
            res.json(result);
        }else {
            res.send('Not result available with the id requested');
        }
    })
});

app.post('/add', (req, res)=>{
    const sql = 'INSERT INTO WORKERS SET ?'
    const worker= {
        ID: req.body.ID,
        NOMBRE : req.body.NOMBRE,
        FECHA_INGRESO: req.body.FECHA_INGRESO
    }
    connection.query(sql, worker, error =>{
        if(error) throw error;
        res.send('Worker created');
    });
});

app.put('/update/:id', (req, res)=>{
    const {id } = req.params;
    const {NOMBRE, FECHA_INGRESO} = req.body;
    const sql = `UPDATE WORKERS SET NOMBRE = '${NOMBRE}', FECHA_INGRESO='${FECHA_INGRESO}',
    ID= ${ id} WHERE ID= ${ id}`;
    connection.query(sql, error =>{
        if(error) throw error;
        res.send('Worker updated');
    });
});

app.delete('/delete/:id', (req,res)=>{
    const {id}= req.params;
    const sql = `DELETE FROM WORKERS WHERE ID= ${id}`;
    connection.query(sql, error =>{
        if(error) throw error;
        res.send('Worker deleted');
    });
});

// Check connect
connection.connect(error =>{
    if (error) throw error;
    console.log('Database server running')
});

app.listen(PORT, ()=>{console.log(`Server running on port${PORT}`)})
