function eval() {
    // Do not use eval!!!
    return;
}
const OPERATORS_WEIGHT = {
    '(': 1,
    '*': 2,
    '/': 2,
    '+': 3,
    '-': 3
}
let wileLoop = 0;

function expressionCalculator(expr) {
    // write your solution here
    expr = expr.replace(/\s/g, '');
    while (expr.includes('(') || expr.includes(')')) {
        expr = calculateBrackets(expr);
        wileLoop ++;
    }
    expr = calculate(expr);
    return Number(expr);
}

function calculate(expr) {
    let operators = expr.match(/[\*|\/|\+|\-]/g),
        multipleRegexp = new RegExp(/[0-9]*\.*[0-9]*\*\-?[0-9]*\.*[0-9]*/g),
        divisorRegExp = new RegExp(/[0-9]*\.*[0-9]*\/\-?[0-9]*\.*[0-9]*/g);

    operators.sort(comparableOperators).forEach(function (operator) {
        let matcher, arrOfNumbers, res;
        switch(operator) {
            case '*':
                matcher = expr.match(multipleRegexp) || [];
                if (matcher.length > 0) {
                    arrOfNumbers = matcher[0].split(operator);
                    res = parseFloat(arrOfNumbers.shift()) * parseFloat(arrOfNumbers.shift());
                    expr = expr.replace(matcher[0], res);
                }
                break;
            case '/':
                matcher = expr.match(divisorRegExp) || [];
                if (matcher.length > 0) {
                    arrOfNumbers = matcher[0].split(operator);
                    if (arrOfNumbers[1] == 0) {
                        throw "TypeError: Division by zero.";
                    }
                    res = parseFloat(arrOfNumbers.shift()) / parseFloat(arrOfNumbers.shift());
                    expr = expr.replace(matcher[0], res);
                }
                break;
            default:
                res = 0;
                matcher = expr.replace(/\-\-/g, '+').match(/[+\-]?([0-9\.\s]+)/g) || [];
                while(matcher.length) {
                    res += parseFloat(matcher.shift());
                }
                return expr = String(res);
                break;
        }
    });
    return expr;
}
function comparableOperators(a, b) {
    if (OPERATORS_WEIGHT[a] > OPERATORS_WEIGHT[b]) {
        return 1
    } else if (OPERATORS_WEIGHT[a] < OPERATORS_WEIGHT[b]) {
        return -1
    } else {
        return 0
    }
}

function checkBrackets(str) {
    let opened = ['(', ')'];

    str = str.match(/\(|\)/g);
    for (let i = 0; i < str.length; i++) {
        if ( str[i] == ')' ) {
            opened.pop();
        } else if (str[i] == '(') {
            opened.push(str[i]);
        }
    }
    return JSON.stringify(opened) == JSON.stringify(['(', ')']);
}

function ExpressionError(message) {
    this.message = message;
    this.name = "ExpressionError";
}

function calculateBrackets(expr) {
    if (!checkBrackets(expr)) {
        throw "ExpressionError: Brackets must be paired";
    }
    let hooksRegexp = new RegExp(/(\(.*\)+)/g),
        matcher = expr.match(hooksRegexp)[0],
        parts = partitionsExpression(matcher);

    parts.forEach(function(part) {
        let newExpr = part.slice(1, -1);

        if (newExpr.match(hooksRegexp)) {
            newExpr = calculateBrackets(newExpr);
            // return expr.replace(firstPart, calculate(newExpr));
        }
        expr = expr.replace(part, calculate(newExpr));
    })

    return expr;
}

function partitionsExpression(str) {
    let brCount = 0,
        res =[],
        findBr = false,
        newStr = '';

    for(let i = 0; i < str.length; i++) {
        let current = str[i];
        if(current == '(') {
            brCount ++;
            findBr = true;
        } else if(current == ')') {
            brCount --;
        }
        if (findBr) newStr += current;
        if (brCount == 0 && findBr) {
            res.push(newStr);
            findBr = false;
            newStr = "";
        }
    }

    return res;
}

module.exports = {
    expressionCalculator
}
