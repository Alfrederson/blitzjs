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
} from "./blitz/input.js"

import { GameState } from "./game_state"
import * as flags from "./game/flags.js"

import * as Level0 from "./game/levels/0/level.js"

document.URL

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT
} from "./config.js"


/** @implements {IApp} */
class CatGame {
  gameState = new GameState()

  /** @param {IB2D} b */
  setup(b) {
    b.Graphics(SCREEN_WIDTH, SCREEN_HEIGHT, "game")
    AttachInput(SCREEN_WIDTH, SCREEN_HEIGHT, "game")

    this.gameState.screen.width = SCREEN_WIDTH
    this.gameState.screen.height = SCREEN_HEIGHT

    Level0.Load( this.gameState )
  }

  /** @param {IB2D} b */
  draw(b) {
    this.gameState.update()
    this.gameState.render(b)
  }
}


flags.Load()

console.log("Cleared levels: ")
console.log(flags.flags.clearedLevels)

Start(new CatGame(), new WGL_B2D())

/** 
 * @typedef {Object} AndroidHost 
 * @property {function(string):void} toast
 */

/**@type {AndroidHost} */
let host

// @ts-ignore fonte: confia 👍
if(host = window.Host){
  host.toast("Mensagem de dentro do javascripto!")
}

// @ts-ignore
window.tete = function(){
  alert("tete")
}

export {
  SCREEN_WIDTH,
  SCREEN_HEIGHT
}