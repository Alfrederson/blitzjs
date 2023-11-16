
import {
  Graphics,
  Start,
} from "./blitz/blitz.js"

import GameState from "./game_state"

class PigGame {

  gameState = new GameState()

  setup(){
    Graphics(800,600,"game")
  }

  draw(){
    this.gameState.update()
    this.gameState.render()
  }

}

Start( new PigGame() )