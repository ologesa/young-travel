import Ember from 'ember';

export function compare(params /*lvalue, operator, rvalue, options*/) {
    var lvalue, rvalue, operator, result;

    if (params.length === 2) {
        lvalue = params[0];
        rvalue = params[1];
        operator = "===";

    } else if (params.length === 3) {
        lvalue = params[0];
        operator = params[1];
        rvalue = params[2];
    } else {
        throw new Error("Handlerbars Helper 'compare' needs 2 or 3 parameters");
    }

    var operators = {
        '==': function (l, r) {
            return l == r; // jshint ignore:line
        },
        '===': function (l, r) {
            return l === r;
        },
        '!=': function (l, r) {
            return l != r; // jshint ignore:line
        },
        '!==': function (l, r) {
            return l !== r;
        },
        '<': function (l, r) {
            return l < r;
        },
        '>': function (l, r) {
            return l > r;
        },
        '<=': function (l, r) {
            return l <= r;
        },
        '>=': function (l, r) {
            return l >= r;
        },
        'typeof': function (l, r) {
            return typeof l == r; // jshint ignore:line
        }
    };

    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }

    result = operators[operator](lvalue, rvalue);

    return result;
}

export default Ember.Helper.helper(compare);
