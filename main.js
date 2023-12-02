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

import Tiles from "./tiles"

let cursor

Preload(async b =>{
    cursor = await b.LoadImage("cursor.png")
})

/** @implements {IApp} */
class PigGame {
  gameState = new GameState()

  coisa = new Tiles()

  angulo = 0

  /** @param {IB2D} b */
  setup(b){
    b.Graphics(600,800,"game")
    AttachInput(600,800,"game")
  }

  /** @param {IB2D} b */
  draw(b){
    this.coisa.update(this.gameState)

    this.gameState.update()
    this.gameState.render(b)

    this.coisa.render(b)

    b.DrawImage( cursor, MouseX()+16, MouseY()+16 )
  }

}

Start(new PigGame(), new WGL_B2D() )