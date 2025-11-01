import { CompanyModel } from "@database/models/CompanyModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class CompanyUpdatedEvent extends BaseEvent {
    public readonly eventType = EventType.COMPANY_UPDATED;
    public data: CompanyModel;

    constructor(data: CompanyModel) {
        super();

        this.data = data;
    }
}
