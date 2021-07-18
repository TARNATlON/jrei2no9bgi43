import { Request, Response } from 'express';
import { ErrorsClient } from 'Assemblies/Web/Util/Roblox.Web.Util/ErrorsClient';

export const DefaultServiceError = (request: Request, response: Response) => {
	const errorsClient = new ErrorsClient(response);
	if (request.method === 'OPTIONS') return response.status(200).send();
	errorsClient.RespondWithAServiceError(
		404,
		`No HTTP resource was found that matches the request URI '${request.protocol}://${request.hostname}${request.url}'.`,
		true,
	);
};
