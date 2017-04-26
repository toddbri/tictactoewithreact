import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class TTT extends React.Component{

  constructor(){
    super();
    let firstPlayer = Math.random() > .5 ? 'X': 'O';
    this.state = {
      currentPlayer : firstPlayer,
      board: [null,null,null,null,null,null,null,null,null],
      message: (firstPlayer === 'X') ? 'Player X goes first' : 'Player O goes first',
      gameOver: false
    }
  }

  select(index) {
    if (this.state.board[index] === null && !this.state.gameOver){
      let gameOver = false;
      this.state.board[index] = this.state.currentPlayer;
      this.state.currentPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';
      this.state.message = this.state.currentPlayer === 'X'? "Player X's turn": "Player O's turn";
      let winner = check4Winner(this.state.board);
      if (winner !== 0 ){
        this.state.message = 'Player ' + winner + ' has won the game';
        gameOver = true;
      }
      let openCells = this.state.board.reduce((accum,val)=>(accum + (val===null?1:0)),0);

      if (openCells === 0 ){gameOver = true;}
      if (openCells === 0 && winner === 0){gameOver = true;this.state.message = "It's a tie";}
      this.setState({
        board: this.state.board,
        currentPlayer: this.state.currentPlayer,
        message: this.state.message,
        gameOver: gameOver
      })
    }

  }
  restartGame (){
    let firstPlayer = Math.random() > .5 ? 'X': 'O';
    this.setState({
      currentPlayer : firstPlayer,
      board: [null,null,null,null,null,null,null,null,null],
      message: (firstPlayer === 'X') ? 'Player X goes first' : 'Player O goes first',
      gameOver: false
    });
  }

  render() {
    return (
    <div className="container">

        <div>Tic-Tac-Toe with React</div>
        <div className="board">
          {[0,1,2,3,4,5,6,7,8].map((idx) => <div onClick={() => this.select(idx)} className="cell">{this.state.board[idx]}</div>)}
        <div id="messageBoard">{this.state.message}</div>
        {this.state.gameOver ? <button onClick={() => this.restartGame()}>Play Again</button> : '' }


      </div>
    </div>
    )

  }
}
function check4Winner(pastMoves){

  var winner = 0;
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

ReactDOM.render(
  <TTT/>,
  document.getElementById('root')
);
