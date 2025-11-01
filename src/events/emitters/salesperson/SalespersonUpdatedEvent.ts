import { SalespersonModel } from "@database/models/SalespersonModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class SalespersonUpdatedEvent extends BaseEvent {
    public readonly eventType = EventType.SALESPERSON_UPDATED;
    public data: SalespersonModel;

    constructor(data: SalespersonModel) {
        super();

        this.data = data;
    }
}
