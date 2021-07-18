import { RequestHandler } from 'express-serve-static-core';
import { DFLog, DYNAMIC_LOGGROUP, FASTLOGNOFILTER } from 'Assemblies/Web/Util/Roblox.Web.Util/Logging/FastLog';

DYNAMIC_LOGGROUP('Protocol77');

export const LoggingHandler = (async (request, response, next) => {
	FASTLOGNOFILTER(
		DFLog('Protocol77'),
		`[DFLog::Protocol77] ${request.method.toUpperCase()} REQUEST ON ${request.protocol}://${request.hostname}${request.url} FROM '${
			request.headers['user-agent'] || 'No User Agent'
		}' (${request.ip})`,
	);
	next();
}) as RequestHandler;
