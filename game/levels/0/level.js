import { make } from "../../../blitz/blitz";
import { GameState } from "../../../game_state";
import { Gato } from "../../gato/gato";
import { ControlarGato } from "../../gato/controle";
import { Pombo } from "../../pombo/pombo";

const tiles = `
1                                                      1
1                                                      1
1                                                      1
1                                                      1
1                                                      1
1                                                      1
1                                                      1
1                                                      1
1                                                      1
1                                                 211111
1                                                      1
1                                                      1
1 2344452         23444452                          2111
1                                                      1
1   8                                                  1
1777712   217777777712                             21111
666661     1666666661           8        8          1666
66666111111166666666177777799999977777777777777777771666
66666666666666666666666666666666666666666666666666666666
66666666666666666666666666666666666666666666666666666666
`.trim()

/*
    Load recebe um gamestate que pode ser manipulado à vontade.
*/

/**
 * @param {GameState} state 
 */
function Load(state){
    // carrega o mapa...
    state.tileMap.Load(tiles)

    // põe os itens, pombos...
    for(let x = 0; x < state.tileMap.width; x++){
      for(let y = 0; y < state.tileMap.height-1; y++){
        if(state.tileMap.tiles[y][x] == 0 && state.tileMap.tiles[y+1][x]!==0){
          if(Math.random()>=0.85){
            state.spawn( new Pombo(x * 32 + 16, y * 32 + 16) )
          }
        }
      }
    }
    // cria os eventos...

    
    // põe o gato...
    let gato = make( new Gato(), { x: 64, y: 32})
    state.spawn(
        gato
    )
    state.setTarget( gato )

    // faz o gato ser controlável controlarem o gato.
    ControlarGato( state, gato )    
} 

export {
    Load
}