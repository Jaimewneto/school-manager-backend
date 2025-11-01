import { UserModel } from "@database/models/UserModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class UserUpdatedEvent extends BaseEvent {
    public readonly eventType = EventType.USER_UPDATED;
    public data: UserModel;

    constructor(data: UserModel) {
        super();

        this.data = data;
    }
}
