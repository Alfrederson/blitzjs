const input = {
    mouseX : 0,
    mouseY : 0
}

/**
 * Ativa input no elemento especificado.
 * width e height são as dimensões "virtuais" da tela,
 * ex: 320 x 240 em um elemento que vai aparecer com 800 x 600.
 * @param {number} width
 * @param {number} height
 * @param {string} canvasElementId  
 */
function AttachInput(width, height, canvasElementId){
    let canvasElement = document.getElementById(canvasElementId)
    if(!canvasElement){
        throw "Elemento " + canvasElementId + " não existe"
    }
    const rect = canvasElement?.getBoundingClientRect()

    window.addEventListener("mousemove", ev =>{

        input.mouseX = (ev.clientX - rect.left) | 0
        input.mouseY = (ev.clientY - rect.top) | 0
    })
}

function MouseX(){
    return input.mouseX
}

function MouseY(){
    return input.mouseY
}

export {
    AttachInput,
    MouseX,
    MouseY
}