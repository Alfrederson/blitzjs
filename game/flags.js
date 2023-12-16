// flags é só um objeto que é persistido.

const flags = {
    clearedLevels : [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
    ]
}

function Load(){
    let storedFlags
    if(storedFlags = localStorage.getItem("flags")){
        let parsed = JSON.parse(storedFlags)
        for(const key in parsed){
            if(parsed.hasOwnProperty(key)){
                flags[key] = parsed[key]
            }
        }
    }
}

function Save(){
    localStorage.setItem("flags", JSON.stringify(flags))
}

export {
    Load,
    Save,
    flags
}