import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
let possibilities = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
class TTT extends React.Component{

  constructor(){
    super();
    let firstPlayer = Math.random() > .5 ? 'X': 'O';
    this.state = {
      currentPlayer : firstPlayer,
      board: [null,null,null,null,null,null,null,null,null],
      message: '',
      gameOver: true
    }
  }

  select(index) {
    console.log("%c **************",'color: #FF0000');
    console.log('entering user select');
    console.log('go: ' + this.state.gameOver);
    console.log('user clicked on cell: ' + index);
    if ((this.state.gameOver === false) && (this.state.ai === 0 | (this.state.ai === 1 && this.state.currentPlayer === 'O'))){
      console.log("it is the users turn");
      if (this.state.board[index] === null){
        console.log("that cell is open");
        this.state.board[index] = this.state.currentPlayer;

        this.setState({
          board: this.state.board,
          ai: this.state.ai,
          currentPlayer: this.state.currentPlayer,
          gameOver: this.state.gameOver,
          message: this.state.message
        });

        this.processSelection();
      }
    }
  }

  processSelection(){
    console.log("****************");
    console.log('entering processSelection');
    // console.log('psState: ' + this.state);
    console.log("psai: " + this.state.ai);
    console.log("pscp: " + this.state.currentPlayer);
    let message = 'blah, blah, blah';
    let winner = check4Winner(this.state.board);
    let movesLeft = 0;
    let gameOver= false;
    if (winner === 0){                                               //no winner yet
      console.log('no winner yet');
      movesLeft  = this.state.board.reduce((accum, element) => (accum + (element === null? 1:0)),0);
      console.log("how many moves left: " + movesLeft);
      this.state.currentPlayer = (this.state.currentPlayer === 'O') ? 'X':'O';                       //change to the next player
      console.log("changed the player to: " + this.state.currentPlayer);
      if (this.state.ai === 0) { message = (this.state.currentPlayer === 'X'? "Player X's turn":"Player O's turn");}
      if (this.state.ai === 1) { message = (this.state.currentPlayer === 'X'? "My turn":"Your turn (O)");}
      // $('.status').html(statusLookup[ai + currentPlayer]);              //update status message


    } else { //someone won!
      // movesLeft = 0;
      gameOver = true;
      if (this.state.ai === 1){ //this is single player mode
        if (this.state.currentPlayer === 'O'){message = 'You won....well played';}
        else {message = 'I won';}
      }

      else {//this is 2 player mode
        message = 'Player ' + this.state.currentPlayer + ' is the winner';
      }

    }
    // console.log("going to update message to: " + message);
    this.setState({
      gameOver: gameOver,
      message: message,
      currentPlayer: this.state.currentPlayer,
      ai: this.state.ai,
      board: this.state.board
    },() => setTimeout(() => this.checkComputerTurn(movesLeft), 4000)); //use the setState callback to avoid race condition.

    // if (this.state.ai === 1 && this.state.currentPlayer === 'X' && movesLeft > 0){this.computerTurn();}  //trigger computers turn since this must be a user turn

    if (movesLeft === 0 && winner === 0){
      this.setState({
        gameOver: true,
        message: "It's a draw",
        currentPlayer: this.state.currentPlayer,
        ai: this.state.ai,
        board: this.state.board
      });
    }
  }
    checkComputerTurn(movesLeft){
      if (this.state.ai === 1 && this.state.currentPlayer === 'X' && movesLeft > 0){this.computerTurn();}  //trigger computers turn since this must be a user turn
    }

    computerTurn(){
      console.log("*******");
      console.log('in computer turn');
      console.log('board: ' + this.state.board);
      let choice = chooser(this.state.board);
      console.log('computer choice is: ' + choice);
      console.log('ct ai: ' + this.state.ai);
      this.state.board[choice]= this.state.currentPlayer;
      this.setState({
        board: this.state.board,
        ai: this.state.ai,
        gameOver: this.state.gameOver,
        message: this.state.message,
        currentPlayer: this.state.currentPlayer
      });
      // pastMoves[choice]=1;
      // $('.cell:nth-child(' + (choice + 1) + ')').html("X");
      console.log("ai before leaving computerTurn: " + this.state.ai);
      this.processSelection();
    }

    twoPlayer (){
    let firstPlayer = Math.random() > .5 ? 'X': 'O';

      this.setState({
        currentPlayer : firstPlayer,
        board: [null,null,null,null,null,null,null,null,null],
        message: (firstPlayer === 'X') ? 'Player X goes first' : 'Player O goes first',
        gameOver: false,
        ai: 0
      });
    }

