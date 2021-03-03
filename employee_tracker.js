const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const queriesSQL = require('./dbQueries/queriesSQL');

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
                'View all employees by department',
                'View all employees by manager?',
                'Add an employee',
                'Remove an employee',
                'Udate an employee',
                'Update an employee role',
                'Update an employee manager'
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all employees':
                    queriesSQL.viewEmployees(connection);
                    break;

                case 'View all employees by department':
                    queriesSQL.viewEmployeesByDepartment(connection);
                    break;


                case 'View all employees by manager?':
                    queriesSQL.viewEmployeesByManager(connection);
                    break;

                case 'Add an employee':
                    queriesSQL.addEmployee(connection);
                    break;

                case 'Remove an employee':
                    queriesSQL.removeEmployee(connection);
                    break;

                case 'Udate an employee':
                    queriesSQL.updateEmployee(connection);
                    break;

                case 'Update an employee roles':
                    queriesSQL.updateEmployeeRole(connection);
                    break;

                case 'Update an employee manager':
                    queriesSQL.updateEmployeeManager(connection);
                    break;
            }
        });
};

