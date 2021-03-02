const cTable = require('console.table');
//NOT YET FUNCTIONAL
const viewEmployees = (connection) => {
    console.log('Selecting all employees...\n');
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;

        console.table(res);
        connection.end();
    })
};


const viewDepartments = (connection) => {
    console.log('Selecting all departments...\n');
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        console.table(res);
        viewRoles(connection);
        // connection.end();
    });
};

const viewRoles = (connection) => {
    console.log('Selecting all roles...\n');
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;

        console.table(res);
        viewEmployees(connection);
        // connection.end();
    });
};

module.exports = { viewEmployees, viewDepartments, viewRoles };