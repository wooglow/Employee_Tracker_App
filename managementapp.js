const mysql = require("mysql");
const inquirer = require("inquirer");
const Choices = require("inquirer/lib/objects/choices");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_db",
});
connection.connect((err) => {
    if (err) throw err;
    mainMenu();
});     

function mainMenu() {
  inquirer
  .prompt({
    name: "choice",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all employees by department",
      "View all employees by roles",
      "View all employees by manager",
      "View all employees",
      "Add employee",
      "Add role",
      "Add department",
      "Update employee role",
      "Update employee manager",
      "Delete employee",
      "Delete role",
      "Delete department",
      "View department budgets"]
  })
  .then(answer => {
    switch (answer.choice) {
      case "View all employees by department":
        viewAllEmpbyDept();
        break;
      case "View all employees by roles":
        viewAllEmpbyRole();
        break;
      case "View all employees by manager":
        viewAllEmpbyManager();
        break;
      case "View all employees":
        viewAllEmp();
        break;
      case "Add employee":
        addEmp();
        break;
      case "Add role":
        addRole();
        break;
      case "Add department":
        addDept();
        break;
      case "Update employee role":
        updateEmpRole();
        break;
      case "Update employee manager":
        updateEmpManager();
        break;
      case "Delete employee":
        deleteEmp();
        break;
      case  "Delete role":
        deleteRole();
        break;
      case  "Delete department":
        deleteDept();
        break;
      case  "View department budgets":
        viewDeptBudget();
        break;
    }
  });
}

function viewAllEmp() {
  const query ="SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee AS e LEFT JOIN employee as m on e.manager_id = m.id INNER JOIN roles AS r ON e.role_id = r.id INNER JOIN department AS d ON r.dept_id = d.id";

  connection.query(query, function(err, res) {
    if (err) return err;
    console.table(res);
    mainMenu();
  })
};

function viewAllEmpbyDept() {
  const deptQuery = 'SELECT * FROM department';
  connection.query(deptQuery, (err, results) => {
      if (err) throw err;

      inquirer.prompt([
          {
              name: 'deptChoice',
              type: 'list',
              choices: function () {
                  let choiceArray = results.map(choice => choice.department_name)
                  return choiceArray;
              },
              message: 'Select a Department to view:'
          }
      ]).then((answer) => {
          let chosenDept;
          for (let i = 0; i < results.length; i++) {
              if (results[i].department_name === answer.deptChoice) {
                  chosenDept = results[i];
              }
          }

          const query =`SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee AS e LEFT JOIN employee as m ON e.manager_id = m.id INNER JOIN roles as r on e.role_id = r.id INNER JOIN department as d on r.dept_id = d.id where d.department_name = "${chosenDept.department_name}"`;
          connection.query(query, (err, res) => {
              if (err) throw err;
              console.table(res);
              mainMenu();
          })
      })
  })
};

function viewAllEmpbyRole() {
  const roleQuery = 'SELECT * FROM roles';
  connection.query(roleQuery, (err, results) => {
      if (err) throw err;

      inquirer.prompt([
          {
              name: 'roleChoice',
              type: 'list',
              choices: function () {
                  let choiceArray = results.map(choice => choice.title)
                  return choiceArray;
              },
              message: 'Select a role to view:'
          }
      ]).then((answer) => {
          let chosenRole;
          for (let i = 0; i < results.length; i++) {
              if (results[i].title === answer.roleChoice) {
                  chosenRole = results[i];
              }
          }

          const query =`SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee AS e LEFT JOIN employee as m ON e.manager_id = m.id INNER JOIN roles as r on e.role_id = r.id INNER JOIN department as d on r.dept_id = d.id where r.title = "${answer.roleChoice}"`;
          connection.query(query, (err, res) => {
              if (err) throw err;
              console.table(res);
              mainMenu();
          })
      })
  })
};

