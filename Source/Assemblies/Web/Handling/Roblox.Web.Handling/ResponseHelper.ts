import { Response } from 'express';
import { __baseDirName } from 'Assemblies/Common/Constants/Roblox.Common.Constants/Directories';

export class ResponseHelper {
	public static RespondWithA1PXImage(response: Response) {
		return response.sendFile(__baseDirName + '/InternalCDN/1px.png');
	}
}
