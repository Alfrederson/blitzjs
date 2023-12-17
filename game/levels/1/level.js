import { make } from "../../../blitz/blitz";
import { GameState } from "../../../game_state";
import { Gato } from "../../gato/gato";
import { ControlarGato } from "../../gato/controle";

import mapa from "./mapa1"
import { Sensor } from "../../sensor/sensor";

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

    let coisas = mapa.layers[1]?.objects
    if(coisas){
        for(let coisa of coisas){
            switch(coisa.name){
                case "LevelExit":
                    let sensor = new Sensor(coisa.x,coisa.y,coisa.width,coisa.height)
                    sensor.onEnter(
                        gato, function(){
                            console.log("passou!")
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