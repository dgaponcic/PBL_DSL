"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./src/lexer");
var parser_1 = require("./src/parser");
var interpretator_1 = require("./src/interpretator");
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
var port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/', function (req, res) {
    var input = req.body.input;
    res.send({ msg: compile(input) });
});
app.listen(port, function () { return console.log("Example app listening at http://localhost:" + port); });
var input = "border square color red size medium & line straight color red inclination oblique_pos & line straight color red inclination oblique_neg + form circle color red size medium = form circle color red size medium & line straight color red inclination oblique_neg & line straight color red inclination oblique_pos & border square color red size medium;";
function compile(input) {
    try {
        console.log("request");
        console.log(input);
        return interpretator_1.interpret(parser_1.parse(lexer_1.TokenStream(input)));
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
console.log(compile("form circle color blue size big  & line straight color green inclination oblique_pos  +  form circle color green size medium  & line straight color blue inclination oblique_pos   +  form square color green size small   =  form triangle color blue size small  & line straight color blue inclination oblique_pos & line straight color green inclination oblique_pos  ;"));
