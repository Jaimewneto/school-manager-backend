import { UserModel } from "@database/models/UserModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class UserCreatedEvent extends BaseEvent {
    public readonly eventType = EventType.USER_CREATED;
    public data: UserModel;

    constructor(data: UserModel) {
        super();

        this.data = data;
    }
}
