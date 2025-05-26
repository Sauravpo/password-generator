const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

// set  password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}


function setIndicator(color){
        indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRandomNumber(min,max){
        return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return  getRandomNumber(1,9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomNumber(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandomNumber(65,91));
}

function generateSymbol(){
        const randNum=getRandomNumber(0,symbols.length);
        return symbols[randNum];

}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck && uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck && lowercaseCheck.checked) hasLower = true;
    if (numbersCheck && numbersCheck.checked) hasNum = true;
    if (symbolsCheck && symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
  
    copyMsg.classList.add("active");
    setTimeout(()=>{
            copyMsg.classList.remove("active");
    },2000);

}
function shufflePassword(array){
    // fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

  
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('click',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
        // none of the checkbox are selected
        if(checkCount<=0){
            return;
        }
        if(passwordLength<checkCount){
            passwordLength=checkCount;
            handleSlider();
        }
       
        // remove old pasword
        password="";
        let funcArr=[];
        if (uppercaseCheck && uppercaseCheck.checked)
            funcArr.push(generateUppercase);
        if (lowercaseCheck && lowercaseCheck.checked)
            funcArr.push(generateLowercase);
        if (numbersCheck && numbersCheck.checked) 
            funcArr.push(generateRandomNumber);
        if (symbolsCheck && symbolsCheck.checked) 
            funcArr.push(generateSymbol);
        
        for(let i=0;i<funcArr.length;i++){
            password+=funcArr[i]();
        }
        for(let i=0;i<passwordLength-funcArr.length;i++){
            let randIndex=getRandomNumber(0,funcArr.length);
            password+=funcArr[randIndex]();
        }
        password=shufflePassword(Array.from(password));
        passwordDisplay.value=password;
        
        calcStrength();

});






