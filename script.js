const display = document.getElementById("display");
const buttons = document.querySelectorAll(".button");
let defaultInput = "0";
let preparedCondition = [];
let currentResult = "0";
const allowedSymbols = ["0","1","2","3","4","5","6","7","8","9","c","=",".","+","-","*","/"];
const operationSymbols = ["+","-","*","/"];

buttons.forEach(button => {
   button.addEventListener("click", () => {
       calculate(button.innerText);
   });
});

document.addEventListener("keydown", function (e) {
    let symbol = e.key === "Enter" ? "=" : e.key;
    calculate(symbol);
});

function calculate(symbol){
    if(validateSymbols(symbol)){
        if(symbol.toLowerCase() === 'c'){
            preparedCondition = [];
            currentResult = defaultInput;
        }else if(symbol === "="){
            if(preparedCondition.length>0){
                if(operationSymbols.includes(preparedCondition[preparedCondition.length-1])){
                    preparedCondition.pop();
                }
                currentResult = eval(preparedCondition.join(''));
                if(!Number.isInteger(currentResult)){
                    currentResult = parseFloat(currentResult.toFixed(2));
                }
                preparedCondition = [];
                preparedCondition.push(currentResult);
            }
        }else{
            preparedCondition.push(symbol);
            currentResult = preparedCondition.join('');
        }

        display.innerText = currentResult;
    }
}

function rulesWithDot(){
    let canUseDot = true;
    if(preparedCondition.includes(".")){
        let lastPositionDot = preparedCondition.lastIndexOf(".");
        canUseDot = false;
        let useOperation = false;
        for (let i = lastPositionDot; i < preparedCondition.length; i++) {
            if(operationSymbols.includes(preparedCondition[i])){
                useOperation = true;
            }else if(useOperation && !Number.isNaN(preparedCondition[i])){
                canUseDot = true;
            }
        }
    }
    return isFirstSymbolExists() && canUseDot;
}

function commonRules(symbol){
    let doubleOperationSymbol = (operationSymbols.includes(symbol) &&
        operationSymbols.includes(preparedCondition[preparedCondition.length-1]));
    return !doubleOperationSymbol;
}

function isFirstSymbolExists(){
    return !(preparedCondition.length === 0);
}

function prevSymbolNotDot(){
    return preparedCondition[preparedCondition.length-1]!==".";
}

function firstSymbolZeroIsOnlyOne(){
    return preparedCondition.length === 1 && preparedCondition[0] === 0 || preparedCondition.length !== 1;
}

function validateSymbols(symbol){
    let result = false;
    if(allowedSymbols.includes(symbol.toLowerCase()) && commonRules(symbol)) {
        switch (symbol) {
            case ".":
                result = rulesWithDot();
                break;
            case "+":
            case "/":
            case "*":
                result = isFirstSymbolExists() && prevSymbolNotDot();
                break;
            case "0":
                result = firstSymbolZeroIsOnlyOne();
                break;
            default:
                result = true;
                break;
        }
    }
    return result;
}