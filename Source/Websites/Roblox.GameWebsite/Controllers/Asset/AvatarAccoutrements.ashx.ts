import { Request, Response } from 'express';
import { AvatarRequestProcessor } from 'Assemblies/Web/Avatars/Roblox.Web.Avatars/AvatarRequestProcessor';
import { AvatarAccoutrementsRequest } from 'Websites/Roblox.GameWebsite/Models/Game/IAvatarAccoutrementsRequest';

export default {
	method: 'all',
	func: async (request: Request<null, string, null, AvatarAccoutrementsRequest>, response: Response<string>) => {
		const cachedRequestProcessor = new AvatarRequestProcessor(response);

		var [UserID, UserName, allowSSL] = cachedRequestProcessor.ExtractDataFromQueryStringForAvatarAccoutrementsRequest(request);

		await cachedRequestProcessor.GetAvatarAccoutrementsAsync(UserID, UserName, allowSSL);
	},
};
