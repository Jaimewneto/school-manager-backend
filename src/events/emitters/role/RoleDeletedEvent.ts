import { RoleModel } from "@database/models/RoleModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class RoleDeletedEvent extends BaseEvent {
    public readonly eventType = EventType.ROLE_DELETED;
    public data: RoleModel;

    constructor(data: RoleModel) {
        super();

        this.data = data;
    }
}
