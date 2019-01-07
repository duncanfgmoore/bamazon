var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "bamazondb"
});

connection.connect(function(err) {
  if (err) throw err;

  prompt();
});

function prompt() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to select?",
        name: "startingQuestion",
        choices: ["View Departments", "Create New Department"]
      }
    ])
    .then(function(response) {
      if (response.startingQuestion === "View Departments") {
        viewDepartment();
      }

      if (response.startingQuestion === "Create New Department") {
        createDepartment();
      }
    });
}

function viewDepartment() {
  console.log("\nA list of all the departments");

  var query =
    "SELECT department_id AS department_id, departments.department_name AS department_name, SUM(over_head_costs) AS over_head_cost, SUM(products.product_sales) AS product_sales, SUM((products.product_sales - over_head_costs)) AS profit  FROM products INNER JOIN departments ON products.department_name = departments.department_name GROUP BY department_id ORDER BY department_id";

  connection.query(query, function(err, res) {
    console.table(res);
  });
}

function createDepartment() {
  console.log("Create a new department");

  inquirer
    .prompt([
      {
        type: "input",
        message: "What department would you like to add?",
        name: "department_name"
      },
      {
        type: "input",
        message: "What is the Over Head Cost?",
        name: "over_head_costs"
      }
    ])
    .then(function(answer) {
      var query = connection.query("INSERT INTO departments SET ?", {
        department_name: answer.department_name,
        over_head_costs: answer.over_head_costs
      });
      console.log(query.sql);
    });
}
