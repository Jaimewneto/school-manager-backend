import { CompanyModel } from "@database/models/CompanyModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class CompanyDeletedEvent extends BaseEvent {
    public readonly eventType = EventType.COMPANY_DELETED;
    public data: CompanyModel;

    constructor(data: CompanyModel) {
        super();

        this.data = data;
    }
}
