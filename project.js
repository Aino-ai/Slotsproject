// 1. Deposit money
// 2. Check amount of lines to bet on
// 3. Check bet amount
// 4. Spin the slots
// 5. Check the win
// 6. Distribute winnings
// 7. Play again / No money left


const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
};

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
};

// Step 1. Asking for a deposit amount and checking that the input is valid

const deposit = () => {
    while (true) {
    const depositAmount = prompt("Enter deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0 ) {
        console.log("Faulty deposit amount. Try again");
        } else {
            return numberDepositAmount;
        }
    }
};

// Step 2. Asking for the amount of lines to be bet on

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter amount of lines to bet on (1-3): ");
        const NumberOfLines = parseFloat(lines);
    
            if (isNaN(NumberOfLines) || NumberOfLines <= 0 || NumberOfLines > 3) {
            console.log("Invalid number of lines. Try again.");
            } else {
                return NumberOfLines;
            }
        }
};


// Step 3. Get the amount of bet

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);
    
            if (isNaN(numberBet) || numberBet <= 0 || numberBet > (balance / lines)) {
            console.log("Invalid bet. Try again.");
            } else {
                return numberBet;
            }
        }
};

// An array of available symbols
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};


// Step 4. Convert columns to rows
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }

    return rows;
}

// Step 5. Print out the rows

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
};

// Step 6. Check winnings

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet*SYMBOL_VALUES[symbols[0]]
        }
    }
    return winnings;
};

// Step 7. Game function. Looping and asking to play again

const game = () => {
    let balance = deposit();

    while (true) {
            console.log("Your balance is €" + balance);
        const NumberOfLines = getNumberOfLines();
        const bet = getBet (balance, NumberOfLines);
        balance -= bet*NumberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
            const winnings = getWinnings(rows, bet, NumberOfLines);
            balance += winnings;
        console.log("You won €" + winnings.toString());

        if (balance <= 0) {
            console.log("You're out of balance");
            break;
        }
        const playAgain = prompt("Play again? (y/n) ")

        if(playAgain != "y") break;
    }   
}

game();