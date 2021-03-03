const cTable = require('console.table');
const inquirer = require('inquirer');
//NOT YET FUNCTIONAL
const viewEmployees = (connection) => {
    console.log('Selecting all employees...\n');
    const query = 'SELECT first_name, last_name, title, manager_name, department_name, salary FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = employee.department_id ORDER BY salary DESC';
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        connection.end();
    })
};


const viewEmployeesByDepartment = (connection) => {
    console.log('Selecting all employees by departments...\n');
    const query = 'SELECT first_name, last_name, title, manager_name, department_name FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = employee.department_id ORDER BY department_name';
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        // viewRoles(connection);
        // connection.end();
    });
};

const viewEmployeesByManager = (connection) => {
    const query = 'SELECT manager_name FROM employee INNER JOIN role ON role.id = employee.role_id GROUP BY manager_name';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);

        inquirer
            .prompt({
                name: 'action',
                type: 'rawlist',
                choices() {
                    const managerArray = [];
                    res.forEach((item) => {
                        managerArray.push(item.manager_name)
                    })
                    return managerArray;
                },

                message: 'For which manager do you want to see employees?',
            })

            .then((answer) => {
                const query = "SELECT first_name, last_name, title, manager_name, department_name, salary FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = employee.department_id WHERE manager_name = ?";

                console.log(answer.action);

                connection.query(query, answer.action, (err, res) => {
                    if (err) throw err;
                    console.log('Selecting all employees by manager...\n');
                    console.table(res);
                    connection.end();
                })
            });
    });
};


module.exports = { viewEmployees, viewEmployeesByDepartment, viewEmployeesByManager };