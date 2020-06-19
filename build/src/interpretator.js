"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
function interpret(ast) {
    return main();
    function main() {
        for (var _i = 0, _a = ast.prog; _i < _a.length; _i++) {
            var branch = _a[_i];
            evaluate(branch);
        }
        return true;
    }
    function get_attr_value(a, b, key, res) {
        var colors = ['red', 'green', 'blue'];
        var sizes = ['small', 'medium', 'big'];
        var shapes = ['square', 'circle', 'triangle'];
        var a_attr = a["attributes_" + key];
        var b_attr = b["attributes_" + key];
        if (Object.keys(a_attr).length != 0) {
            var color = a_attr.color !== b_attr.color ? colors.filter(function (color) { return color != a_attr.color && color != b_attr.color; })[0] : a_attr.color;
            res["attributes_" + key] = { color: color };
            if (a_attr.size) {
                var size = a_attr.size !== b_attr.size ? sizes.filter(function (size) { return size != a_attr.size && size != b_attr.size; })[0] : a_attr.size;
                res["attributes_" + key]['size'] = size;
            }
        }
        res[key] = a["" + key] !== b["" + key] ? shapes.filter(function (shape) { return shape != a["" + key] && shape != b["" + key]; })[0] : a["" + key];
        return res;
    }
    function add_expr_by_type(a, b, res, key) {
        if (a[key] && b[key]) {
            if (Object.keys(a["attributes_" + key]).length !== Object.keys(b["attributes_" + key]).length) {
                throw new Error('Invalid input');
            }
            res = get_attr_value(a, b, key, res);
        }
        else if (a["" + key]) {
            res[key] = a["" + key];
            res["attributes_" + key] = a["attributes_" + key];
        }
        else if (b["" + key]) {
            res[key] = b["" + key];
            res["attributes_" + key] = b["attributes_" + key];
        }
        return res;
    }
    function add_expr(a, b) {
        var res = { border: null, attributes_border: null, form: null, attributes_form: null, lines: [] };
        res = add_expr_by_type(a, b, res, 'border');
        res = add_expr_by_type(a, b, res, 'form');
        res['lines'] = a.lines.concat(b.lines);
        return res;
    }
    function evaluate(exp) {
        switch (exp.type) {
            case "binary":
                return apply_op(exp.operator, evaluate(exp.left), evaluate(exp.right));
            case "equal":
                return apply_op(exp.operator, evaluate(exp.left), evaluate(exp.right));
            case "form":
                return { border: null, attributes_border: null, form: exp.body.form, attributes_form: exp.body.attributes, lines: [] };
            case "border":
                return { border: exp.body.form, attributes_border: exp.body.attributes, form: null, attributes_form: null, lines: [] };
            case "line":
                var lines = [];
                lines.push(__assign({ type: exp.body.line }, exp.body.attributes));
                return { lines: lines };
            default:
                throw new Error("I don't know how to evaluate " + exp.type);
        }
    }
    function innerSort(a, b, key) {
        if (a[key] > b[key]) {
            return 1;
        }
        if (a[key] < b[key]) {
            return -1;
        }
        return 0;
    }
    function sort_lines(lines) {
        return lines.sort(function (x, y) {
            return innerSort(x, y, 'type') * 100 + innerSort(x, y, 'color') * 10 + innerSort(x, y, 'inclination');
        });
    }
    function equals(a, b) {
        a.lines = sort_lines(a.lines);
        b.lines = sort_lines(b.lines);
        a.lines = _.uniqWith(a.lines, _.isEqual);
        b.lines = _.uniqWith(b.lines, _.isEqual);
        if (JSON.stringify(a) !== JSON.stringify(b))
            throw new Error('Invalid equal');
        return true;
    }
    function concat_by_type(expr, key, res) {
        if (expr["" + key]) {
            res["" + key] = expr["" + key];
            res["attributes_" + key] = expr["attributes_" + key];
        }
        return res;
    }
    function concat_expr(a, b) {
        var res = { border: null, attributes_border: null, form: null, attributes_form: null, lines: [] };
        if (a.border && b.border)
            throw new Error('invalid');
        if (a.form && b.form)
            throw new Error('invalid');
        res = __assign(__assign(__assign(__assign({}, concat_by_type(a, 'border', res)), concat_by_type(b, 'border', res)), concat_by_type(a, 'form', res)), concat_by_type(b, 'form', res));
        res.lines = a.lines.concat(b.lines);
        return res;
    }
    function apply_op(op, a, b) {
        switch (op) {
            case "+": return add_expr(a, b);
            case "&": return concat_expr(a, b);
            case "=": return equals(a, b);
        }
        throw new Error("Can't apply operator " + op);
    }
}
exports.interpret = interpret;
