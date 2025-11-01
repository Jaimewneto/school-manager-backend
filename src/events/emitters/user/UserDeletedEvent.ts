import { UserModel } from "@database/models/UserModel";

import { BaseEvent } from "@events/base/BaseEvent";
import { EventType } from "@events/types";

export class UserDeletedEvent extends BaseEvent {
    public readonly eventType = EventType.USER_DELETED;
    public data: UserModel;

    constructor(data: UserModel) {
        super();

        this.data = data;
    }
}
