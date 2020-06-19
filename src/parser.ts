import { IStream } from '../contracts/stream';

export function parse(input: IStream): any {
  const PRECEDENCE = {
    "=": 1,
    "+": 10,
    "&": 20,
  };

  return parse_toplevel();

  function is_punc(ch: string) {
    const tok = input.peek();
    return tok && tok.type == "punc" && (!ch || tok.value == ch);
  }

  function is_kw(kw: string) {
    const tok = input.peek();
    return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
  }

  function is_op(op: string) {
    var tok = input.peek();
    return tok && tok.type == "op" && (!op || tok.value == op) && tok;
  }

  function skip_punc(ch: string) {
    if (is_punc(ch)) input.next();
    else input.croak("Expecting punctuation: \"" + ch + "\"");
  }

  function unexpected(): void {
    input.croak("Unexpected token: " + JSON.stringify(input.peek()));
  }

  function parse_shape(type) {
    const form = input.peek().value;
    const attributes = parse_attributes();
    const res = {
      type,
      body: { form, attributes: attributes }
    };
    return res;
  }

  function parse_line() {
    const line = input.peek().value;
    const attributes = parse_attributes();
    const res = {
      type: "line",
      body: { line, attributes: attributes }
    };
    return res;
  }

  function parse_attribute(type: string, attributes: Array<string>) {

    if (input.peek().type != "attribute" && attributes.indexOf(input.peek().value) < 0) {
      unexpected();
    }

    const res = {};
    res[`${type}`] = input.next().value;
    return res
  }

  function parse_attributes() {
    input.next()
    let attributes = {};
    if (is_kw("color")) {
      input.next()
      const color = parse_attribute('color', ['red', 'green', 'blue']);
      if (color) {
        attributes = Object.assign({}, attributes, color);
      }
    }

    if (is_kw("size")) {
      input.next()
      const size = parse_attribute('size', ['big', 'medium', 'small']);
      if (size) {
        attributes = Object.assign({}, attributes, size);
      }
    }

    if (is_kw("inclination")) {
      input.next()
      const inclination = parse_attribute('inclination', ['horizontal', 'vertical', 'oblique_pos', 'oblique_min']);
      if (inclination) {
        attributes = Object.assign({}, attributes, inclination);
      }
    }

    return attributes;
  }

  function parse_atom() {
    if (is_kw("form")) {
      input.next()
      return parse_shape('form');
    }

    if (is_kw("border")) {
      input.next()
      return parse_shape('border');
    }

    if (is_kw('line')) {
      input.next();
      return parse_line();
    }

    input.next();
    unexpected();
  }

  function maybe_binary(left: any, my_prec: number) {
    if (input.eof()) {
      return left;
    }
    const tok = is_op(input.peek().value);
    if (tok) {
      const his_prec = PRECEDENCE[tok.value];
      if (his_prec > my_prec) {
        input.next();
        var right = maybe_binary(parse_atom(), his_prec);
        var binary = {
          type: tok.value == "=" ? "equal" : "binary",
          operator: tok.value,
          left: left,
          right: right
        };
        return maybe_binary(binary, my_prec);
      }
    }
    return left;
  }

  function parse_toplevel() {
    const prog = [];
    while (!input.eof()) {
      prog.push(parse_expression());
      skip_punc(";");
    }
    return { type: "prog", prog: prog };
  }

  function parse_expression() {
    return maybe_binary(parse_atom(), 0);
  }
}
