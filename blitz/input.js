const input = {
    mouseX : 0,
    mouseY : 0
}

/**
 * Ativa input no elemento especificado.
 * width e height são as dimensões "virtuais" da tela,
 * de tal forma que a posição real seja corrigida para corresponder a uma posição na tela virtual.
 * @param {number} width
 * @param {number} height
 * @param {string} canvasElementId  
 */
function AttachInput(width, height, canvasElementId){
    const canvasElement = document.getElementById(canvasElementId)
    if(!canvasElement){
        throw "Elemento " + canvasElementId + " não existe"
    }

    canvasElement.addEventListener("mousemove", ev =>{
        const rect = canvasElement.getBoundingClientRect()
        input.mouseX = (ev.clientX - rect.left)/(rect.width)*width | 0
        input.mouseY = (ev.clientY - rect.top)/(rect.height)*height | 0
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