class Game {
    constructor(id, whitePlayer, blackPlayer, winner, draw, moves) {
        this.id = id;
        this.white = whitePlayer;
        this.black = blackPlayer;
        this.winner = winner;
        this.draw = draw;
        this.moves = [...moves];
    }
}

module.exports = { Game }