const TABS = 4

const commands = {
    insert : "insert",
    delete : "delete",
    undo : "undo",
    redo : "redo",
    enter : "enter",
    tab : "tab",
    backspace : "backspace"
}

let Document = function () {
    if (!new.target)
        return new Document()

    let _history = []
    let _undoHistory = []
    
    let Command = function(command, text, coords) {
        this.command = command
        this.text = text
        this.coords = coords
    
        let res = this.execute()
    
        if (this.command !== commands.undo && this.command !== commands.redo) {
            _history.push({
                command : this.command,
                ...this.coords,
                ...res
            })
            if (_undoHistory.length)
                _undoHistory = []
        }
        this.getText = () => this.text
        this.getLastUCommand = () => _undoHistory[_undoHistory.length-1]
        this.getLastCommand = () => _history[_history.length-1]
    }
    
    let CInsertChar = function (text, coords, char) {
        if (!new.target)
            return new CInsertChar(text, coords, char)
    
        this.execute = () => {
            let {x, y} = coords
            if (this.text[y][x - 1] === "\r")
                x--
            this.text[y].splice(x, 0, char)
            this.coords.x = x
        }
    
        Command.call(this, commands.insert, text, coords)
    }
    
    let CDelete = function (text, coords) {
        if (!new.target)
            return new CDelete(text, coords)
    
        this.execute = () => {
            let {x, y} = coords
    
            let char = this.text[y][x]
            if (char === "\r") {
                if (y < this.text.length - 1) {
                    let deleted = this.text.splice(y + 1, 1)
                    this.text[y].pop()
                    this.text[y] = this.text[y].concat(deleted[0])
                } else 
                    throw new Error("Cannot delete: end of file")
            } else
                this.text[y].splice(x, 1)
            return {char}
        }
    
        Command.call(this, commands.delete, text, coords)
    }
    
    let CUndo = function (text) {
        if (!new.target)
            return new CUndo(text)
    
        this.execute = () => {
            let action = _history.pop()
            switch (action.command) {
                case commands.insert:
                    action.char = this.text[action.y].splice(action.x, 1)
                    break
                case commands.delete:
                    if (action.char === "\r") {
                        let str0 = this.text[action.y].slice(0, action.x)
                        let str1 = this.text[action.y].slice(action.x)
                        if (str0[str0.length - 1] !== "\r")
                            str0.push("\r")
                        if (!str1.length)
                            str1.push("\r")
                        this.text.splice(action.y, 1, str0)
                        this.text.splice(action.y + 1, 0, str1)
                    } else
                        this.text[action.y].splice(action.x, 0, action.char)
                    break
                case commands.backspace:
                    if (action.char === "\r") {
                        let str0 = this.text[action.y].slice(0, action.x)
                        let str1 = this.text[action.y].slice(action.x)
                        if (str0[str0.length - 1] !== "\r")
                            str0.push("\r")
                        if (!str1.length)
                            str1.push("\r")
                        this.text.splice(action.y, 1, str0)
                        this.text.splice(action.y + 1, 0, str1)
                        action.x = 0
                        action.y++
                    } else {
                        this.text[action.y].splice(action.x, 0, action.char)
                        action.x++
                    }
                    break
                case commands.enter:
                    let curStr = this.text.splice(action.y, 1)
                    curStr[0].pop()
                    this.text[action.y] = curStr[0].concat(this.text[action.y])
                    break
                case commands.tab:
                    this.text[action.y].splice(action.x - action.spaces, action.spaces)
                    action.x -= action.spaces
                    break
                default:
                    throw new Error("Wrong command")
            }
            _undoHistory.push(action)
        }
    
        Command.call(this, commands.undo, text)
    }
    
    let CRedo = function (text) {
        if (!new.target)
            return new CRedo(text)
    
        this.execute = () => {
            let action = _undoHistory.pop()
            let copyUHistory = _undoHistory
            let coords = {x: action.x, y: action.y}
            switch (action.command) {
                case commands.insert: {
                    CInsertChar.call(this, this.text, coords, action.char)
                    action.x++
                    break
                }
                case commands.delete: {
                    let {x, y} = CDelete.call(this, this.text, coords).getLastCommand()
                    action.x = x
                    action.y = y
                    break
                }
                case commands.backspace: {
                    let {x, y} = CBackspace.call(this, this.text, coords).getLastCommand()
                    action.x = x
                    action.y = y
                    break
                }
                case commands.enter: {
                    let {x, y} = CEnter.call(this, this.text, coords).getLastCommand()
                    action.x = x
                    action.y = y
                    break
                }
                case commands.tab: {
                    let {x} = CTab.call(this, this.text, coords).getLastCommand()
                    action.x = x
                    break
                }
                default:
                    throw new Error("Wrong command")
            }
            _undoHistory = copyUHistory
        }
    
        Command.call(this, commands.redo, text)
    }
    
    let CEnter = function (text, coords) {
        if (!new.target)
            return new CEnter(text, coords)
    
        this.execute = () => {
            let {x, y} = coords
            let str0 = this.text[y].slice(0, x)
            let str1 = this.text[y].slice(x)
            if (str0[str0.length - 1] !== "\r")
                str0.push("\r")
            if (!str1.length)
                str1.push("\r")
            this.text.splice(y, 1, str0)
            this.text.splice(y + 1, 0, str1)
        }
    
        Command.call(this, commands.enter, text, coords)
    }
    
    let CTab = function (text, coords) {
        if (!new.target)
            return new CTab(text, coords)
    
        this.execute = () => {
            let {x, y} = coords
    
            let spacesBefore = (x + 1) % TABS
            let spacesAfter = TABS - spacesBefore + 1
    
            for (let i = 0; i < spacesAfter; i++)
                this.text[y].splice(x, 0, " ")
            this.coords.x += spacesAfter
            return {spaces : spacesAfter}
        }
    
        Command.call(this, commands.tab, text, coords)
    }
    
    let CBackspace = function (text, coords) {
        if (!new.target)
            return new CBackspace(text, coords)
    
        this.execute = () => {
            let {x, y} = coords
            let cursorNew = {x: x - 1, y: y}
            if (cursorNew.x < 0) {
                cursorNew.y--
                if (cursorNew.y < 0)
                    throw new Error("Cannot delete: file beginning")
                cursorNew.x = this.text[cursorNew.y].length - 1
            }
            let char = this.text[cursorNew.y].splice(cursorNew.x, 1)
            if (char[0] === "\r") {
                let recentStr = this.text.splice(cursorNew.y, 1)
                this.text[cursorNew.y] = recentStr[0].concat(this.text[cursorNew.y])
            }
            this.coords = cursorNew
            return {char : char[0]}
        }
    
        Command.call(this, commands.backspace, text, coords)
    }

    this.Backspace = CBackspace
    this.Delete = CDelete
    this.Enter = CEnter
    this.InsertChar = CInsertChar
    this.Tab = CTab
    this.Undo = CUndo
    this.Redo = CRedo
}

module.exports = {
    commands,
    Document
}
