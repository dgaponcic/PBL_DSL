import { TokenStream } from './src/lexer';
import { parse } from './src/parser';
import { interpret } from './src/interpretator';
const bodyParser = require("body-parser");
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', (req, res) => {
  const input = req.body.input;
  res.send({ msg: compile(input) });
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

function compile(input: string) {
  try {
    return interpret(parse(TokenStream(input)));
  } catch (error) {
    console.log(error)
    return false;
  }
}
