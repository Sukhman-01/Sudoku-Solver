var arr = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);
	}
}
console.log(arr);

var board = [[], [], [], [], [], [], [], [], []]

function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] != 0) {
				arr[i][j].innerText = board[i][j];
			}

			else{
				arr[i][j].innerText = '';
			}
		}
	}
}

function isValid(board, i, j, num, n){

    // check row and column
    for(let x=0;x<n;x++){
        if(board[i][x]==num || board[x][j]==num){
            return false;
        }
    }

    // check sub-matrix (3x3)
    let rootN = Math.sqrt(n);
    let si = i - i%rootN;
    let sj = j - j%rootN;

    for(let x = si; x<si+rootN; x++){
        for(let y = sj; y<sj+rootN; y++){
            if(board[x][y]==num){
                return false;
            }
        }
    }
    return true;

}

let GetPuzzle = document.getElementById('GetPuzzle')
let SolvePuzzle = document.getElementById('SolvePuzzle')

GetPuzzle.onclick = function(){
    window.location.reload();
}

window.onload = function () {
    document.getElementById("opCnt").innerText = '__'; 
	var xhrRequest = new XMLHttpRequest()
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response)
		console.log(response)
		board = response.board
		FillBoard(board)
	}
	xhrRequest.open('get', 'https://sugoku2.herokuapp.com/board?difficulty=easy')
	xhrRequest.send()
}

SolvePuzzle.onclick = () => {
    cnt = 0;
	solveSudoku(board, 0, 0, 9);
};

var time = 0;
var cnt = 0;
var delay = 70;


function solveSudoku(board, i, j, n) {
	// base condition
    if(i==n){
        // FillBoard(board);
        return true;
    }
    //if we are outside the board
    if(j==n){
        return solveSudoku(board,i+1,0,n);
    }

    // if cell is already filled
    // move ahead
    if(board[i][j] != 0){
        return solveSudoku(board,i,j+1,n);
    }

    // fill the cell with a valid number
    for(let num=1;num<=9;num++){
        //check if number can be filled
        var id = i*9 + j;
        if(isValid(board,i,j,num,n)){
            cnt++;
            board[i][j] = num;
            
            setTimeout(() => {
                document.getElementById("result").innerHTML = "<h2>Solving....🔄</h2>";
                document.getElementById(id).innerText = num;
                document.getElementById("opCnt").innerText = cnt; 
                if(id == 80){
                    document.getElementById("result").innerHTML = "<h2>🎉🎉 Puzzle Solved! 🎉🎉</h2>";
                }
                
            }, time);
            time+=delay;
            
            console.clear();
            console.log(cnt);
            

            if(solveSudoku(board,i,j+1,n)){
                return true;
            }
            else{
                board[i][j] = 0;
                setTimeout(() => {
                    document.getElementById(id).innerText = '';
                }, time);
                time+=delay;
            }
        }
    }
    
    return false;
}
