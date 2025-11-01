import { EventEmitter as EvtEmitter } from "events";

import { BaseEvent } from "./base/BaseEvent";

class EventEmitter extends EvtEmitter {
    emitEvent(event: BaseEvent) {
        if (!event.eventType) {
            throw new Error(`O evento ${event.constructor.name} não possui um eventType definido!`);
        }

        this.emit(event.eventType, event);
    }
}

export const AppEventEmitter = new EventEmitter();

export default AppEventEmitter;
