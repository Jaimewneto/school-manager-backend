import { PartyModel } from "@database/models/PartyModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class PartyDeletedEvent extends BaseEvent {
    public readonly eventType = EventType.PARTY_DELETED;
    public data: PartyModel;

    constructor(data: PartyModel) {
        super();

        this.data = data;
    }
}
