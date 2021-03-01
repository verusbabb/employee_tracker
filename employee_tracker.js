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

const viewEmployees = () => {
    console.log('Selecting all employees...\n');
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;

        console.table(res);
        connection.end();
    });
};

const viewDepartments = () => {
    console.log('Selecting all departments...\n');
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        console.table(res);
        viewRoles();
        // connection.end();
    });
};

const viewRoles = () => {
    console.log('Selecting all roles...\n');
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;

        console.table(res);
        viewEmployees();
        // connection.end();
    });
};

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    viewDepartments();

});

