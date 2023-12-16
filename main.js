import {
  WGL_B2D
} from "./blitz/webgl.js"

import {
  Start,
  IB2D,
  IApp,
  Preload
} from "./blitz/blitz.js"

import {
  AttachInput,
  MouseX,
  MouseY,
  OnTouchEnd,
  OnTouchMove,
  OnTouchStart
} from "./blitz/input.js"

import { GameState } from "./game_state"

import * as flags from "./game/flags.js"

import { Gato } from "./game/gato/gato.js"
import { Nub } from "./game/nub.js"
import { Pombo } from "./game/pombo/pombo.js"

import * as Level0 from "./game/levels/0/level.js"


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

export {
  SCREEN_WIDTH,
  SCREEN_HEIGHT
}