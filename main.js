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

import { Gato } from "./game/gato.js"
import { Nub } from "./game/nub.js"
import { Pombo } from "./game/pombo.js"

const SCREEN_WIDTH = 800
const SCREEN_HEIGHT = 500


/** @implements {IApp} */
class CatGame {
  gameState = new GameState()
  touchStartHandler
  touchMoveHandler
  touchEndHandler
  gato = new Gato()
  nubWalk = new Nub(64, SCREEN_HEIGHT/2)
  nubJump = new Nub(SCREEN_WIDTH - 64, SCREEN_HEIGHT/2)

  setupInput() {
    // gatinho começa a andar
    this.touchStartHandler = OnTouchStart(touches => {

      for (let i = 0; i < touches.length; i++) {
        let { x, y, n } = touches[i]
        // vê se está perto do nub que faz o gatinho andar...
        if (this.nubWalk.touching(x, y)) {
          this.nubWalk.touch = n
        }
        // vê se está perto do nub que faz o gatinho pular...
        if (this.nubJump.touching(x, y)) {
          this.nubJump.touch = n
        }
      }
    })

    this.touchMoveHandler = OnTouchMove(touches => {
      for (let i = 0; i < touches.length; i++) {
        // direção do gatinho
        let { x, y, n } = touches[i]
        if (n == this.nubWalk.touch) {
          this.nubWalk.dx = x
        }
        if (n == this.nubJump.touch) {
          this.nubJump.dy = y
          this.nubJump.dx = x
        }
      }
    })

    this.touchEndHandler = OnTouchEnd(touches => {
      for (let i = 0; i < touches.length; i++) {
        // gatinho para de andar
        if (touches[i].n == this.nubWalk.touch) {
          this.nubWalk.release()
        }
        // faz o gatinho pular se a gente solta o nub da direita
        if (touches[i].n == this.nubJump.touch) {
          this.nubJump.release()
        }
      }
    })

  }

  /** @param {IB2D} b */
  setup(b) {

    this.gameState.screen = {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT
    }

    const { width, height } = this.gameState.screen

    b.Graphics(width, height, "game")
    AttachInput(width, height, "game")

    this.setupInput()

    this.gameState.spawn( this.gato )
    this.gameState.spawn( new Pombo() )
  }

  /** @param {IB2D} b */
  draw(b) {
    if (this.nubWalk.touch !== -1) {
      this.gato.walk(this.nubWalk.getX())
    } else {
      this.gato.stop()
    }
    if (this.nubJump.released()) {
      this.gato.pounce(-0.3 * this.nubJump.releasedX, -0.3 * this.nubJump.releasedY)
    }
    this.gameState.update()

    b.Cls(255,255,255)
       
    this.gameState.render(b)


    this.nubJump.render(b)
    this.nubWalk.render(b)
  }

}

Start(new CatGame(), new WGL_B2D())