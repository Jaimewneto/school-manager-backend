import { RoleModel } from "@database/models/RoleModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class RoleUpdatedEvent extends BaseEvent {
    public readonly eventType = EventType.ROLE_UPDATED;
    public data: RoleModel;

    constructor(data: RoleModel) {
        super();

        this.data = data;
    }
}
