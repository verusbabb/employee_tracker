const cTable = require('console.table');
const inquirer = require('inquirer');
const Department = require('../lib/department');
const Role = require('../lib/role');
const Employee = require('../lib/employee');

//build and display table of employees
const viewEmployees = (connection) => {
    console.log('Selecting all employees...\n');
    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager ";
    query +=
        'FROM employee ';
    query +=
        'INNER JOIN role on role.id = employee.role_id ';
    query +=
        'INNER JOIN department on department.id = role.department_id ';
    query +=
        'LEFT JOIN employee e on employee.manager_id = e.id ';
    query +=
        'ORDER BY employee.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\nHere is a list of all employees\n');
        console.table(res);
        // connection.end();
    })
};

//build and display all departments and employees within
const viewDepartments = (connection) => {
    let query = 'SELECT department.department_name AS Department, employee.first_name, employee.last_name ';
    query +=
        'FROM employee JOIN role ON employee.role_id = role.id ';
    query +=
        'JOIN department ON role.department_id = department.id';

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\nHere is a list of all company departments\n')
        console.table(res);
        // connection.end();
    })
}

//build and display table with employees showing title
const viewRoles = (connection) => {
    let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title AS Title ';
    query +=
        'FROM employee ';
    query +=
        'JOIN role ON employee.role_id = role.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\nHere is a list of all roles in the company\n')
        console.table(res);
        // connection.end();
    })
}

//build and display a table of employees sorted by department
const viewEmployeesByDepartment = (connection) => {
    console.log('Selecting all employees by departments...\n');
    let query = 'SELECT first_name, last_name, title, department_name ';
    query +=
        'FROM employee ';
    query +=
        'INNER JOIN role ON role.id = employee.role_id ';
    query +=
        'INNER JOIN department ON department.id = employee.department_id ';
    query +=
        'ORDER BY department_name';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\nHere is a list of all employees organized by department\n')
        console.table(res);
        // connection.end();
    });
};

//build and display a table of employees for a given manager
const viewEmployeesByManager = (connection) => {
    let query = "SELECT employee.manager_id, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager ";
    query +=
        'FROM employee ';
    query +=
        'INNER JOIN role on role.id = employee.role_id ';
    query +=
        'INNER JOIN department on department.id = role.department_id ';
    query +=
        'LEFT JOIN employee e on employee.manager_id = e.id ';
    query +=
        'GROUP BY employee.manager_id';
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
                let query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee ";
                query +=
                    'INNER JOIN role on role.id = employee.role_id ';
                query +=
                    'INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id ';
                query +=
                    'WHERE employee.manager_id = ?';

                connection.query(query, answer.action, (err, res) => {
                    if (err) throw err;
                    console.log('\nShowing all employees for selected manager...\n');
                    console.table(res);

                })
            });
    });
};

//create a new department
const addDepartment = (connection) => {
    inquirer
        .prompt({
            name: 'newDepartmentName',
            type: 'input',
            message: 'What is the name of the NEW department you want to add?',
        })
        .then((answer) => {
            let newDepartment = new Department(answer.newDepartmentName)
            console.log(newDepartment.name);
            connection.query(
                'INSERT INTO department (department_name) VALUES (?)', newDepartment.name,
                (err) => {
                    if (err) throw err;
                    console.log('\nYour new department was created successfully!\n');
                    // re-prompt the user for if they want to bid or post
                    listDepartments(connection);
                }
            );
        });
};

//list all departments
const listDepartments = (connection) => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.log('\nHere is a list of all department\n');
        console.table(res);
    });
};

//list all roles, including id, title, and salary
const listRoles = (connection) => {
    connection.query('SELECT id, title, salary FROM role', (err, res) => {
        if (err) throw err;
        console.log('\nHere are the current roles in the company\n');
        console.table(res);

    });
};

//add a new role to company
const addRole = (connection) => {
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: "What is the title of the NEW role you want to create?"
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
                message: 'Enter the ID# of the department you would like this role to be in?'
            }
        ])
        .then((answer) => {
            let newRole = new Role(answer.title, answer.salary, answer.department)
            console.log(newRole.title, newRole.salary, newRole.department);
            const query = 'INSERT INTO role SET ?';

            connection.query(query, {
                title: newRole.title,
                salary: newRole.salary,
                department_id: newRole.department
            },
                (err, res) => {
                    if (err) throw err;

                    console.log('\nYour new role was created successfully!\n');
                    console.table(res);
                    // re-prompt the user for if they want to bid or post
                    listRoles(connection);
                }
            );
        });
};

//update an employee's role
const updateRole = (connection) => {
    inquirer
        .prompt([
            {
                name: 'employee',
                type: 'number',
                choices() { viewEmployees(connection) },
                message: 'Enter the ID# of the employee whose role you wish to update\n'
            },
            {
                name: 'updatedRole',
                type: 'number',
                choices() { listRoles(connection) },
                message: 'Enter the ID# of the role you would like to assign this employee to\n'
            },
            {
                name: 'updatedManager',
                type: 'number',
                choices() { viewEmployees(connection) },
                message: 'Enter the name of the new manager\n'
            },
        ])
        .then((answer) => {
            const query = 'UPDATE employee SET ? WHERE ?';
            connection.query(query,
                [{
                    role_id: answer.updatedRole,
                    manager_id: answer.updatedManager
                },
                {
                    id: answer.employee
                }],
                (err, res) => {
                    if (err) throw err;

                    console.log("\nThe employee's role has been updated!\n");
                    console.table(res);
                    viewEmployees(connection);
                }
            );
        });
}

module.exports = { viewEmployees, viewDepartments, viewRoles, viewEmployeesByDepartment, viewEmployeesByManager, addDepartment, addRole, listDepartments, updateRole };