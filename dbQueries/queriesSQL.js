
//NOT YET FUNCTIONAL
const viewEmployees = () => {
    console.log('Selecting all employees...\n');
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;

        console.table(res);
        connection.end();
    });
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);

});

module.exports = (viewEmployees);