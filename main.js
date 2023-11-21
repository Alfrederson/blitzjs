
import {
  Graphics,
  DrawImage,
  Start,
} from "./blitz/blitz.js"
import { AttachInput, MouseX, MouseY } from "./blitz/input.js"

import GameState from "./game_state"

class PigGame {
  gameState = new GameState()

  setup(){
    Graphics(800,600,"game")
    AttachInput(800,600,"game")
  }

  draw(){
    this.gameState.update()
    this.gameState.render()

    // @ts-ignore
    document.getElementById("debug").innerText = `${MouseX()} ${MouseY()}`
  }

}

Start( new PigGame() )