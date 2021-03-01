const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
// const queriesSQL = require('./dbQueries/queriesSQL');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'MySQL#4355',
    database: 'employee_trackerDB',
});

const readEmployees = () => {
    console.log('Selecting all employees...\n');
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;

        console.table(res);
        connection.end();
    });
};

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    readEmployees();

});

