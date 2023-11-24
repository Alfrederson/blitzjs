
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

  angulo = 0

  /** @param {IB2D} b */
  setup(b){
    b.Graphics(600,800,"game")
    AttachInput(600,800,"game")
  }

  /** @param {IB2D} b */
  draw(b){
    this.angulo += 0.01
    b.SetAngle(this.angulo)
    this.gameState.update()
    this.gameState.render(b)

    // @ts-ignore
    document.getElementById("debug").innerText = `${MouseX()} ${MouseY()}`
  }

}

Start( new PigGame(), new WGL_B2D() )