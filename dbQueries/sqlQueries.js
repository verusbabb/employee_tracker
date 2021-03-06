const cTable = require('console.table');
const inquirer = require('inquirer');
const Department = require('../lib/department');
const Role = require('../lib/role');
const Employee = require('../lib/employee');

const quitApplication = (connection) => {
    connection.end(connection)
}
//build and display table of employees
const viewEmployees = (connection, cb) => {
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
        if (cb) {
            cb()
        }
        // connection.end();
    })
};

const managerChoices = (connection, cb) => {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title ";
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
        if (cb) {
            cb()
        }
        // connection.end();
    })
};

//build and display all departments and employees within
const viewDepartments = (connection, cb) => {
    let query = 'SELECT department.department_name AS Department, employee.first_name, employee.last_name ';
    query +=
        'FROM employee JOIN role ON employee.role_id = role.id ';
    query +=
        'JOIN department ON role.department_id = department.id';

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\nHere is a list of all company departments\n')
        console.table(res);
        if (cb) {
            cb()
        }
        // connection.end();
    })
}

//build and display table with employees showing title
const viewRoles = (connection, cb) => {
    let query = 'SELECT role.title AS Title, employee.id, employee.first_name, employee.last_name ';
    query +=
        'FROM employee ';
    query +=
        'JOIN role ON employee.role_id = role.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\nHere is a list of all roles in the company (and employees in those roles)\n')
        console.table(res);
        if (cb) {
            cb()
        }
        // connection.end();
    })
}

//build and display a table of employees sorted by department
const viewEmployeesByDepartment = (connection, cb) => {
    console.log('Displaying all employees, organized by department...\n');
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
        if (cb) {
            cb()
        }
        // connection.end();
    });
};

//build and display a table of employees for a given manager
const viewEmployeesByManager = (connection, cb) => {
    console.log('\nHere is a list of current managers to choose from\n')
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
                    console.log('\n');
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
                    if (cb) {
                        cb()
                    }

                })
            });
    });
};

//create a new department
const addDepartment = (connection, cb) => {
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
                    listDepartments(connection, cb);
                }
            );
        });
};

//list all departments
const listDepartments = (connection, cb) => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.log('\nHere is a list of all department\n');
        console.table(res);
        if (cb) {
            cb()
        }
    });
};

//list all roles, including id, title, and salary
const listRoles = (connection, cb) => {
    connection.query('SELECT id, title, salary FROM role', (err, res) => {
        if (err) throw err;
        console.log('\nHere are the current roles in the company\n');
        console.table(res);
        if (cb) {
            cb()
        }
    });
};

//add a new role to company
const addRole = (connection, cb) => {
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
                    listRoles(connection, cb);
                    // if (cb) {
                    //     cb()
                    // }
                }
            );
        });
};

//update an employee's role
const updateRole = (connection, cb) => {
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
                choices() { managerChoices(connection) },
                message: 'Enter the id of the employee you want to be their manager\n'
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
                    viewEmployees(connection, cb);
                    if (cb) {
                        cb()
                    }
                }
            );
        });
}

//add a new role to company
const addEmployee = (connection, cb) => {
    inquirer
        .prompt([
            {
                name: 'firstName',
                type: 'input',
                message: "What is the first name of the NEW employee you want to create?"
            },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the last name of the NEW employee you want to create?"
            },
            {
                name: 'roleID',
                type: 'number',
                choices() { listRoles(connection) },
                message: 'Enter the ID# of the employee role you want to assign to this employee'
            },
            {
                name: 'managerID',
                type: 'number',
                choices() { managerChoices(connection) },
                message: 'Enter the ID# of the person you want to manage this employee'
            },
            {
                name: 'departmentID',
                type: 'number',
                choices() { listDepartments(connection) },
                message: 'Enter the ID# of the department you would like this role to be in'
            }
        ])
        .then((answer) => {
            let newEmployee = new Employee(answer.firstName, answer.lastName, answer.roleID, answer.managerID, answer.departmentID);
            const query = 'INSERT INTO employee SET ?';

            connection.query(query, {
                first_name: newEmployee.first_name,
                last_name: newEmployee.last_name,
                role_id: newEmployee.role_id,
                manager_id: newEmployee.manager_id,
                department_id: newEmployee.department_id
            },
                (err, res) => {
                    if (err) throw err;

                    console.log('\nYour new employee has been added!\n');
                    console.table(res);
                    // re-prompt the user for if they want to bid or post
                    viewEmployees(connection, cb);
                    // if (cb) {
                    //     cb()
                    // }
                }
            );
        });
};

module.exports = { viewEmployees, viewDepartments, viewRoles, viewEmployeesByDepartment, viewEmployeesByManager, addDepartment, addRole, listDepartments, updateRole, quitApplication, addEmployee };