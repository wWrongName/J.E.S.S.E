class EventEmitter {
    constructor() {
        this.events = {}
    }

    _prerequisites(name) {
        if (!this.events[name])
            this.events[name] = []
    }

    subscribe(name, subscription) {
        this._prerequisites(name)
        this.events[name].push(subscription)
        let unsubscribe = () => {
            this.events[name] = this.events[name].filter(func => subscription !== func)
        }
        return unsubscribe
    }

    emit(name, data) {
        let event = this.events[name]
        if (event)
            event.forEach(func => func.call(null, data))
    }
}

const eventEmitter = new EventEmitter()

module.exports = eventEmitter
