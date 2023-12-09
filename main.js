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
  MouseY 
} from "./blitz/input.js"

import {GameState} from "./game_state"

import { Gato } from "./game/gato.js"

let cursor

Preload(async b =>{
    cursor = await b.LoadImage("cursor.png")
})

/** @implements {IApp} */
class CatGame {
  gameState = new GameState()

  /** @param {IB2D} b */
  setup(b){

    this.gameState.screen = {
      width : 1066,
      height : 600
    }

    const {width,height} = this.gameState.screen 

    b.Graphics(width,height,"game")
    AttachInput(width,height,"game")

    this.gameState.spawn( new Gato() )
  }

  /** @param {IB2D} b */
  draw(b){
    this.gameState.update()
    this.gameState.render(b)
  }

}

Start(new CatGame(), new WGL_B2D() )