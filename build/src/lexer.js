"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function InputStream(input) {
    var pos = 0, line = 1, col = 0;
    return {
        next: next,
        peek: peek,
        eof: eof,
        croak: croak,
    };
    function next() {
        var ch = input.charAt(pos++);
        if (ch == "\n")
            line++, col = 0;
        else
            col++;
        return ch;
    }
    function peek() {
        return input.charAt(pos);
    }
    function eof() {
        return peek() == "";
    }
    function croak(msg) {
        throw new Error(msg + " (" + line + ":" + col + ")");
    }
}
exports.InputStream = InputStream;
function TokenStream(raw_input) {
    var current = null;
    var input = InputStream(raw_input);
    var keywords = " form color size border line inclination ";
    return {
        next: next,
        peek: peek,
        eof: eof,
        croak: input.croak
    };
    function is_keyword(x) {
        return keywords.indexOf(" " + x + " ") >= 0;
    }
    function is_id_start(ch) {
        return /[a-zλ_]/i.test(ch);
    }
    function is_id(ch) {
        return is_id_start(ch) || "0123456789".indexOf(ch) >= 0;
    }
    function is_op_char(ch) {
        return "+&-=".indexOf(ch) >= 0;
    }
    function is_punc(ch) {
        return ";".indexOf(ch) >= 0;
    }
    function is_whitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }
    function read_while(predicate) {
        var str = "";
        while (!input.eof() && predicate(input.peek()))
            str += input.next();
        return str;
    }
    function read_ident() {
        var id = read_while(is_id);
        return {
            type: is_keyword(id) ? "kw" : "attribute",
            value: id
        };
    }
    function skip_comment() {
        read_while(function (ch) { return ch != "\n"; });
        input.next();
    }
    function read_next() {
        read_while(is_whitespace);
        if (input.eof()) {
            return null;
        }
        var ch = input.peek();
        if (ch == "#") {
            skip_comment();
            return read_next();
        }
        if (is_id_start(ch)) {
            return read_ident();
        }
        if (is_punc(ch)) {
            return {
                type: "punc",
                value: input.next()
            };
        }
        if (is_op_char(ch)) {
            return {
                type: "op",
                value: read_while(is_op_char)
            };
        }
        input.croak("Can't handle character: " + ch);
    }
    function peek() {
        return current || (current = read_next());
    }
    function next() {
        var tok = current;
        current = null;
        return tok || read_next();
    }
    function eof() {
        return peek() == null;
    }
}
exports.TokenStream = TokenStream;
