import { IB2D, Preload } from "../blitz/blitz"
import { GameState } from "../game_state"
import { Gato } from "./gato"
import { FILTRO_SOLIDO } from "./tileMap"
import { coin, constrain, dice, diff } from "./util"

let sprite

Preload( async b =>{
    sprite = await b.LoadImage("fakePombo.png")
})

const PARADO = 0
const ANDANDO = 1
const FUGINDO = 2
const VOANDO = 3
const POUSANDO = 4

const estados = [
    "parado",
    "fugindo",
    "voando",
    "pousando"
]

const POMBO_WIDTH = 32
const POMBO_HEIGHT = 32

class Pombo {
    grounded = false
    ceiled = false
    state = POUSANDO
    dead = false
    x = 96
    y = 320
    flightTime = 0
    // por quantos frames o pombo vai voar?
    willFlyFor = 0
    // por quantos frames o pombo vai andar?
    willWalkFor = 0
    sx = 0
    sy = 0
    timer = 0

    // blerg

    /** @type {Gato} */
    static gato

    /** @param {GameState} s */
    static procurarOGato(s){
        return Pombo.gato ?? (
            ()=>{
                for(let obj of s._alives)
                    if(obj instanceof Gato)
                        return obj
                // caso o pombo seja "Instanciado" sem nenhum gato na tela, ele vai tentar
                // fugir do ponto 0,0
                return {
                    x : 0,
                    y : 0,
                    sx : 0
                }
            }
        )()
    }

    constructor(x,y){
        this.x = x
        this.y = y
    }
    /** @param {GameState} s */
    update(s){
        // esse pombo tem que parecer um pombo.
        switch(this.state){
            case PARADO:
                if(this.timer++ >= 120){
                    this.timer = 0
                    let num = dice(3)
                    switch(num){
                        case 0:
                            if (coin()){
                                this.state = ANDANDO
                                this.willWalkFor = dice(3) * 10
                                this.sx = coin() ? 2 : -2    
                            }        
                        break;
                        case 1:
                            this.state = FUGINDO
                            this.sx = coin() ? 1 : -1
                        break;
                        default:
                            // .......
                    }
                }
            break;
            case ANDANDO:
                if(++this.timer >= this.willWalkFor){
                    this.timer = 0
                    this.state = PARADO;
                }
            break;
            case POUSANDO:
                this.sy += 0.1
                if(this.timer++ >= 5){
                    if(dice(10) > 8){
                        this.sx = coin() ? 1 : -1
                        this.state = VOANDO
                        this.willFlyFor = 5 + dice(5)*30
                    }
                    this.timer = 0 
                }
                if(this.grounded){
                    this.state = PARADO
                    this.sx = 0.0                    
                    this.timer = 0
                }
            break;
            case VOANDO:
                this.sy = Math.sin(this.flightTime+=0.1)
                if(++this.timer >= this.willFlyFor || this.ceiled){
                    this.timer = 0
                    this.state = POUSANDO
                }
                if(this.grounded){
                    this.state = PARADO
                    this.timer = 0 
                    this.sx = 0
                }            
            break;
            case FUGINDO:
                // se não fizer isso, ele vai estar "grounded", e quando
                // ele está grounded, o estado dele muda pra parado
                // caso ele esteja no ar.
                this.sy -= 0.3
                if(this.ceiled){
                    this.state = POUSANDO
                    this.timer = 0
                    break;
                }
                if(++this.timer >= 60){
                    this.timer = 0
                    this.state = VOANDO
                    this.sy = 0
                    this.willFlyFor = (5 + dice(5))*60
                }
            break;
        }



        this.sy += 0.2
        this.y += this.sy
        // tocando no chão/teto
        let out = [0,0,0,0]
        if(s.tileMap.objectCollides(
            [this.x,this.y,POMBO_WIDTH,POMBO_HEIGHT],
            out,
            FILTRO_SOLIDO
        )!==-1){
            // tava descendo, então vou estar grounded.
            this.ceiled = this.sy < 0
            this.grounded = this.sy >= 0
            this.y += this.sy < 0 ? out[3] : -out[3]
            this.sy = 0
        }else{
            this.grounded = false
            this.ceiled = false
        }

        this.x += this.sx
        if(s.tileMap.objectCollides(
            [this.x,this.y,POMBO_WIDTH,POMBO_HEIGHT],
            out,
            FILTRO_SOLIDO
        )!==-1){
            this.x += this.sx > 0 ? -out[2] : out[2]
            this.sx *= -1
        }

        // foge do gato
        if(this.state == PARADO || this.state == ANDANDO){
            let gato = Pombo.procurarOGato(s)
            if( diff(this.x, gato.x) < 128 &&
                diff(this.y, gato.y) < 128 && 
                Math.abs( gato.sx ) >= 4){
                this.state = FUGINDO
                this.timer = 0
                this.willFlyFor = 0
                this.sy = 0
                // gato ta na direita, vou pra esquerda
                this.sx = gato.x > this.x ? -3 : 3
            }    
        }
        // acelera
        if(this.state == VOANDO ||
            this.state == FUGINDO ){
                this.sx = constrain( this.sx + Math.sign(this.sx)*0.1, -4,4)
        }       
    }

    /**
     * @param {IB2D} b
     * @param {GameState} s
     */
    render(b,s){
        b.SetScale(1,1)
        b.DrawImage(sprite,
            this.x - s.screen.cameraX,
            this.y - s.screen.cameraY
        )
    }
}


export { Pombo, sprite }