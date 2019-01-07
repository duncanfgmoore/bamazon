var mysql = require("mysql");
var inquirer = require("inquirer");

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

//Set up a prompt to ask what they want to do
function prompt() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to select?",
        name: "startingQuestion",
        choices: [
          "View Products for Sale",
          "View Low Invetory",
          "Add to Inventory",
          "Add New Product"
        ]
      }
    ])
    .then(function(response) {
      if (response.startingQuestion === "View Products for Sale") {
        viewProducts();
      }

      if (response.startingQuestion === "View Low Invetory") {
        lowInventory();
      }

      if (response.startingQuestion === "Add to Inventory") {
        addInventory();
      }

      if (response.startingQuestion === "Add New Product") {
        newItem();
      }
    });
}

//Set up function to see what products are for sale

function viewProducts() {
  console.log("All current products in inventory");
  connection.query("SELECT * from products", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      console.log(
        "\nID: " +
          res[i].item_id +
          "\nProduct: " +
          res[i].product_name +
          "\nPrice: $" +
          res[i].price +
          "\nQuantity: " +
          res[i].stock_quantity +
          "\n"
      );
    }
    prompt();
  });
}

//Set up function to view products low on inventory

function lowInventory() {
  console.log("Products with a low inventory");
  connection.query("SELECT * FROM products WHERE stock_quantity < 4", function(
    err,
    res
  ) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        "\nID: " +
          res[i].item_id +
          "\nProduct: " +
          res[i].product_name +
          "\nPrice: $" +
          res[i].price +
          "\nQuantity: " +
          res[i].stock_quantity +
          "\n"
      );
    }
  });
}

//Set up function to add more to current product stock

function addInventory() {
  connection.query("SELECT * from products", function(err, res) {
    if (err) throw err;

    console.log("Add more to the inventory");

    inquirer
      .prompt([
        {
          type: "input",
          message: "What item number do you with to add to?",
          name: "item_id"
        },
        {
          type: "input",
          message: "How many would you like to add?",
          name: "addedProduct"
        }
      ])
      .then(function(response) {
        var newInventory = connection.query("UPDATE products SET ? WHERE ?", [
          {
            stock_quantity:
              parseInt(res[response.item_id - 1].stock_quantity) +
              parseInt(response.addedProduct)
          },
          {
            item_id: response.item_id
          }
        ]);
        console.log(newInventory.sql);
      });
  });
}

//Set up function to add a new item

function newItem() {
  console.log("Add new item to inventory");

  inquirer
    .prompt([
      {
        type: "input",
        message: "What would you like to add?",
        name: "product_name"
      },
      {
        type: "input",
        message: "What department is it in?",
        name: "department_name"
      },
      {
        type: "input",
        message: "How much does it cost?",
        name: "price"
      },
      {
        type: "input",
        message: "How many are you adding?",
        name: "stock_quantity"
      }
    ])
    .then(function(answer) {
      var query = connection.query("INSERT INTO products SET ?", {
        product_name: answer.product_name,
        department_name: answer.department_name,
        price: answer.price,
        stock_quantity: answer.stock_quantity
      });
      console.log(query.sql);
    });
}
