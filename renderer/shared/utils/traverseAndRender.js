module.exports = (body, handler, accumulator, whiteList) => {
    let _getInstantObj = () => {
        let res = _bodyIndexes.reduce((prev, cur, index) => {
            if (index < _bodyIndexes.length - 1)
                return index === 0 ? prev : typeof prev === "object" ? prev[Object.keys(prev)[cur]] : prev
            return prev
        }, _bodyIndexes[0])
        return res === [] ? null : res
    }
    
    let _getInstantIndex = () => _bodyIndexes[_bodyIndexes.length - 1]
    
    let _updIndex = (newIndex) => {
        _bodyIndexes[_bodyIndexes.length - 1] = newIndex
    }
    
    let _indexPush = (bodyIndex) => {
        _bodyIndexes.push(bodyIndex)
    }
    
    let _indexPop = () => {
        _bodyIndexes.pop()
    }
    let _handleConditions = (index, len, handler) => {
        _indexPush(0)
        let el = _getInstantObj()  
        
        let clearBodyIndexes = _bodyIndexes.slice()
        clearBodyIndexes.splice(0, 1)
        let res = handler(el, clearBodyIndexes)
    
        let contentIndex = Object.keys(el).indexOf("content")
        _indexPop()

        if (contentIndex !== -1 && whiteList.find(whiteIndexes => whiteIndexes.toString() === clearBodyIndexes.toString()) !== undefined) {
            _indexPush(contentIndex)
            _indexPush(0)
        } else {
            _updIndex(_getInstantIndex() + 1)
        }
        if (res !== undefined)
            return res
    }
    
    let _bodyIndexes = []
    
    let _clearTraverseIndexes = () => {
        _bodyIndexes = []
    }

    if (typeof body !== "object" || Array.isArray(body) && !body.length)
        return

    _indexPush(body)
    _indexPush(0)

    let instantObj = _getInstantObj()
    let keys = Object.keys(instantObj)
    let i = _getInstantIndex()
    while (instantObj) {
        let res = _handleConditions(i, keys.length, handler)
        if (res !== undefined) {
            if (accumulator)
                accumulator.push(res)
            else {
                _clearTraverseIndexes()
                return res
            }
        }
        i = _getInstantIndex()
        instantObj = _getInstantObj()
        keys = Object.keys(instantObj)
        while (i === keys.length) {
            _indexPop() // delete 1 ptr (exit from traversed object)
            i = _getInstantIndex()
            if (i === body) {
                _clearTraverseIndexes()
                return accumulator
            }
            _updIndex(++i)
            instantObj = _getInstantObj()
            keys = Object.keys(instantObj)
        }
    }
    _clearTraverseIndexes()
}
