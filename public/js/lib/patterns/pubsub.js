const privateData = new WeakMap();

/**
 * Abstract class for Publish/Subscribe pattern.
 */
export default class PubSub {
    constructor() {
        privateData.set(this, {});
    }

    get events() {
        return privateData.get(this);
    }

    /**
     * Registers callback for given event.
     * @param {String} event
     * @param {Function} callback
     * @returns {Function}
     */
    on(event, callback) {
        if(!Array.isArray(this.events[event])) {
            this.events[event] = [];
        }

        var index = this.events[event].push(callback) - 1;

        return () => delete this.events[event][index];
    }

    /**
     * Emit data to registered subscribers.
     * @param {String} event
     * @param {Object} [data]
     */
    emit(event, data) {
        var subscribers = this.events[event];

        if(!Array.isArray(subscribers)) {
            return;
        }

        subscribers.forEach(callback => typeof (callback) === 'function' && callback(data));
    }
}