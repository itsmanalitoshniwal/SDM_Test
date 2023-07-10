const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sdmdac',
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');
});

// GET - Display All employees using e_name
app.get('/employees', (req, res) => {
  const eName = req.query.ename;
  const query = `SELECT * FROM Employee_tb WHERE ename LIKE '%${eName}%'`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing the query: ', err);
      res.status(500).json({ error: 'Error executing the query' });
      return;
    }
    res.json(results);
  });
});

// POST - ADD Employee data into MySQL table
app.post('/employees', (req, res) => {
  const employee = req.body;

  const query = 'INSERT INTO Employee_tb SET ?';

  connection.query(query, employee, (err, result) => {
    if (err) {
      console.error('Error executing the query: ', err);
      res.status(500).json({ error: 'Error executing the query' });
      return;
    }
    res.json({ message: 'Employee added successfully' });
  });
});

// DELETE - Delete Employee from table by doj
app.delete('/employees/:doj', (req, res) => {
  const doj = req.params.doj;
  const query = `DELETE FROM Employee_tb WHERE doj = ?`;

  connection.query(query, doj, (err, result) => {
    if (err) {
      console.error('Error executing the query: ', err);
      res.status(500).json({ error: 'Error executing the query' });
      return;
    }
    res.json({ message: 'Employee deleted successfully' });
  });
});

// PUT - Update dname and doj
app.put('/employees/:id', (req, res) => {
  const id = req.params.id;
  const { dname, doj } = req.body;

  const query = `UPDATE Employee_tb SET dname = ?, doj = ? WHERE id = ?`;

  connection.query(query, [dname, doj, id], (err, result) => {
    if (err) {
      console.error('Error executing the query: ', err);
      res.status(500).json({ error: 'Error executing the query' });
      return;
    }
    res.json({ message: 'Employee updated successfully' });
  });
});

// Start the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
