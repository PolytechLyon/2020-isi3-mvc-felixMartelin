import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL
} from "./constants";
import { initView, drawGame } from "./view";

export class Model {
  constructor() {
    this.width = GAME_SIZE;
    this.height = GAME_SIZE;
    this.raf = null;
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );
    DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
      this.state[y][x] = CELL_STATES.ALIVE;
    });
    this.updated();
    initView();
  }

  run(date = new Date().getTime()) {
    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      if (currentTime - date > RENDER_INTERVAL) {
        let tampon = Array.from(new Array(this.height), () =>
          Array.from(new Array(this.width), () => CELL_STATES.NONE)
        );
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            tampon[i][j] = this.state[i][j];
          }
        }
        for (let k = 0; k < this.width; k++) {
          for (let l = 0; l < this.width; l++) {
            const nbAlive = this.aliveNeighbours(k, l);
            if (
              (nbAlive < 2 || nbAlive > 3) &&
              tampon[k][l] === CELL_STATES.ALIVE
            ) {
              tampon[k][l] = CELL_STATES.DEAD;
            } else if (nbAlive === 3) {
              tampon[k][l] = CELL_STATES.ALIVE;
            }
          }
        }

        this.state = tampon;

        this.updated();
        this.run(currentTime);
      } else {
        this.run(date);
      }
    });
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  reset() {
    this.stop();
    this.init();
    this.updated();
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.height &&
      this.state[y][x] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }
  aliveNeighbours(x, y) {
    let number = 0;
    if (x > 0) {
      if (this.state[x - 1][y] === CELL_STATES.ALIVE) {
        number++;
      }
      if (y > 0) {
        if (this.state[x - 1][y - 1] === CELL_STATES.ALIVE) {
          number++;
        }
      }
      if (y < this.width - 1) {
        if (this.state[x - 1][y + 1] === CELL_STATES.ALIVE) {
          number++;
        }
      }
    }
    if (x < this.width - 1) {
      if (this.state[x + 1][y] === CELL_STATES.ALIVE) {
        number++;
      }
      if (y > 0) {
        if (this.state[x + 1][y - 1] === CELL_STATES.ALIVE) {
          number++;
        }
      }
      if (y < this.width) {
        if (this.state[x + 1][y + 1] === CELL_STATES.ALIVE) {
          number++;
        }
      }
    }
    if (y > 0) {
      if (this.state[x][y - 1] === CELL_STATES.ALIVE) {
        number++;
      }
    }
    if (y < this.width - 1) {
      if (this.state[x][y + 1] === CELL_STATES.ALIVE) {
        number++;
      }
    }
    return number;
  }

  updated() {
    drawGame(this);
  }
}