    singlePlayer (){
      //computer is always X
      let firstPlayer = Math.random() > .5 ? 'X': 'O';
      console.log("starting new single-player game");
      console.log("first player: " + firstPlayer);
      this.setState({
        currentPlayer : firstPlayer,
        board: [null,null,null,null,null,null,null,null,null],
        message: (firstPlayer === 'X') ? "I'll go first" : 'You go first....good luck',
        gameOver: false,
        ai: 1
      }, () => this.startSinglePlayer(firstPlayer) );
      // if (firstPlayer === "X") { this.computerTurn();}
    }

    startSinglePlayer(firstPlayer){
      if (firstPlayer === 'X'){
        this.computerTurn();
      }
    }

    render() {
      return (
        <div className="container">

            <div onClick={()=>this.computerTurn()}>Tic-Tac-Toe with React</div>
            <div className="board">
              {[0,1,2,3,4,5,6,7,8].map((idx) => <div onClick={() => this.select(idx)} className="cell">{this.state.board[idx]}</div>)}
            {this.state.gameOver ? <div id="startBar"><div onClick={() => this.singlePlayer()} id='singlePlayer'>Play the Computer</div><div onClick={() => this.twoPlayer()} id='twoPlayer'>2 Player</div></div> :''}
            <div id="messageBoard">{this.state.message}</div>


          </div>
        </div>
      )
    }

}

function check4Winner(pastMoves){

  let winner = 0;
  if (pastMoves[0]!==null && pastMoves[0]===pastMoves[1] && pastMoves[0]===pastMoves[2]){
    winner = pastMoves[0];

  }
  if (pastMoves[0]!==null && pastMoves[0]===pastMoves[4] && pastMoves[0]===pastMoves[8]){
    winner = pastMoves[0];
  }
  if (pastMoves[0]!==null && pastMoves[0]===pastMoves[3] && pastMoves[0]===pastMoves[6]){
    winner = pastMoves[0];
  }

  if (pastMoves[3]!==null && pastMoves[3]===pastMoves[4] && pastMoves[3]===pastMoves[5]){
    winner = pastMoves[3];
  }
  if (pastMoves[6]!==null && pastMoves[6]===pastMoves[7] && pastMoves[6]===pastMoves[8]){
    winner = pastMoves[6];
  }
  if (pastMoves[1]!==null && pastMoves[1]===pastMoves[4] && pastMoves[1]===pastMoves[7]){
    winner = pastMoves[1];
  }
  if (pastMoves[2]!==null && pastMoves[2]===pastMoves[5] && pastMoves[2]===pastMoves[8]){
    winner = pastMoves[2];
  }
  if (pastMoves[2]!==null && pastMoves[2]===pastMoves[4] && pastMoves[2]===pastMoves[6]){
    winner = pastMoves[2];
  }
  return winner
}

function chooser(pastMoves){
    var taken = movesCount(pastMoves);
    console.log("in chooser:");
    console.log("taken: " + taken + " , pastMoves: " + pastMoves);
    if ((taken < 2) && pastMoves[4] === null){return 4;} //if this is 1st or the second move and center cell is open, take it.
    if (taken === 1 && pastMoves[4] === 'O'){return 0;}
    if (taken === 2){return thirdMove(pastMoves);}

    let sundry = canIWin(pastMoves); //check to see if I have a winning move
    if (sundry >= 0){return sundry;}

    sundry = canILose(pastMoves);  //check to see if other player has a winning move
    if (sundry >= 0 ){return sundry;}
    if (taken === 3){return fourthMove(pastMoves);}
    if (taken === 4){return fifthMove(pastMoves);}
    if (taken === 5) {return sixthMove(pastMoves);}
    return chooseSomething(pastMoves);
}

function movesCount(pastMoves){
  return pastMoves.reduce(function(accum,element){return accum + (element === null? 0:1);},0);

}

function canIWin(pastMoves){
  console.log("starting can I win");
    for (var j in possibilities){
      var lineSum = possibilities[j].reduce(function(accum,element){return accum + (pastMoves[element] === 'X'? 1:pastMoves[element]==='O'?-1:0);},0);
      console.log("line: " + lineSum + " for " + possibilities[j]);
      if (lineSum > 1){
        for (var x in possibilities[j]){
          if (pastMoves[possibilities[j][x]] === null){return possibilities[j][x];};
        }
      }
    }
    return -1;
}

function canILose(pastMoves){
    for (var j in possibilities){
      var lineSum = possibilities[j].reduce(function(accum,element){return accum + (pastMoves[element] === 'O'? -1:pastMoves[element] === 'X'?1:0);},0);
      if (lineSum < -1){
        for (var x in possibilities[j]){
          if (pastMoves[possibilities[j][x]]===null){return possibilities[j][x];};
        }
      }
    }
    return -1;
}

