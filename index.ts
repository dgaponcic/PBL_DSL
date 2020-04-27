import { TokenStream } from './lexer';
import { parse } from './parser';
import { interpret } from './interpretator_old';

const input = "border square color red size medium & line straight color red inclination oblique_pos & line straight color red inclination oblique_neg + form circle color red size medium = form circle color red size medium & line straight color red inclination oblique_neg & line straight color red inclination oblique_pos & border square color red size medium;"


// const lexer = TokenStream(input)
// while (!lexer.eof()) {
//   console.log(lexer.next())
// }

// console.log(parse(TokenStream(input)).prog[0].body);

// console.log(interpret(parse(TokenStream(input))));

function compile(input: string) {
  console.log("here")
  console.log(interpret(parse(TokenStream(input))));
}
