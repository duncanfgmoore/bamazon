var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require('console.table');

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

connection.connect(function (err) {
    if (err) throw err;

    prompt();
});

function prompt() {

    inquirer.prompt([

        {
            type: "list",
            message: "What would you like to select?",
            name: "startingQuestion",
            choices: ["View Departments", "Create New Department"]
        }
    ])
        .then(function (response) {

            if (response.startingQuestion === "View Departments") {
                viewDepartment();
            }

            if (response.startingQuestion === "Create New Department") {
                createDepartment();
            }

           

        })

};


// SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
// FROM Orders
// INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;

function viewDepartment(){
    
};



function createDepartment() {
    
        console.log("Create a new department")
    
        inquirer.prompt([
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
            .then(function (answer) {
    
                var query = connection.query(
                    "INSERT INTO departments SET ?",
                    {
                        department_name: answer.department_name,
                        over_head_costs: answer.over_head_costs
                        
                    }
                )
                console.log(query.sql);
            })
    
};