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
const SCREEN_HEIGHT = 800/1.777


/** @implements {IApp} */
class CatGame {
  gameState = new GameState()
  touchStartHandler
  touchMoveHandler
  touchEndHandler
  gato = new Gato()
  nubWalk = new Nub(64, SCREEN_HEIGHT * 0.75)
  nubJump = new Nub(SCREEN_WIDTH - 64, SCREEN_HEIGHT * 0.75)

  setupInput() {
    const nubs = [this.nubWalk, this.nubJump]
    // gatinho começa a andar
    this.touchStartHandler = OnTouchStart(touches => {
      for (let i = 0; i < touches.length; i++) {
        let { x, y, n } = touches[i];
        for(let nub of nubs){
          if(nub.touching(x,y)){
            nub.press(x,y,n)
            continue
          }
        }
      }
    })

    this.touchMoveHandler = OnTouchMove(touches => {
      for (let i = 0; i < touches.length; i++) {
        // direção do gatinho
        let { x, y, n } = touches[i]
        if (n == this.nubWalk.touch) {
          this.nubWalk.move(x,y)
          this.nubWalk.dy = 0
        }
        if (n == this.nubJump.touch) {
          this.nubJump.move(x,y)
        }
      }
    })

    this.touchEndHandler = OnTouchEnd(touches => {
      for (let i = 0; i < touches.length; i++) {
        for(let nub of nubs){
          if(touches[i].n == nub.touch){
            nub.release()
          }
        }
      }
    })
  }

  /** @param {IB2D} b */
  setup(b) {

    this.gameState.screen = {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      cameraX: SCREEN_WIDTH / 2,
      cameraY: SCREEN_HEIGHT / 2
    }

    const { width, height } = this.gameState.screen

    b.Graphics(width, height, "game")
    AttachInput(width, height, "game")

    this.setupInput()

    this.gameState.spawn( this.gato )
 
    for(let x = 0; x < this.gameState.tileMap.width; x++){
      for(let y = 0; y < this.gameState.tileMap.height-1; y++){
        if(this.gameState.tileMap.tiles[y][x] == 0 && this.gameState.tileMap.tiles[y+1][x]!==0){
          if(Math.random()>=0.85){
            this.gameState.spawn( new Pombo(x * 32 + 16, y * 32 + 16))
          }
        }
      }
    }
  }

  /** @param {IB2D} b */
  draw(b) {

    // movimento normal
    if (this.nubWalk.touch !== -1) {
      this.gato.walk(this.nubWalk.getX())
    } else {
      this.gato.stop()
    }
    // pulando
    if (this.nubJump.released()) {
      this.gato.pounce(-0.3 * this.nubJump.releasedX, -0.3 * this.nubJump.releasedY)
    }
    // se pendurando
    if (this.gato.touchingLedge && this.nubJump.held()){
      this.gato.hang()
    }

    this.gameState.update()
    b.Cls(255,255,255)

    this.gameState.lookAt( this.gato.x - SCREEN_WIDTH/2, this.gato.y - SCREEN_HEIGHT/2 )
       
    this.gameState.render(b)

    this.nubJump.render(b)
    this.nubWalk.render(b)

  }

}

Start(new CatGame(), new WGL_B2D())