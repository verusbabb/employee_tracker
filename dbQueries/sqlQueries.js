const cTable = require('console.table');
const inquirer = require('inquirer');
const Department = require('../lib/department');
const Role = require('../lib/role');
const Employee = require('../lib/employee');

//build and display table of employees
const viewEmployees = (connection) => {
    console.log('Selecting all employees...\n');
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id ORDER BY employee.id";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        // connection.end();
    })
};

const viewDepartments = (connection) => {
    const query = "SELECT employee.first_name, employee.last_name, department.department_name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        // connection.end();
    })
}

const viewRoles = (connection) => {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id";
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
    const query = "SELECT employee.manager_id, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id GROUP BY employee.manager_id ORDER BY employee.id";
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

const listRoles = (connection) => {
    connection.query('SELECT id, title, salary FROM role', (err, res) => {
        if (err) throw err;
        console.log('Here are the current roles in the company');
        console.table(res);

    });
};

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

                    console.log('Your new role was created successfully!');
                    console.table(res);
                    // re-prompt the user for if they want to bid or post
                    listRoles(connection);
                }
            );
        });
};

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
            console.log(answer.updatedRole, answer.employee);
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

                    console.log("The employee's role has been updated!");
                    console.table(res);
                    viewEmployees(connection);
                }
            );
            // const query = 'UPDATE employee SET role_id = ? WHERE id = ?';

            // connection.query(query,
            //     [answer.updatedRole, answer.employee],
            //     (err, res) => {
            //         if (err) throw err;

            //         console.log("The employee's role has been updated!");
            //         console.table(res);
            //         viewEmployees(connection);
            //     }
            // );
        });
}

// const listRoles = (connection) => {
//     connection.query('SELECT title FROM role', (err, res) => {
//         if (err) throw err;
//         console.log('These are now the company departments');
//         console.table(res);
//         connection.end()
//     });
// };

module.exports = { viewEmployees, viewDepartments, viewRoles, viewEmployeesByDepartment, viewEmployeesByManager, addDepartment, addRole, listDepartments, updateRole };