export default class {

    top = 0
    /**
     * @type {any[]}
     */
    stuff = []

    constructor(capacity){
        this.stuff = Array.from({length:capacity})
    }
    
    /**
     * Adds something to the top of the stack.
     * @param {any} thing
     */
    push(thing){
        this.stuff[this.top] = thing
        this.top++
    }

    /**
     * Removes something from the top of the stack.
     * @returns {any}
     */
    pop(){
        let thing = this.stuff[this.top]
        this.stuff[this.top] = undefined
        this.top--
        return thing
    }


    /**
     * Vê objeto na posição i da pilha
     * @param {number} i 
     * @returns {object}
     */
    at(i){
        return this.stuff[i]
    }

    /**
     * sets the item at i to undefined
     * @param {number} i 
     */
    forget(i){
        this.stuff[i] = undefined
    }

    reset(){
        this.top = 0
        this.stuff[0] = undefined
    }

}