// src/plugins/contextPlugin.ts
import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

import { MainContext } from "@/contexts/main";

const contextPlugin: FastifyPluginAsync = async (fastify) => {
    // aqui não pode ser async function, por que precisamos do DONE
    fastify.addHook("onRequest", (req, reply, done) => {
        // obriga o request.user estar definido dentro do contexto
        MainContext.run({ user: req.user }, () => done());
    });
};

export const authContextFastifyPlugin = fp(contextPlugin, {
    name: "auth-context-plugin",

    // garante que o `request.user` já esteja definido
    dependencies: ["auth-guard-plugin"],
});

export default authContextFastifyPlugin;
