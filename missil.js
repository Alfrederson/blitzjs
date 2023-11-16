import { LoadImage, DrawImage, Preload } from "./blitz/blitz"

import GameState from "./game_state"

let sprite

Preload(()=>{
  sprite = LoadImage("missil.png")
})

export default class {
    dead = false
    x = 0
    y = 0
    sx = 0
    sy = 0
    fuse = 15

    /** @param {GameState} state */
    update(state){
      if(this.x >= 800-32 || this.x <= 32 || this.y >= 600){
        state.kill(this)
        return 
      }

      if(this.fuse > 0){
        this.fuse--
      }else{
        this.sy += 1.5
      }

      this.x += this.sx
      this.y += this.sy
    }

    render(){
      DrawImage( sprite, this.x, this.y )
    }

    initialize(){

    }
}