import { Request, Response } from 'express';
import { AvatarRequestProcessor } from 'Assemblies/Web/Avatars/Roblox.Web.Avatars/AvatarRequestProcessor';
import { AvatarFetchModel } from 'ApiSites/Roblox.Avatar.Api/Models/AvatarFetchModel';
import { AvatarFetchRequest } from 'ApiSites/Roblox.Avatar.Api/Models/AvatarFetchRequest';

export default {
	method: 'all',
	func: async (request: Request<null, AvatarFetchModel, null, AvatarFetchRequest>, response: Response<AvatarFetchModel>) => {
		const cachedRequestProcessor = new AvatarRequestProcessor(response);

		var [UserID, UserName, placeID] = cachedRequestProcessor.ExtractDataFromQueryStringForGetAvatarFetchRequest(request);

		await cachedRequestProcessor.GetAvatarFetchResponseAsync(UserID, UserName, placeID);
	},
};
