import { make } from "../../../blitz/blitz";
import { GameState } from "../../../game_state";
import { Gato } from "../../gato/gato";
import { ControlarGato } from "../../gato/controle";

import mapa from "./mapa1"
import { Sensor } from "../../sensor/sensor";

import * as level2 from "../2/level"

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
    
    // põe o gato...
    let gato = make( new Gato(), { x: 64, y: 32})
    state.spawn(
        gato
    )
    state.setTarget( gato )


    // cria os eventos / sensores...
    const sensores = {
        "LevelExit": function({x,y,width,height}){
            state.spawn(
                new Sensor({
                    x,y,width,height,
                    target: gato,
                    onEnter(){
                        level2.Load(state)
                    }
                })
            )
        }
    }
    let coisas = mapa.layers[1]?.objects
    if(coisas){
        for(let coisa of coisas){
            if(sensores[coisa.name])
                sensores[coisa.name](coisa)
        }
    }

    // faz o gato ser controlável controlarem o gato.
    ControlarGato( state, gato )    
} 

export {
    Load
}