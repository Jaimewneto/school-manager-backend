import { PartyModel } from "@database/models/PartyModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class PartyCreatedEvent extends BaseEvent {
    public readonly eventType = EventType.PARTY_CREATED;
    public data: PartyModel;

    constructor(data: PartyModel) {
        super();

        this.data = data;
    }
}
