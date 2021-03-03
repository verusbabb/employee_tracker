const cTable = require('console.table');
const inquirer = require('inquirer');
const Department = require('../lib/department');
const Role = require('../lib/role');

//build and display table of employees
const viewEmployees = (connection) => {
    console.log('Selecting all employees...\n');
    const query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        connection.end();
    })
};

const viewDepartments = (connection) => {
    const query = "SELECT employee.first_name, employee.last_name, department.department_name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        connection.end();
    })
}

const viewRoles = (connection) => {
    const query = "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        // connection.end();
    })
}

//build and display a table of employees sorted by department
const viewEmployeesByDepartment = (connection) => {
    console.log('Selecting all employees by departments...\n');
    const query = 'SELECT first_name, last_name, title, department_name FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = employee.department_id ORDER BY department_name';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // connection.end();
    });
};

//build and display a table of employees for a given manager
const viewEmployeesByManager = (connection) => {
    const query = "SELECT employee.manager_id, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id GROUP BY employee.manager_id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log(res[i].manager_id, res[i].Manager);
        };
        inquirer
            .prompt({
                name: 'action',
                type: 'number',
                choices() {
                    const managerArray = [];
                    res.forEach((item) => {
                        managerArray.push(item.manager_id, item.Manager);
                    })
                    return managerArray
                },
                message: 'Choose a manager by their number (** enter manager NUMBER **)?',
            })
            .then((answer) => {
                const query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id WHERE employee.manager_id = ?";

                connection.query(query, answer.action, (err, res) => {
                    if (err) throw err;
                    console.log('\nShowing all employees for selected manager...\n');
                    console.table(res);
                    connection.end();
                })
            });
    });
};

const addDepartment = (connection) => {
    inquirer
        .prompt({
            name: 'newDepartmentName',
            type: 'input',
            message: 'What is the name of the NEW department the company should waste money on?',
        })
        .then((answer) => {
            let newDepartment = new Department(answer.newDepartmentName)
            console.log(newDepartment.name);
            connection.query(
                'INSERT INTO department (department_name) VALUES (?)', newDepartment.name,
                (err) => {
                    if (err) throw err;
                    console.log('Your new department was created successfully!');
                    // re-prompt the user for if they want to bid or post
                    listDepartments(connection);
                }
            );
        });
};

const listDepartments = (connection) => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.log('Here is an updated department list!');
        console.table(res);

    });
};

const addRole = (connection) => {
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: "What is the title of the NEW role that the company probably doesn't need?"
            },
            {
                name: 'salary',
                type: 'number',
                message: 'What is the salary for this new role?'
            },
            {
                name: 'department',
                type: 'number',
                choices() { listDepartments(connection) },
            }
        ])
        .then((answer) => {
            let newRole = new Role(answer.title, answer.salary, answer.department)
            console.log(newRole.title, newRole.salary, newRole.department);
            // const query = 'INSERT INTO role (title, salary, department_id) VALUES ?';

            // connection.query(query, [newRole.title, newRole.salary, newRole.department],
            //     (err, res) => {
            //         if (err) throw err;

            //         console.log('Your new role was created successfully!');
            //         console.table(res);
            //         // re-prompt the user for if they want to bid or post
            //         viewRoles(connection);
            //     }
            // );
        });
};

const listRoles = (connection) => {
    connection.query('SELECT title FROM role', (err, res) => {
        if (err) throw err;
        console.log('These are now the company departments');
        console.table(res);
        connection.end()
    });
};

module.exports = { viewEmployees, viewDepartments, viewRoles, viewEmployeesByDepartment, viewEmployeesByManager, addDepartment, addRole, listRoles, listDepartments };