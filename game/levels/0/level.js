import { make } from "../../../blitz/blitz";
import { GameState } from "../../../game_state";
import { Gato } from "../../gato/gato";
import { ControlarGato } from "../../gato/controle";
import { Pombo } from "../../pombo/pombo";

import mapa from "./mapa0"
import { Sensor } from "../../sensor/sensor";

import * as level1 from "../../levels/1/level"

/*
    Load recebe um gamestate que pode ser manipulado à vontade.
*/

/**
 * @param {GameState} state 
 */
function Load(state){
    // reseta tudo
    state.reset()

    // carrega o mapa...
    state.tileMap.FromTiled(mapa)

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

    
    // põe o gato...
    let gato = make( new Gato(), { x: 64, y: 32})
    state.spawn(
        gato
    )
    state.setTarget( gato )


    // cria os eventos / sensores...

    let coisas = mapa.layers[1]?.objects
    if(coisas){
        for(let coisa of coisas){
            switch(coisa.name){
                case "LevelExit":
                    let sensor = new Sensor(coisa.x,coisa.y,coisa.width,coisa.height)
                    sensor.onEnter(
                        gato, function(){                            
                            level1.Load( state )
                        }
                    )
                    state.spawn( sensor )
                break;
            }
        }
    }

    // faz o gato ser controlável controlarem o gato.
    ControlarGato( state, gato )    
} 

export {
    Load
}