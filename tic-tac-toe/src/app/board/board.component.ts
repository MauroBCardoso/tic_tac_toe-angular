import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  squares: string[];
  filledSquares: number;
  xIsNext: boolean;
  winner: string;
  draw: boolean;

  constructor() {}

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
    this.draw = false;
    this.filledSquares = 0;
    this.bestMove(this.squares);
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number) {
    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
      this.filledSquares++;
    }

    this.winner = this.calculateWinner();

    if(this.filledSquares==9 && this.winner == null)
    this.draw = true;

    this.bestMove(this.squares);

    this.winner = this.calculateWinner();

    if(this.filledSquares==9 && this.winner == null)
    this.draw = true;

  }

  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }

   bestMove(game) {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        // Is the spot available?
        if (game[i] == null) {
          game[i] = this.player;
          let score = this.minimax(game, 0, false);
          game[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }

      }
    }
    this.squares.splice(move, 1, this.player);
    this.xIsNext = !this.xIsNext;
    this.filledSquares++;
  }

   minimax(game, depth, isMaximizing) {
    let scores = {
      X: 10,
      O: -10,
    };
    let result = this.calculateWinner();
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
          // Is the spot available?
          if (game[i] == null) {
            game[i] = "X";
            let score = this.minimax(game, depth + 1, false);
            game[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
          // Is the spot available?
          if (game[i] == null) {
            game[i] = 'O';
            let score = this.minimax(game, depth + 1, true);
            game[i] = null;
            bestScore = Math.min(score, bestScore);
          }
      }
      return bestScore;
    }
  }
}
