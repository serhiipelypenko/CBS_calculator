const display = document.getElementById("display");
const buttons = document.querySelectorAll(".button");
let defaultInput = "0";
let preparedCondition = [];
let currentResult = "0";
const allowedSymbols = ["0","1","2","3","4","5","6","7","8","9","c","=",".","+","-","*","/"];
const operationSymbols = ["+","-","*","/"];

buttons.forEach(button => {
   button.addEventListener("click", () => {
       solution(button.innerText);
   });
});

document.addEventListener("keydown", function (e) {
    let symbol = e.key === "Enter" ? "=" : e.key;
    solution(symbol);
});

function solution(symbol){
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

function rulesWithDot(symbol){
    let canUseDot = true;
    if(symbol === "." && preparedCondition.includes(symbol.toLowerCase())){
        let lastPositionDot = preparedCondition.lastIndexOf(symbol);

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
    return !(symbol === "." && preparedCondition.length === 0) && canUseDot/* &&
        !(symbol === "." && preparedCondition.includes(symbol.toLowerCase()))*/;


}

function commonRules(symbol){
    let doubleOperationSymbol = (operationSymbols.includes(symbol) &&
        operationSymbols.includes(preparedCondition[preparedCondition.length-1]));
    return !doubleOperationSymbol;
}

function rulesWithMinus(symbol){
      return symbol === "-" ? preparedCondition[preparedCondition.length-1]!==symbol : true;
}

function rulesWithPlus(symbol){
    return symbol === "+" ? preparedCondition[preparedCondition.length-1]!==symbol : true;
}

function rulesWithDiv(symbol){
    return !(symbol === "/" && preparedCondition.length === 0);
}

function rulesWithMulti(symbol){
    return !(symbol === "*" && preparedCondition.length === 0);
}

function validateSymbols(symbol){
    return allowedSymbols.includes(symbol.toLowerCase()) && rulesWithDot(symbol) &&
        rulesWithMinus(symbol) && rulesWithPlus(symbol) && rulesWithDiv(symbol) &&
        rulesWithMulti(symbol) && commonRules(symbol);
}