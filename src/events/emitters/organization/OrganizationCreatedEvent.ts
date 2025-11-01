import { OrganizationModel } from "@database/models/OrganizationModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class OrganizationCreatedEvent extends BaseEvent {
    public readonly eventType = EventType.ORGANIZATION_CREATED;
    public data: OrganizationModel;

    constructor(data: OrganizationModel) {
        super();

        this.data = data;
    }
}
