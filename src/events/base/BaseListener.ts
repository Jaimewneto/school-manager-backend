import { AppEventEmitter } from "@events/emitter";

import { BaseEvent } from "./BaseEvent";
import { EventType } from "@events/types";

export abstract class BaseListener<T extends BaseEvent> {
    abstract handle(event: T): void;

    constructor(eventType: EventType) {
        AppEventEmitter.on(eventType, (event: T) => this.handle(event));
    }
}
