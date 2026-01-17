// ================= Generate the squares element =================
let boxContainer = document.querySelector(".box-container")
let i
let squares = 25
let boxes = []

for (i = 0; i < squares; i++) {
    boxContainer.innerHTML += `<button disabled class="box box-${i}" onclick="btnHundler(this)"><img src="" alt=""></button>`
}
for (i = 0; i < squares; i++) {
    boxes.push(document.querySelector(`.box-${i}`))
}


// ================= Hundle bomb number =================
let bombInput = document.querySelector(".bomb-number input")
let minBomb = 4
let maxBomb = 12
bombInput.value = minBomb

function add() {
    started = false
    if (bombInput.value < maxBomb) {
        bombInput.value++
    }
}
function minus() {
    started = false
    if (bombInput.value > minBomb) {
        bombInput.value--
    }
}

function enableBtns() {
    document.querySelectorAll(".box").forEach((btn) => {
        btn.disabled = false
    })
}
function disableControll() {
    document.querySelectorAll(".controll-container button").forEach((button) => {
        if (button.classList != "checkout") {
            button.disabled = true
        }
    })
    document.querySelectorAll(".controll-container input").forEach((input) => {
        input.disabled = true
    })
}
function enableControll() {
    document.querySelectorAll(".controll-container button").forEach((button) => {
        button.disabled = false
    })
    document.querySelectorAll(".controll-container input").forEach((input) => {
        input.disabled = false
    })
}

let checkoutVisibility = false
function showCheckoutBtn(checkoutVisibilityParameter) {
    let checkout = document.querySelector(".checkout")
    let startBtn = document.querySelector(".start")

    if (checkoutVisibility || checkoutVisibilityParameter == true) {
        checkout.style.display = "none"
        startBtn.style.display = "flex"
        checkoutVisibility = false
    }
    else {
        checkout.style.display = "flex"
        startBtn.style.display = "none"
        checkoutVisibility = true
    }
    
    return checkoutVisibility
}



let win = false
let amount = 5
let checkedOut = false;

function checkout() {
    let correctBoxSound = document.querySelector(".cashout-sound")
    correctBoxSound.play()
    correctBoxSound.currentTime = 0

    localStorage.setItem("my cash : ", Number(yourCash.textContent.replace("$","")))

    if (checkedOut) return; 
    checkedOut = true;

    showCheckoutBtn(true)
    let price = Number(inputPrice.value)
    
    if (playerCheckaBox) {
        if (findBomb) {
            amount -= price
        }
        else {
            let totalGain = price * gainGlobal
            amount += totalGain
        }
    }
    else {
        let checkout = document.querySelector(".checkout")
        checkout.disabled = true
    }

    if(!lose){
        clearInterface()
    }
    
    
    yourCash.textContent = `${amount.toFixed(2)}$`;
    started = false;
    enableControll();
    console.log(`Final amount: ${amount}`)
}


// ================= bomb placement & game start =================
let started = false
let lose = false

function myRandom() {
    let randomNumber = Math.random()
    randomNumber = String(randomNumber)

    let lastTwo = randomNumber.slice(-2)
    randomNumber = Number(lastTwo)

    if (randomNumber > 24) {
        randomNumber = randomNumber % 25
    }

    return randomNumber
}

function clearInterface() {
    for (i = 0; i < squares; i++) {
        boxes[i].querySelector("img").src = ""
        boxes[i].classList.remove("active")
        boxes[i].disabled = true
        boxes[i].querySelector("img").style.display = "initial"
    }
}

let inputPrice = document.querySelector(".input-price")
inputPrice.max = maxBomb

let yourCash = document.querySelector(".your-cash span")

let getCash = localStorage.getItem("my cash : ")
if (getCash == null) {
    yourCash.textContent = `${amount}$`
}
else {
    yourCash.textContent = `${getCash}$`
}


function start() {
    localStorage.setItem("my cash : ", Number(yourCash.textContent.replace("$","")))
    
    checkedOut = false
    lose = false
    findBomb = false
    started = false
    clearInterface()
    disableControll()
    showCheckoutBtn()

    gainGlobal = Number(gainValues[bombInput.value - 1])
    yourGain.innerHTML = gainGlobal.toFixed(2)

    let bombs = bombInput.value
    while (bombs > 0) {
        let index = myRandom()
        if (!boxes[index].querySelector("img").src.includes("bomb.png")) {
            boxes[index].querySelector("img").src = "images/bomb.png"
            bombs--
        }
    }

    enableBtns()
    started = true

    document.querySelectorAll(".box").forEach((box) => {
        let localBoxImg = box.querySelector("img");
        if (localBoxImg && localBoxImg.src.includes("bomb.png")) {
            localBoxImg.style.display = "none";
        }
    });
}


// Hundle gain by price input

let yourGain = document.querySelector(".your-gain span")
let gainValues = []

for (i = 1; i <= maxBomb; i++) {
    let riskMultiplier = (i / (squares - i)) * 1.5; 
    gainValues[i - 1] = riskMultiplier.toFixed(2);
}

yourGain.innerHTML = gainValues[0]
let gainGlobal = Number(gainValues[bombInput.value - 1])

inputPrice.addEventListener("input", () => {
    gainGlobal = Number(gainValues[bombInput.value - 1])
    yourGain.innerHTML = gainGlobal.toFixed(2)
})


// ================= click on buttons =================

let findBomb = false
let playerCheckaBox = false
function btnHundler(btn) {
    let correctBoxSound = document.querySelector(".correct-box-sound")
    let wrongBoxSound = document.querySelector(".wrong-box-sound")

    playerCheckaBox = true

    if (started && btn.disabled == false) {
        btn.disabled = true
        let btnImgsrc = btn.querySelector("img")
        let step = Number(gainValues[bombInput.value - 1]);

        if (!btnImgsrc.src.includes("bomb.png")) {
            correctBoxSound.play()
            correctBoxSound.currentTime = 0;

            btnImgsrc.src = "images/diamond.png"
            btnImgsrc.classList.add("fadein")
            btn.classList.add("active")            

            gainGlobal = Number((gainGlobal + step).toFixed(2))
            yourGain.innerHTML = gainGlobal.toFixed(2)
        }
        else {
            wrongBoxSound.play()
            correctBoxSound.currentTime = 0;

            started = false
            lose = true
            findBomb = true
            enableBtns()
            enableControll()

            showCheckoutBtn(false)
            checkout()

            gainGlobal = 0

            document.querySelectorAll(".box").forEach((box) => {
                box.querySelector("img").style.display = "initial";
            })

            document.querySelectorAll(".box").forEach((button) => {
                if(button.querySelector("img").src.includes("bomb.png")) {
                    button.classList.add("active")
                }
            })
        }
    }
}
