import { PartyModel } from "@database/models/PartyModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class PartyUpdatedEvent extends BaseEvent {
    public readonly eventType = EventType.PARTY_UPDATED;
    public data: PartyModel;

    constructor(data: PartyModel) {
        super();

        this.data = data;
    }
}
