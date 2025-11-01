import { convertToInternalError, generateErrorResponse } from "@errors/utils";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

const ErrorHandlerMiddleware = (err: FastifyError, req: FastifyRequest, res: FastifyReply) => {
    const convertedError = convertToInternalError(err);
    const response = generateErrorResponse(convertedError);

    res.status(response.http_code).send(response);
};

export default ErrorHandlerMiddleware;
