import { IB2D, Preload } from "./blitz/blitz";
import { GameState } from "./game_state";

import { MouseX, MouseY, MouseDown, MouseSpeedX, MouseSpeedY } from "./blitz/input";

let sprite
Preload( async b =>{
    sprite = await b.LoadAnimImage("tiles.png",32,32)
})

class Tiles {
    dead = false
    lit = 0
    ticker = 0

    sx = 0
    sy = 0
    x = 16
    y = 16

    holding = false

    /** @param {GameState} state */
    update(state){
        if( 
            MouseDown(0) &&
            (MouseX() >= this.x-16) && 
            (MouseX() <= this.x+16) &&
            (MouseY() >= this.y-16) && 
            (MouseY() <= this.y+16) &&
            this.holding == false
        ){
            this.lit = 1
            this.holding = true
        }

        if(!MouseDown(0) && this.holding == true){
            this.lit = 0
            this.holding = false
        }

        if(this.holding){
            this.sx = (MouseX() - this.x) * 0.1
            this.sy = (MouseY() - this.y) * 0.1   
        }else{
            this.sx *= 0.95
            this.sy *= 0.95
        }

        this.sy += 0.4
        this.x += this.sx
        this.y += this.sy

        if(this.y >= 600-16){
            this.sy *= -0.95
            this.y -= (this.y - (600-16))
        }
    }
    /**
     * 
     * @param {IB2D} b 
     */
    render(b){
        b.DrawImageFrame( sprite, this.x|0,this.y|0, this.lit )
    }
}

export default Tiles;