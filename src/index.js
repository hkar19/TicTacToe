import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// ACHIEVEMENT:
// 1. Displayed the location for each move in the format (col, row) in the move history list.
// 2. Bold the currently selected item in the move list.
// 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
// 4. Add a toggle button that lets you sort the moves in either ascending or descending order. (10Dec'19)
// 5. When someone wins, highlight the three squares that caused the win. (11Dec'19)
// 6. When no one wins, display a message about the result being a draw. (11Dec'19)

class Square extends React.Component {
  render() {
    const boldness = this.props.isLastMove||this.props.isWinningLines ? {fontWeight:'bold'}: {fontWeight:'normal'};
    // console.log(boldness);
    return (
      <button
        className="square"
        onClick={()=> this.props.onClick()}
        style= {boldness}
      >
        {this.props.value}
      </button>

    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    const lastMove = this.props.prevMove[this.props.prevMove.length-1];
    const col = lastMove[0];
    const row = lastMove[1];
    const aNumber = row*3+col;
    const isLastMove = (i===aNumber);
    const isWinningLines = this.props.winningLine ? (this.props.winningLine[0]===i||this.props.winningLine[1]===i||this.props.winningLine[2]===i):false;

    return <Square
             value={this.props.squares[i]}
             onClick={()=>this.props.onClick(i)}
             isLastMove = {isLastMove}
             isWinningLines= {isWinningLines}
             key={i}
             />;
  }

  render() {
    var rows =[[]];
    for(let i=0;i<3;i++){
      var cols=[];
      for(let j=0;j<3;j++){
        cols.push(this.renderSquare(i*3+j));
        // console.log("nilai i dan j adalah "+i+" "+j);
      }
      rows.push(<div className="board-row" key={i}>{cols}</div>);
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      history: [{
        squares: Array(9).fill(null),
        }],
      xIsNext: true,
      stepNumber: 0,
      prevMove: [[null,null]],
      isAscending: true,
    }
  }

  changeOrder(){
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  handleClick(i){

    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    const prevMove = this.state.prevMove.slice(0,this.state.stepNumber+1);

    const col = i%3;
    const row = Math.floor(i/3);
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X':'O';
    this.setState({
      history : history.concat([
        {squares: squares},
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      prevMove: prevMove.concat([[col,row]]),
      });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) ===0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)[0];
    const winningLine = calculateWinner(current.squares)[1];
    const prevMove = this.state.prevMove.slice(0,this.state.stepNumber+1);
    // console.log(prevMove);

    const Ascending = this.state.isAscending ? 'ascending':'descending';

    const Moves=[];
    if(this.state.isAscending){
      for(let i = 0;i<history.length;i++){
        const Desc = i ? ('Go to move #'+i+' '+ ((i%2)===1 ? 'X ':'O ')+' on '+this.state.prevMove[i]) : ('Go to game start');
        Moves.push(
          <li key={i}>
            <button onClick= {()=> this.jumpTo(i)}>
              {Desc}
            </button>
          </li>
        );
      }
    }
    else{
      for(let i = history.length-1;i>=0;i--){
        const Desc = i ? ('Go to move #'+i+' '+ ((i%2)===1 ? 'X ':'O ')+' on '+this.state.prevMove[i]) : ('Go to game start');
        Moves.push(
          <li key={i}>
            <button onClick= {()=> this.jumpTo(i)}>
              {Desc}
            </button>
          </li>
        );
      }
    }

    let Status;
    if (winner) {
      Status = 'Winner: ' + winner;
    }
    else if (this.state.stepNumber ===9) {
      Status = 'It is DRAW';
    }
    else {
      Status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            prevMove={prevMove}
            winningLine={winningLine}
            />
        </div>
        <div className="game-info">
          <div>{Status}</div>
          <button onClick={()=>this.changeOrder()}>{Ascending}</button>
          <ul>{Moves}</ul>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
  // will return an array of two
  // [0] is for the winning squares
  // [1] is for the winning lines
  const lines = [ //winning lines
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],lines[i]];
    }
  }

  return [null,null];
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
