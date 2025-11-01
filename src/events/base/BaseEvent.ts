import MainContext from "@/contexts/main";

import { EventType } from "@events/types";

export abstract class BaseEvent {
    public user = MainContext.getUser();
    public websocketId = MainContext.getWebsocketId();

    public timestamp: Date = new Date();

    public abstract eventType: EventType;
}
