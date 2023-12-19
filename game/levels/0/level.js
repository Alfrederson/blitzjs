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

    // põe os sensores e eventos
    // Botar isso em outro lugar?
    const sensores = {
        "LevelExit": function({x,y,width,height}){
            state.spawn(
                new Sensor({
                    x,y,width,height,
                    target: gato,
                    onEnter(){
                        level1.Load(state)
                    }
                })
            )
        },
        "PendurarNaBeira": function({x,y,width,height}){
            state.spawn(
                new Sensor({
                    x,y,width,height,
                    target: gato,
                    onEnter(){
                        // @ts-ignore
                        state.message("se eu me pendurar lá na frente e depois pular aqui para trás...")
                    }
                })
            )            
        },
        "SouGato": function({x,y,width,height}){
            state.spawn(
                new Sensor({
                    x,y,width,height,
                    target: gato,
                    onEnter(){
                        // @ts-ignore
                        state.message("eu sou gato eu!")
                    }
                })
            )
        },
        "Final": function({x,y,width,height}){
            state.spawn(
                new Sensor({
                    x,y,width,height,
                    target: gato,
                    onEnter(){
                        // @ts-ignore
                        state.message("acho que acabou!")
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

    // faz o gato ser controlável.
    ControlarGato( state, gato )    
} 

export {
    Load
}