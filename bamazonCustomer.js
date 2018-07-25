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

connection.connect(function (err) {
    if (err) throw err;

    lookUp();
});


function lookUp() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\nID: " + res[i].item_id + "\nProduct: " + res[i].product_name + "\nPrice: $" + res[i].price + "\nQuantity: " + res[i].stock_quantity)
        };

        console.log("Welcome to Bamazon. What would you like to buy?")
        inquirer.prompt([

            {
                type: "input",
                message: "What product number would you like select?",
                name: "productSelection"
            }

        ])
            .then(function (response) {

                var chosenItem = parseInt(response.productSelection - 1);

                console.log("\nID: " + res[chosenItem].item_id + "\nProduct: " + res[chosenItem].product_name + "\nPrice: " + res[chosenItem].price + "\nQuantity: " + res[chosenItem].stock_quantity);

                inquirer.prompt([

                    {
                        type: "input",
                        message: "How many would you like to order?",
                        name: "checkout"
                    }
                ])
                    .then(function (purchase) {

                        //console.log(res[chosenItem].stock_quantity);

                        if (purchase.checkout <= res[chosenItem].stock_quantity) {

                            console.log("Your order has been placed!")

                            var query = connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: res[chosenItem].stock_quantity - purchase.checkout
                                    },
                                    {
                                        item_id: chosenItem + 1
                                    }
                                ],
                                function (err, res) {

                                    console.log(query.sql);
                                }
                            );


                        }
                        else {
                            console.log("\nYour order could not be placed.")
                            console.log("\nInsufficient quantity! Please try again\n")
                        }

                    })
            })
    })
}