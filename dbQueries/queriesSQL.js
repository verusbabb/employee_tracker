const cTable = require('console.table');
const inquirer = require('inquirer');
//NOT YET FUNCTIONAL
const viewEmployees = (connection) => {
    console.log('Selecting all employees...\n');
    const query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        connection.end();
    })
};


const viewEmployeesByDepartment = (connection) => {
    console.log('Selecting all employees by departments...\n');
    const query = 'SELECT first_name, last_name, title, department_name FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = employee.department_id ORDER BY department_name';
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        // viewRoles(connection);
        connection.end();
    });
};

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


module.exports = { viewEmployees, viewEmployeesByDepartment, viewEmployeesByManager };