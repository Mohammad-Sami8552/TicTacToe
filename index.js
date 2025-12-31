const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
function drawGrid() {
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, 300);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 300);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(300, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(300, 200);
    ctx.stroke();
    ctx.closePath();
}


ctx.font = "40px Arial";
const txt = document.getElementById("btn");
let st = document.getElementById("status");

let board = [];
let gameOver = false;

function initialize() {
    let turn = prompt("Enter 1 for your turn first otherwise 0");
    gameOver = false;
    st.innerText = "Game Running..."
    ctx.clearRect(0, 0, 300, 300);
    drawGrid();
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i][j] = -1;

        }
    }
    if(turn == 0) {
            let move = nextMove();
            let xa = move.x;
            let yb = move.y;
            xC = yb * 100 + 40;
            yC = xa * 100 + 60;
            board[xa][yb] = 0;
            ctx.fillText(`${board[parseInt(xa)][parseInt(yb)]}`, xC, yC);
    }
}

function nextMove() {
    let x, y;
    let bestScore = -4;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == -1) {
                board[i][j] = 0;
                if (bestScore < minMax(false)) {
                    bestScore = minMax(false);
                    x = i;
                    y = j;
                }
                board[i][j] = -1;
            }
        }
    }
    return { x, y };
}

//Min Max Alogirthm
function minMax(maxs) {
    let status = checkWinner();
    if (status == 0) {
        return 1;
    }
    if (status == 1) {
        return -1;
    }
    if (checkFill())
        return 0;
    let bestScore;
    if (!maxs) {
        bestScore = 4;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == -1) {
                    board[i][j] = 1;
                    if (bestScore > minMax(true)) {
                        bestScore = minMax(true);
                    }
                    board[i][j] = -1;
                }
            }
        }
    }

    else if (maxs) {
        bestScore = -4;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == -1) {
                    board[i][j] = 0;
                    if (bestScore < minMax(false)) {
                        bestScore = minMax(false);
                    }
                    board[i][j] = -1;
                }
            }
        }
    }
    return bestScore;
}

function checkFill() {
    let count = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] != -1)
                count++;
        }
    }
    return count == 9;
}


function checkWinner() {
    //Horizontal check
    for (let i = 0; i < 3; i++) {
        let win = true;
        for (let j = 1; j < 3; j++) {
            if (board[i][j] != board[i][j - 1] || board[i][j] == -1) {
                win = false;
                break;
            }
        }
        if (win)
            return board[i][0];
    }
    //Vertical Check
    for (let i = 0; i < 3; i++) {
        let win = true;
        for (let j = 1; j < 3; j++) {
            if (board[j][i] != board[j - 1][i] || board[j][i] == -1) {
                win = false;
                break;
            }
        }
        if (win)
            return board[0][i];
    }
    //main diagonal check
    let win = true;
    for (let i = 1; i < 3; i++) {
        if (board[i][i] != board[i - 1][i - 1] || board[i][i] == -1) {
            win = false;
            break;
        }
    }
    if (win) {
        return board[1][1];
    }

    //Antidiagoal check
    win = true;
    for (let i = 1; i >= 0; i--) {
        if (board[i][2 - i] != board[i + 1][2 - i - 1] || board[i][i] == -1) {
            win = false;
            break;
        }
    }
    if (win)
        return board[1][1];

    return -1;
}

function endGame(status) {
    gameOver = true;
    st.innerText = `${status == 0 ? "Pritam Kumar" : "You"} Won !`;
    txt.innerText = "Restart Game";
}

initialize();
canvas.addEventListener("click", function (event) {
    let a = event.offsetX;
    let b = event.offsetY;
    let x = parseInt(a) / 100;
    let y = parseInt(b) / 100;
    if (board[parseInt(y)][parseInt(x)] == -1 && !gameOver) {
        let xC = parseInt(x) * 100 + 40;
        let yC = parseInt(y) * 100 + 60;
        board[parseInt(y)][parseInt(x)] = 1;
        ctx.fillText(`${board[parseInt(y)][parseInt(x)]}`, xC, yC);
        let status = checkWinner();
        if (status == 0 || status == 1) {
            endGame();
        } else if (!checkFill()) {
            let move = nextMove();
            let xa = move.x;
            let yb = move.y;
            xC = yb * 100 + 40;
            yC = xa * 100 + 60;
            board[xa][yb] = 0;
            ctx.fillText(`${board[parseInt(xa)][parseInt(yb)]}`, xC, yC);
        }

        status = checkWinner();
        if (status == 0 || status == 1) {
            endGame(status);
        }

        if (checkFill(board)) {
            st.innerText = `Game Draw`;
            gameOver = true;
            txt.innerText = "Restart Game";
        }
    }
});








