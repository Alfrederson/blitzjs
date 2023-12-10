import { IB2D, Preload } from "../blitz/blitz"
import { constrain, rectsIntersect } from "./util"

const tilesTxt = `
1                       1
1                       1
1                       1
1                       1
1         222222        1
1                       1
1                       1
1 22                 22 1
1                       1
1                       1
1   22             22   1
1                       1
1                       1
122222     22222222222221
122222     22222222222221
1111111111111111111111111
`.trim()

let tileset

const TILE_WIDTH = 32
const TILE_HEIGHT = 32

Preload(async b => {
    tileset = await b.LoadAnimImage("tiles.png",TILE_WIDTH,TILE_HEIGHT)
})
  
class TileMap {
    tiles = tilesTxt.split("\n").map(
        line => line.split("").map(
            letra => letra == " " ? 0 : parseInt(letra)
        )
    )

    width = 0
    height = 0
    constructor(){
        this.height = this.tiles.length
        this.width = this.tiles[0].length
        console.log(this.width, this.height)
    }
    /**
     * @param {IB2D} b 
     */
    render (b){
        let width = this.width
        let height = this.height
        let tw = TILE_WIDTH/2
        let th = TILE_HEIGHT/2
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                if(this.tiles[y][x] > 0){
                    b.DrawImageFrame(
                        tileset,
                        x*TILE_WIDTH + tw,
                        y*TILE_HEIGHT + th,
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
     */
    objectCollides(obj, out){
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

        let tw = TILE_WIDTH/2
        let th = TILE_HEIGHT/2
        // testa os tiles...
        for(let x = fromX; x < toX; x++){
            for(let y = fromY; y < toY; y++){
                if(this.tiles[y][x] == 0)
                    continue
                // esse tile...
                const tileRect = [x*TILE_WIDTH,y*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT]
                // checa se colide...
                if( rectsIntersect(tileRect, obj, out) ){
                    return this.tiles[y][x]
                }
            }
        }

        return -1
    }
}


export { TileMap }