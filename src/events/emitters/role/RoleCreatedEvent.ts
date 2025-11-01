import { RoleModel } from "@database/models/RoleModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class RoleCreatedEvent extends BaseEvent {
    public readonly eventType = EventType.ROLE_CREATED;
    public data: RoleModel;

    constructor(data: RoleModel) {
        super();

        this.data = data;
    }
}
