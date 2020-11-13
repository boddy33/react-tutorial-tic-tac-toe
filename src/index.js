import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button className={'square' + (props.highlight ? ' highlight' : '')} onClick={props.onClick}>
          {props.value}
        </button>
      );
  }

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sortAsc: true};
  }

  handleClick = () => this.setState( {sortAsc: !this.state.sortAsc});

  render () {
    console.log('History.props.moves', this.props.moves);
    const props = this.props;
    if (props.moves.length === 0) {
      return null;
    }

    let buttonList = props.moves.map((move, index) => {
      const desc = (index > 0) ?
        'Undo Move #' + (index + 1) :
        'Reset Game';

      let extendedHistory = (index % 2 === 0) ?  ' X at ' : ' O at ';
        extendedHistory += moveToLocation(move.lastMove);

      return (
        <li key={index}>
          <button className='history-button' onClick={() => props.jumpTo(index)}>{desc}</button>
          {extendedHistory}
        </li>
      );
    });

    if (!this.state.sortAsc) {
      buttonList = buttonList.reverse();
    }

    return (
      <div className="history">
        <button className="history-sort-button" onClick={this.handleClick}>History (click to sort)</button>
        <ol>{buttonList}</ol>
      </div>
    );
  }
}
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          highlight={this.props.highlightSequence.includes(i)}
        />
      );
    }
  
    render() {
      console.log('Board.props.highlightSequence', this.props.highlightSequence);
      return (
        <div className="board">
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          lastMove: null,
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    jumpTo(step) {
      console.log('jumpTo step', step);
      const history = this.state.history.slice(0, step + 1);
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        history
      });
    }

    handleClick(i) {
      console.log('handleClick i', i);
      
      const history = this.state.history;
      const current = history[history.length - 1];
      current.lastMove = i;
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState ({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    render() {
      console.log('Game.state.stepNumber', this.state.stepNumber);

      const history = this.state.history;
      console.log('Game.state.history', this.state.history);  

      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const winnerPlayer = winner ? winner.player : null;
      const winnerSequence = winner ? winner.sequence : null;

      const pastMoves = history.slice(0, -1);

      let statistics = null;
      let moveStatus = null;
      let playerStatus = null;
      let winnerStatus = null;

      if (winnerPlayer) {
        moveStatus = 'Last move #' + this.state.stepNumber;
        winnerStatus = 'Winner: ' + winnerPlayer
      } else if (this.state.stepNumber === 9) {
        moveStatus = 'Last move #' + this.state.stepNumber;
        winnerStatus = "It's a draw!";
      } else {
        moveStatus = 'Move #' + this.state.stepNumber;
        playerStatus = 'Player:' + (this.state.xIsNext ? 'X' : 'O'); 
      }

      statistics = 
      (
        <div>
          <b><i>Game Statistics</i></b><br/><br/>
          {moveStatus}<br/><br/>
          {playerStatus}
          <b>{winnerStatus}</b>
        </div>
      );

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              highlightSequence={(winnerSequence || [])}
            />
            <History moves={pastMoves} jumpTo={(step) => this.jumpTo(step)}/>
          </div>
          <div className="game-info">
            <div>{statistics}</div>
            
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    let winner = null;

    const lines = [
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
        winner = {};
        winner.player = squares[a];
        winner.sequence = lines[i];
        return winner;
      }
    }
    return winner;
  }

  
  function moveToLocation(i) {
      switch(i) {
        case 0: return '(1, 1)';
        case 1: return '(1, 2)';
        case 2: return '(1, 3)';
        case 3: return '(2, 1)';
        case 4: return '(2, 2)';
        case 5: return '(2, 3)';
        case 6: return '(3, 1)';
        case 7: return '(3, 2)';
        case 8: return '(3, 3)';
        default: return null;
      }
  }