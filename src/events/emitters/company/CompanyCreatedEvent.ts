import { CompanyModel } from "@database/models/CompanyModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class CompanyCreatedEvent extends BaseEvent {
    public readonly eventType = EventType.COMPANY_CREATED;
    public data: CompanyModel;

    constructor(data: CompanyModel) {
        super();

        this.data = data;
    }
}
