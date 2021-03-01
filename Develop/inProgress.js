// const updateRole = () => {
//     console.log('Updating employee role...\n');
//     const query = connection.query(
//         'UPDATE employee SET ? WHERE ?',
//         [
//             {
//                 first_name: //insert reference,
//         },
//             {
//                 last_name: //insert reference,
//         },
//             {
//                 role_id: //insert references,
//         },
//         ],
//         (err, res) => {
//             if (err) throw err;
//             console.log(`${res.affectedRows} employee role update!\n`);
//             // Call deleteProduct AFTER the UPDATE completes
//             viewEmployees();
//         }
//     );