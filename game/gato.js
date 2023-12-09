import { 
    IB2D,
    Preload
} from "../blitz/blitz";
import {
    OnTouchStart,
    OnTouchMove,
    OnTouchEnd,

    ClearTouchStart,
    ClearTouchMove,
    ClearTouchEnd
} from "../blitz/input"

let sprite

let nubSprite

Preload( async b =>{
    sprite = await b.LoadImage("gato.png")
    nubSprite = await b.LoadImage("nub.png")

})

class Nub{
    x = 0
    y = 0
    dx = 0
    dy = 0
    length = 32
    touch = -1
    constructor(_x,_y){
        this.x = _x
        this.y = _y
        this.dx = _x
        this.dy = _y
        this.touch = -1
    }
    getX(){
        return Math.min(Math.max( this.dx - this.x, -this.length ), this.length )
    }
    getY(){
        return Math.min(Math.max( this.dy - this.y, -this.length ), this.length )
    }

    render(b){
        let x = Math.max( Math.min( this.x + this.length, this.dx), this.x - this.length )
        let y = Math.max( Math.min( this.y + this.length, this.dy), this.y - this.length )
        b.DrawImage( nubSprite, x, y)
    }

    touching(x,y){
        return Math.abs( x - this.x) <= 16 && Math.abs( y - this.y) <= 16    
        
    }
}

const nubWalk = new Nub(64,300)
const nubJump = new Nub(1060-64,300)

class Gato {

    grounded = false
    
    x = 128
    y = 64

    walktoX = 128

    sx = 0
    sy = 0

    dead = false

    touchStartHandler
    touchMoveHandler
    touchEndHandler

    constructor(){
        // gatinho começa a andar
        this.touchStartHandler = OnTouchStart( touches =>{
            for(let i = 0; i < touches.length; i ++){
                let {x,y,n} = touches[i]
                // vê se está perto do nub que faz o gatinho andar...
                if( nubWalk.touching(x,y) ){
                    nubWalk.touch = n
                }
                // vê se está perto do nub que faz o gatinho pular...
                if( nubJump.touching(x,y) ){
                    nubJump.touch = n
                }
                            }
        })

        this.touchMoveHandler = OnTouchMove( touches =>{ 
            for(let i = 0; i < touches.length; i++){
                // direção do gatinho
                let {x,y,n} = touches[i]
                if(n == nubWalk.touch){
                    nubWalk.dx = x
                }
                if(n == nubJump.touch){
                    nubJump.dy = y
                    nubJump.dx = x
                }
            }
        })
        
        this.touchEndHandler = OnTouchEnd( touches =>{
            for(let i =0; i < touches.length; i++){
                // gatinho para de andar
                if(touches[i].n == nubWalk.touch){
                    nubWalk.touch = -1
                    nubWalk.dx = nubWalk.x
                }
                if(touches[i].n == nubJump.touch){
                    if(this.grounded){
                        this.sy = -0.4*nubJump.getY()
                        this.sx = -0.9*nubJump.getX()    
                    }

                    nubJump.touch = -1
                    nubJump.dy = nubJump.y
                    nubJump.dx = nubJump.x
                    // faz o gatinho pular
                }
            }
        })        
    }

    update (s){

        // gato no chão
        if(this.y >= s.screen.height-16){
            this.grounded=true
            if(nubWalk.touch!==-1){
                this.sx += 0.4 * nubWalk.getX()
            }else{
                this.sx *= 0.9
            }
        }else{
            this.grounded=false
        }

        if(this.sx >= 4)
            this.sx = 4
        if(this.sx <= -4)
            this.sx = -4

        this.sy += 0.2

        this.x += this.sx
        this.y += this.sy

        if(this.y >= s.screen.height-16){
            this.y = s.screen.height-16
        }
    }

    /**
     * @param {IB2D} b
     */
    render(b){
        b.DrawImage( sprite, this.x, this.y )
    }

    /**
     * @param {IB2D} b
     */
    renderUi(b){
        // o nub tem que ficar dentro de uma certa área
        nubWalk.render(b)
        nubJump.render(b)
    }
}

export { Gato }