import { RequestHandler } from 'express-serve-static-core';
import { KeyValueMapping } from 'Assemblies/Common/Mapping/Roblox.Common.Mapping/KeyValueMapping';
import { Security } from 'Assemblies/Web/Auth/Roblox.Web.Auth/Security';

export const CookieHandler = (async (request, response, next) => {
	if (
		!(await Security.GetUserFromCookie(request)) &&
		KeyValueMapping.GetValueFromCookieString('.ROBLOSECURITY', request.headers.cookie) !== null
	)
		response.clearCookie('.ROBLOSECURITY', { domain: '.sitetest4.robloxlabs.com' });
	next();
}) as RequestHandler;
