import { IB2D, Preload } from "../blitz/blitz"
import { GameState } from "../game_state"
import { constrain, rectsIntersect } from "./util"



let tileset

const NADA      = 0
const SOLIDO    = 0b0000_0001
const BEIRA     = 0b0000_0010
const INVISIVEL = 0b0000_0100
// [sólido, beirada]
const tileInfo = [
    INVISIVEL,   // 0
    SOLIDO,
    BEIRA | INVISIVEL,
    SOLIDO,
    SOLIDO,
    SOLIDO,
    SOLIDO,
    SOLIDO,
    NADA,
    SOLIDO,
    SOLIDO,
    SOLIDO
]

const TILE_WIDTH = 32
const TILE_HEIGHT = 32

Preload(async b => {
    tileset = await b.LoadAnimImage("tiles.png",TILE_WIDTH,TILE_HEIGHT)
})
  
class TileMap {
    tiles= [[0]]

    /**
     * @param {string} from
     */
    Load(from){
        this.tiles = from.split("\n").map(
            line => line.split("").map(
                letra => letra == " " ? 0 : parseInt(letra)
            )
        )
        this.width = this.tiles[0].length
        this.height = this.tiles.length
    }

    width = 1
    height = 1
    constructor(){

    }
    /**
     * @param {IB2D} b 
     * @param {GameState} s
     */
    render (b,s){
        let fromX = Math.floor(s.screen.cameraX / TILE_WIDTH)
        let toX = fromX + Math.ceil(s.screen.width / TILE_WIDTH)
        let fromY = Math.floor(s.screen.cameraY / TILE_WIDTH)
        let toY = fromY + Math.ceil(s.screen.height / TILE_HEIGHT)

        fromX = constrain(fromX,0,this.width)
        toX = constrain(toX+1,0,this.width)
        fromY = constrain(fromY,0,this.height)
        toY = constrain(toY+1,0,this.height)

        b.SetScale( 1 ,1)
        b.SetColor(1,1,1,1)
        b.SetAngle(0)        

        for(let y = fromY; y < toY; y++){
            for(let x = fromX; x < toX; x++){
                if(!(tileInfo[this.tiles[y][x]] & INVISIVEL)){
                    b.DrawImageFrame(
                        tileset,
                        x*TILE_WIDTH - s.screen.cameraX,
                        y*TILE_HEIGHT - s.screen.cameraY,
                        this.tiles[y][x]-1
                    )
                }
            }
        }
    }

    fromX = 0
    toX = 0
    fromY = 0
    toY = 0
    /**
     * retorna o número do tile com o qual um objeto colide, ou -1 caso não colida.
     * @param {number[]} obj - é um retângulo representado como array [x,y,w,h] 
     * @param {number[]} out - é uma array que recebe a intersecção, caso haja , no formato [x,y,w,h]
     * @param {number} filtro - uma combinação de filtros (SOLIDO, BEIRA, etc)
     */
    objectCollides(obj, out, filtro){
        const [x,y,w,h] = obj
        // testar só os tiles próximos...

        let fromX = (x - w/2)/TILE_WIDTH
        let toX   = (x + w/2)/TILE_WIDTH
        let fromY = (y - h/2)/TILE_HEIGHT
        let toY   = (y + h/2)/TILE_HEIGHT

        fromX = constrain(fromX-2, 0, this.width)|0
        toX = constrain(toX+2, 0, this.width)|0
        fromY = constrain(fromY-2, 0, this.height)|0
        toY = constrain(toY+2,0, this.height)|0

        // testa os tiles...
        for(let x = fromX; x < toX; x++){
            for(let y = fromY; y < toY; y++){
                if(!(tileInfo[this.tiles[y][x]] & filtro))
                    continue
                // esse tile...
                const tileRect = [x*TILE_WIDTH,y*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT]
                // checa se colide...
                if( rectsIntersect(tileRect, obj, out) )
                    return this.tiles[y][x]
            }
        }
        return -1
    }
}


export {
    TileMap,
    tileInfo,
    BEIRA as FILTRO_BEIRA,
    SOLIDO as FILTRO_SOLIDO
}