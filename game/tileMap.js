import { IB2D, Preload } from "../blitz/blitz"

const tilesTxt = `
#########################
#                       #
#                       #
#                       #
#                       #
#                       #
#                       #
#                       #
#                       #
#########################
`.trim()

let tileset

Preload(async b => {
    tileset = await b.LoadAnimImage("tiles.png",32,32)
})
  
class TileMap {
    tiles = tilesTxt.split("\n").map(
        line => line.split("").map(
            letra => letra == "#" ? 1 : 0
        )
    )

    constructor(){
        console.log(this.tiles)
    }

    /**
     * @param {IB2D} b 
     */
    render (b){
        for(let y = 0; y < this.tiles.length; y++){
            for(let x = 0; x < this.tiles[y].length; x++){
                if(this.tiles[y][x] > 0){
                    b.DrawImageFrame(tileset, x*32 + 16,y*32 + 16,0)
                }
            }
        }
    }
}


export { TileMap }