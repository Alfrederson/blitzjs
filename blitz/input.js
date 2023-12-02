const input = {
    oldMouseX : 0,
    oldMouseY : 0,
    mouseX : 0,
    mouseY : 0,
    mouseDown : Array.from({length:10}, x => false)
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
        input.oldMouseX = input.mouseX
        input.oldMouseY = input.mouseY

        const rect = canvasElement.getBoundingClientRect()

        input.mouseX = (ev.clientX - rect.left)/(rect.width)*width | 0
        input.mouseY = (ev.clientY - rect.top)/(rect.height)*height | 0
    })

    canvasElement.addEventListener("mousedown", ev =>{
        ev.preventDefault()
        input.mouseDown[ ev.button ] = true
    })
    canvasElement.addEventListener("mouseup", ev =>{
        ev.preventDefault()
        input.mouseDown[ ev.button ] = false
    })

}

function MouseX(){
    return input.mouseX
}

function MouseY(){
    return input.mouseY
}

function MouseSpeedX(){
    return input.mouseX - input.oldMouseX
}

function MouseSpeedY(){
    return input.mouseY - input.oldMouseY
}

function MouseDown(mb){
    return input.mouseDown[mb]
}

export {
    AttachInput,
    MouseX,
    MouseY,
    MouseSpeedX,
    MouseSpeedY,
    MouseDown
}