const fs = require("fs")
const path = require("path")
const solc = require("solc")

let createJSONInput = function (dirPath, contractFile) {
    let content = fs.readFileSync(path.join(dirPath, contractFile)).toString()
    let compilerConfig =  {
        language: 'Solidity',
        sources: {
            [contractFile]: {
                content
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }
    return JSON.stringify(compilerConfig)
}

let compile = function (compilerConfig) {
    let res
    try {
        res = solc.compile(compilerConfig)
    } catch (e) {
        return e
    }
    return JSON.parse(res)
}

let handleCompilerRes = function (output, contractFile) {
    for (let contractName in output.contracts[contractFile]) {
        // fs.writeFileSync("tmp.js", JSON.stringify(output.contracts[contractFile][contractName], null, "  "))
    }
}

let useCompiler = function (dirPath, contractFile) {
    let JSONInput = createJSONInput(dirPath, contractFile)
    let JSONOutput = compile(JSONInput)
    handleCompilerRes(JSONOutput, contractFile)
}

useCompiler("./", "hello.sol")

// module.exports = useCompiler
