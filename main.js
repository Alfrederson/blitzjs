
import {
  WGL_B2D
} from "./blitz/webgl.js"

import {
  Start,
  IB2D,
  IApp,
} from "./blitz/blitz.js"
import { 
  AttachInput, 
  MouseX, 
  MouseY 
} from "./blitz/input.js"

import {GameState} from "./game_state"

/** @implements {IApp} */
class PigGame {
  gameState = new GameState()

  /** @param {IB2D} b */
  setup(b){
    b.Graphics(800,600,"game")
    AttachInput(800,600,"game")
  }

  /** @param {IB2D} b */
  draw(b){
    this.gameState.update()
    this.gameState.render(b)

    // @ts-ignore
    document.getElementById("debug").innerText = `${MouseX()} ${MouseY()}`
  }

}

Start( new PigGame(), new WGL_B2D() )