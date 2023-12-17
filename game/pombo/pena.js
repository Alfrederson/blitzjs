import { IB2D, Preload } from "../../blitz/blitz"
import { GameState } from "../../game_state"
import { coin } from "../util"

let sprite

Preload(async b =>{
    sprite = await b.LoadImage("pena.png")
})

class Pena {

    timer = 0

    angle = 0
    coin = 1
    dead = false
    x = 0
    sx = 0
    sy = 0
    y = 0

    constructor({x,y, sx,sy}){
        this.x = x 
        this.y = y
        this.sx = sx
        this.sy = sy
        this.flip = coin() ? 1 : -1
    }


    /** @param {GameState} s */
    update(s){
        this.sy += 0.05
        this.y += this.sy
        this.sx *= 0.999
        this.angle = Math.cos( this.timer * 0.2 ) * 0.3
        this.sx += Math.cos( this.timer * 0.1 ) * 0.1

        this.x += this.sx
        
        if(++this.timer >= 60){
            this.dead = true
        }
    }


    /**
     * 
     * @param {IB2D} b
     * @param {GameState} s 
     */
    render(b,s){
        b.SetScale(this.flip,1)
        b.SetAngle(this.angle)
        // fazer alguma coisa pra remover esse monte de .cameraX?
        b.SetColor(1,1,1, 1 - this.timer / 60)

        b.DrawImage(sprite, this.x, this.y)
    }
}

export { Pena }