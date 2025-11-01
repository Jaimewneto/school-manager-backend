import { Server } from "socket.io";

import { JwtPayload } from "@auth/types";

declare module "fastify" {
    interface FastifyInstance {
        io: Server;
    }

    interface FastifyRequest {
        user: JwtPayload;
    }
}
