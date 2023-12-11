import { IB2D, Preload } from "../blitz/blitz"
import { GameState } from "../game_state"

let sprite

Preload( async b =>{
    sprite = await b.LoadImage("pombo.png")
})

class Pombo {

    dead = false
    x = -32
    y = 40
    flightTime = 0

    /** @param {GameState} s */
    update(s){
        this.x += 2
        this.flightTime += 0.1
        this.y += Math.sin(this.flightTime)
        if(this.x >= s.screen.width + 32){
            this.x = -32
            this.y = 40
        }
    }

    /**
     * @param {IB2D} b
     * @param {GameState} s
     */
    render(b,s){
        b.DrawImage(sprite,
            this.x - s.screen.cameraX,
            this.y - s.screen.cameraY
        )
    }
}


export { Pombo }