function thirdMove(pastMoves){
  console.log("third move");
  if (pastMoves[0] === 'O'){return 3;}
  if (pastMoves[1] === 'O'){return 0;}
  if (pastMoves[2] === 'O'){return 1;}
  if (pastMoves[3] === 'O'){return 0;}
  if (pastMoves[5] === 'O'){return 8;}
  if (pastMoves[6] === 'O'){return 7;}
  if (pastMoves[7] === 'O'){return 8;}
  return 5;

}

function fourthMove(pastMoves){
  console.log('fourth Move');
  if (pastMoves[4] === 'X'){
    if (pastMoves[0] === 'O' && pastMoves[8] === 'O'){return 5;}
    if (pastMoves[2] === 'O' && pastMoves[6] === 'O'){return 5;}
    if (pastMoves[1] === 'O' && pastMoves[7] === 'O'){return 5;}
    if (pastMoves[3] === 'O' && pastMoves[5] === 'O'){return 1;}
    if (pastMoves[1] === 'O' && pastMoves[5] === 'O'){return 2;}
    if (pastMoves[1] === 'O' && pastMoves[3] === 'O'){return 0;}
    if (pastMoves[3] === 'O' && pastMoves[7] === 'O'){return 6;}
    if (pastMoves[5] === 'O' && pastMoves[7] === 'O'){return 8;}
      if (pastMoves[1] === 'O' && pastMoves[8] === 'O'){return 2;}
      if (pastMoves[1] === 'O' && pastMoves[6] === 'O'){return 0;}

      if (pastMoves[3] === 'O' && pastMoves[2] === 'O'){return 0;}
      if (pastMoves[3] === 'O' && pastMoves[8] === 'O'){return 6;}

      if (pastMoves[7] === 'O' && pastMoves[0] === 'O'){return 6;}
      if (pastMoves[7] === 'O' && pastMoves[2] === 'O'){return 8;}

      if (pastMoves[5] === 'O' && pastMoves[0] === 'O'){return 2;}
      if (pastMoves[5] === 'O' && pastMoves[6] === 'O'){return 8;}
  }
  if (pastMoves[0] === 'X' && pastMoves[4] === 'O' && pastMoves[8] === 'O'){return 6;}
  console.log("I wasn't expecting this scenario");
  return -1;

} //end of fourth move

function fifthMove(pastMoves){
  if (pastMoves[1] === 'O' && pastMoves[8] === 'O'){return 2;}
  if (pastMoves[1] === 'O' && pastMoves[6] === 'O'){return 0;}

  if (pastMoves[3] === 'O' && pastMoves[2] === 'O'){return 0;}
  if (pastMoves[3] === 'O' && pastMoves[8] === 'O'){return 6;}

  if (pastMoves[7] === 'O' && pastMoves[0] === 'O'){return 6;}
  if (pastMoves[7] === 'O' && pastMoves[2] === 'O'){return 8;}

  if (pastMoves[5] === 'O' && pastMoves[0] === 'O'){return 2;}
  if (pastMoves[5] === 'O' && pastMoves[6] === 'O'){return 8;}


} //end of fifth Move

function sixthMove(pastMoves){
  var row0 = pastMoves[0] + pastMoves[1]+ pastMoves[2];
  var row2 = pastMoves[6] + pastMoves[7]+ pastMoves[8];
  var col0 = pastMoves[0] + pastMoves[3]+ pastMoves[6];
  var col2 = pastMoves[2] + pastMoves[5]+ pastMoves[8];

  if (row0 === 'O' && col0 === 'O' && pastMoves[0] === null){return 0;}
  if (row0 === 'O' && col2 === 'O' && pastMoves[2] === null){return 2;}

  if (row2 === 'O' && col0 === 'O' && pastMoves[6] === null){return 6;}
  if (row2 === 'O' && col2 === 'O' && pastMoves[8] === null){return 8;}
  return chooseSomething(pastMoves);

} //end of sixth Move

function chooseSomething(pastMoves){
  console.log(pastMoves);
  var leftovers = pastMoves.map(function(element,index){return element === null?index:-1;});
  console.log("1: " + leftovers);
  leftovers = leftovers.filter(function(element,index){return (element != -1);});
  console.log("2: " + leftovers);
  var choice = leftovers[parseInt(Math.random()*leftovers.length)];
  console.log("choosing: " + choice);
  return choice;
}

ReactDOM.render(
  <TTT/>,
  document.getElementById('root')
);
