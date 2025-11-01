// import { Logger } from "@logging/index";

// const logger = Logger(`api-retaguarda@${__filename}`);

// // JOBS
// import * as EventsListeners from "@events/listeners";

// const isClass = (v: any) => typeof v === "function" && v.prototype.constructor === v;

// export const registerEventListeners = async () => {
//     logger.info(`Registering events listener`);

//     for (const ListenerClass of Object.values(EventsListeners)) {
//         if (isClass(ListenerClass)) {
//             logger.info(`Registering event listener: ${ListenerClass.name}`);
//             new (ListenerClass as any)();
//         }
//     }
// };
