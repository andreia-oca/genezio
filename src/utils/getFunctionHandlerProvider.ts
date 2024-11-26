import { UserError } from "../errors.js";
import {
    AwsFunctionHandlerProvider,
    AwsPythonFunctionHandlerProvider,
} from "../functionHandlerProvider/providers/AwsFunctionHandlerProvider.js";
import {
    HttpServerHandlerProvider,
    HttpServerPythonHandlerProvider, 
} from "../functionHandlerProvider/providers/HttpServerHandlerProvider.js";
import { FunctionType, Language } from "../projectConfiguration/yaml/models.js";

export function getFunctionHandlerProvider(
    functionType: FunctionType,
    language: Language,
): AwsFunctionHandlerProvider | HttpServerHandlerProvider {
    switch (functionType) {
        case FunctionType.aws: {
            const providerMap: { [key: string]: AwsFunctionHandlerProvider } = {
                [`${FunctionType.aws}-${Language.python}`]: new AwsPythonFunctionHandlerProvider(),
                [`${FunctionType.aws}-${Language.js}`]: new AwsFunctionHandlerProvider(),
                [`${FunctionType.aws}-${Language.ts}`]: new AwsFunctionHandlerProvider(),
            };

            const key = `${functionType}-${language}`;
            const provider = providerMap[key];

            if (provider) {
                return provider;
            } else {
                throw new UserError(
                    `Unsupported language: ${language} for AWS function. Supported languages are: python, js, ts.`,
                );
            }
        }
        case FunctionType.httpServer: {
            const providerMap: { [key: string]: HttpServerHandlerProvider } = {
                [`${FunctionType.httpServer}-${Language.python}`]:
                    new HttpServerPythonHandlerProvider(),
                [`${FunctionType.httpServer}-${Language.js}`]: new HttpServerHandlerProvider(),
                [`${FunctionType.httpServer}-${Language.ts}`]: new HttpServerHandlerProvider(),
            };

            const key = `${functionType}-${language}`;
            const provider = providerMap[key];

            if (provider) {
                return provider;
            } else {
                throw new UserError(
                    `Unsupported language: ${language} for HTTP Server function. Supported languages are: python, js, ts.`,
                );
            }
        }
        default:
            throw new UserError(
                `Unsupported function type: ${functionType}. Supported providers are: aws, httpServer.`,
            );
    }
}
