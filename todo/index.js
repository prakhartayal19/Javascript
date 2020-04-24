const express = require("express")
const bodyParser = require("body-parser");
const request = require("request")
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");

// here you set that you're using `ejs` template engine, and the
// default extension is `ejs`
//view engine,the template engine to use.For example,to use the Pug template engine: app.set('view engine', 'pug').

app.use(bodyParser.urlencoded({ extended: true }));            // To use body-parser
app.use(express.static("public"));                          // To use static files (e.g. css,sass,javascipt  etc.) 

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://admin-Prakhar:prakhartayal1910@cluster0-zfevz.gcp.mongodb.net/todoListDB", { useNewUrlParser: true, useUnifiedTopology: true });    // setting a mongoose connection with Db name todoListDB


const itemSchema = new mongoose.Schema({

    name: {
        type: String,
        requires: [true]
    }
});

const Item = mongoose.model("item", itemSchema);
const item1 = new Item({
    name: "Welcome to your TodoList"
});
const item2 = new Item({
    name: "Hit the + button to add a new item"
});
const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];





var date = new Date()                                     // Date object is created and stored in a variable "date",so to use date functions

var options = {                                               // Options are used to provide what and type of details you  want
    weekday: "long",
    day: "numeric",
    month: "long"
};
var day = date.toLocaleDateString("en-us", options)           // To fetch current date using date format



app.get("/", function (req, res) {

   


    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {

            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log("Error occured");

                }
                else {
                    console.log("Successfully inserted defaultItems into db");

                }
            });
            res.redirect("/");

        }
        else {
            // res.render("list",{kindOfDay:weekday[day]})
            res.render("list", { kindOfDay: day, newListItems: foundItems })       // here you render `list` template  

        }


    });



    //res.render() function compiles your template (please don't use ejs), inserts locals there, and creates html output out of those two things.
    //It render list.ejs and display current date ,using object notation(key:value) 


});

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]

});
const List = mongoose.model("list", listSchema);


app.get("/:customListName", function (req, res) {         // To get dynamic Route
    const customListName = req.params.customListName;

    List.findOne({ name: customListName }, function (err, foundList) {

        if (!err) {

            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
            }
            else {
                res.render("list", { kindOfDay: foundList.name, newListItems: foundList.items })
            }
        }


    })




});

// post function handles request coming from client to server
app.post("/", function (req, res) {
    const itemName = req.body.newItem;;
    const listName = req.body.list
    const item = new Item({
        name: itemName
    });

    if (listName === day) {
        item.save();
        res.redirect("/");                                  // It will redirect to home route function i.e. app.get
    }
    else {
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save()
            res.redirect("/"+listName)
        })

    }
});

app.post("/delete", function (req, res) {
    const deletedItem = req.body.chk;

    Item.findByIdAndRemove(deletedItem, function (err) {
        if (err) {
            console.log(err);

        }
        else {
            console.log("Successfully deleted an item");
            console.log("ID for deleted item is :", deletedItem);


        }
    })
    res.redirect("/");


})


app.listen(3000, function () {                                     // function to listen to specified port number
    console.log("Port is running on 3000")
});