import { OrganizationModel } from "@database/models/OrganizationModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class OrganizationUpdatedEvent extends BaseEvent {
    public readonly eventType = EventType.ORGANIZATION_UPDATED;
    public data: OrganizationModel;

    constructor(data: OrganizationModel) {
        super();

        this.data = data;
    }
}
