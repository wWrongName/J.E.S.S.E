let setBytesTypes = function () {
    let obj = {}
    for (let i = 1; i <= 32; i++)
        obj[`bytes${i}`] = "type-name"
    return obj
}
let setIntTypes = function (isUnsigned) {
    let obj = {}
    let prefix = isUnsigned ? "u" : ""
    obj[`${prefix}int`] = "type-name"
    for (let i = 8; i <= 256; i+=8)
        obj[`${prefix}int${i}`] = "type-name"
    return obj
}

const bytesTypes = setBytesTypes()
const intTypes = setIntTypes()
const uintTypes = setIntTypes(true)

module.exports = {
    "default" : "whitesmoke",
    "words" : {
        "import" : "import-directive",
        "as" : "import-directive",
        "from" : "import-directive",
        
        "pragma" : "source-unit",
        "solidity" : "source-unit",

        "{" : "brackets",
        "}" : "brackets",
        "(" : "brackets",
        ")" : "brackets",
        
        ";" : "dividers",
        "," : "dividers",
        
        "contract" : "definitions",
        "library" : "definitions",
        "function" : "definitions",
        "returns" : "definitions",
        "modifier" : "definitions",
        "constructor" : "definitions",
        // "return" : "definitions",

        "internal" : "visibility",
        "external" : "visibility",
        "private" : "visibility",
        "public" : "visibility",

        "view" : "mutability",
        "pure" : "mutability",
        "payable" : "mutability",

        "address" : "type-name",
        "bool" : "type-name",
        "string" : "type-name",
        "bytes" : "type-name",
        "fixed" : "type-name",
        "ufixed" : "type-name",
        "uint" : "type-name",
        "int" : "type-name",
        ...bytesTypes,
        ...intTypes,
        ...uintTypes,

        "memory" : "data-location",
        "storage" : "data-location",
        "calldata" : "data-location",

        "wei" : "number-unit",
        "gwei" : "number-unit",
        "ether" : "number-unit",
        "seconds" : "number-unit",
        "minutes" : "number-unit",
        "hours" : "number-unit",
        "days" : "number-unit",
        "weeks" : "number-unit",
        "years" : "number-unit",

        '"' : "quotation-marks",
        "'" : "quotation-marks",

        "=" : "math-ops",
        "+" : "math-ops",
        "-" : "math-ops",
        "*" : "math-ops",
        "/" : "math-ops",
        "%" : "math-ops"
    },
    "colors" : {
        "import-directive" : "brown",
        "source-unit" : "green",
        "brackets" : "orange",
        "dividers" : "whitesmoke",
        "definitions" : "brown",
        "visibility" : "brown",
        "mutability" : "brown",
        "type-name" : "lightskyblue", 
        "data-location" : "brown",
        "number-unit" : "lightskyblue",
        "quotation-marks" : "darkorange",
        "math-ops" : "lightskyblue"
    }
}
