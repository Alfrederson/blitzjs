function constrain(num, from, to){
    return Math.max(from, Math.min(num,to))
}

/**
 * @param {number[]} rectA - [x,y,w,h]
 * @param {number[]} rectB - [x,y,w,h]
 * @param {number[]} out   - [x,y,w,h]
 * @returns {boolean}
 */
function rectsIntersect(rectA, rectB, out){
    const X = 0, Y = 1, W = 2, H = 3
    // não colide no eixo X ou Y.
    if((rectA[X] + rectA[W] <= rectB[X] ||
        rectB[X] + rectB[W] <= rectA[X]) ||
        (rectA[Y] + rectA[H] <= rectB[Y] ||
        rectB[Y] + rectB[H] <= rectA[Y])){

        out[0] = 0
        out[1] = 0
        out[2] = 0
        out[3] = 0
        return false
    }

    out[X] = Math.max(rectA[X], rectB[X])
    out[Y] = Math.max(rectA[Y], rectB[Y])
    out[W] = Math.min(rectA[X] + rectA[W], rectB[X] + rectB[W]) - out[X]
    out[H] = Math.min(rectA[Y] + rectA[H], rectB[Y] + rectB[H]) - out[Y]

    return true

}

export {
    constrain, 
    rectsIntersect
}