function addDept() {
  inquirer.prompt([
    {
      name: 'wantedDept',
      type: 'input',
      message: 'Which department would you like to add?'
    }
  ]).then((answer) => {
    const query = `INSERT INTO department (department_name) VALUES ("${answer.wantedDept}");`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table(res);
      console.log(
      `Successfully added a new department ${answer.wantedDept}, Please add roles and employees for thee new department!`);
      console.log("\n");
      mainMenu();
  })
  })
};

function addRole() {
  const query1 = `SELECT * from roles INNER JOIN department on roles.dept_id = department.id ;`;
  connection.query(query1, (err, results) => {
    if (err) throw err;
    console.log('');
    console.table(results);
    
    inquirer.prompt([
      {
        name: 'roleName',
        type: 'input',
        message: 'What is the name of role would you like to add?'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the amount of salary for the role would you like to add?'
      },
      {
        name: 'deptName',
        type: 'input',
        message: 'Which department id would you like add for the new role?'
      },
    ]).then((answer) => {
      const query = `INSERT INTO roles (title, salary, dept_id) VALUES
        ("${answer.roleName}", ${answer.salary} ,${answer.deptName});`
      connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.log(
        `Successfully added a new department ${answer.rollName}, Please add employees for the new role!`);
        console.log("\n");
        mainMenu();
    })
    })
  });
};

function addEmp() {
  const query1 = `SELECT * from roles;`;
  connection.query(query1, (err, results) => {
    if (err) throw err;
    console.log('');
    console.table(results);
    
    inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'What is the first name of a newcomer?'
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'What is the last name of a newcomer?'
      },
      {
        name: 'rollId',
        type: 'input',
        message: 'Which id of role would you like add for the new employee? (This must be a number, Please refer to the pre-shown table)',
      },
    ]).then((answer) => {
      const query = `INSERT INTO employee (first_name, last_name, role_id) VALUES
        ("${answer.firstName}", "${answer.lastName}" ,${answer.rollId});`
      connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.log(
        `Successfully added a newcommer ${answer.firstName} ${answer.lastName}!`);
        console.log("\n");
        mainMenu();
    })
    })
  });
};

function updateEmpRole() {
  const query = `SELECT CONCAT(e.first_name, " ", e.last_name) AS full_name, r.title, r.id FROM employee AS e LEFT JOIN roles AS r ON e.role_id = r.id;`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    inquirer.prompt([
        {
            name: 'empl',
            type: 'list',
            choices: function () {
                let choiceArray = results.map(choice => choice.full_name);
                return choiceArray;
            },
            message: 'Select an employee to update their role:'
        },
        {
            name: 'newRole',
            type: 'list',
            choices: function () {
                let choiceArray = results.map(choice => choice.title);
                return choiceArray;
            }
        }
    ]).then((answer) => {
        connection.query(`UPDATE employee SET role_id = (SELECT id FROM roles WHERE title = ? ) WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?) AS tmptable)`, [answer.newRole, answer.empl], (err, results) => {
                if (err) throw err;
                console.log("\n");
                console.log(
                `Successfully ${answer.empl}'s role has been changed into ${answer.newRole}!`);
                console.log("\n");
                mainMenu();
            })
    })
})
};

function viewAllEmpbyManager() {  
    console.log("\n");
    console.log("This function is working on progress!");
    console.log("\n");
    mainMenu();
};

function updateEmpManager() {  
  console.log("\n");
  console.log("This function is working on progress!");
  console.log("\n");
  mainMenu();
};

function deleteEmp() {  
  console.log("\n");
  console.log("This function is working on progress!");
  console.log("\n");
  mainMenu();
};

function deleteRole() {  
  console.log("\n");
  console.log("This function is working on progress!");
  console.log("\n");
  mainMenu();
};

function deleteDept() {  
  console.log("\n");
  console.log("This function is working on progress!");
  console.log("\n");
  mainMenu();
};

function viewDeptBudget() {  
  // User choose department 
  
  console.log("\n");
  console.log("This function is working on progress!");
  console.log("\n");
  mainMenu();
};
