const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const sqlQueries = require('./dbQueries/sqlQueries');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'MySQL#4355',
    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    runInquiry();

});

const runInquiry = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'View all roles',
                'View all departments',
                'View all employees by select department',
                'View all employees by select manager',
                'Add an employee',
                'Update an employee role',
                'Add a department',
                'Add a role'
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all employees':
                    sqlQueries.viewEmployees(connection);
                    break;

                case 'View all roles':
                    sqlQueries.viewRoles(connection);
                    break;


                case 'View all departments':
                    sqlQueries.viewDepartments(connection);
                    break;

                case 'View all employees by select department':
                    sqlQueries.viewEmployeesByDepartment(connection);
                    break;

                case 'View all employees by select manager':
                    sqlQueries.viewEmployeesByManager(connection);
                    break;

                case 'Add an employee':
                    sqlQueries.addEmployee(connection);
                    break;

                case 'Update an employee role':
                    sqlQueries.updateRole(connection);
                    break;

                case 'Add a department':
                    sqlQueries.addDepartment(connection);
                    break;

                case 'Add a role':
                    sqlQueries.addRole(connection);
                    break;
            }
        });
};

