/*
	FileName: GetAllowedMD5Hashes.ts
	Written By: Nikita Nikolaevich Petko
	File Type: Module
	Description: Gets the allowed client MD5 Hashes

	All commits will be made on behalf of mfd-co to https://github.com/mfdlabs/robloxlabs.com

	***

	Copyright 2006-2021 ROBLOX

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	https://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.

	***
*/

import { Request, Response } from 'express';
import { ApiKeys } from '../../../Assemblies/Common/Client/Roblox.Common.Client/Api/ApiKeys';
import { FetchKeyFromObjectCaseInsensitive } from '../../../Assemblies/Common/KeyValueMapping/Roblox.Common.KeyValueMapping/FetchKeyFromObjectCaseInsensitive';
import { ClientVersion } from '../../../Assemblies/Data/Versioning/Roblox.Data.Versioning/ClientVersion';
import { HttpRequestMethodEnum } from '../../../Assemblies/Http/ServiceClient/Roblox.Http.ServiceClient/Enumeration/HttpRequestMethodEnum';
import { DFFlag, DYNAMIC_FASTFLAGVARIABLE } from '../../../Assemblies/Web/Util/Roblox.Web.Util/Logging/FastLog';
import { ApiKeyValidator } from '../../../Assemblies/Web/Util/Roblox.Web.Util/Validators/ApiKeyValidator';
import { MethodValidator } from '../../../Assemblies/Web/Util/Roblox.Web.Util/Validators/MethodValidator';
import { ApiKeyRequest } from '../Models/ApiKeyRequest';

DYNAMIC_FASTFLAGVARIABLE('ReturnEmptyMD5HashArrayForTesting', false);

export default {
	method: 'all',
	func: async (request: Request<null, string[], null, ApiKeyRequest, null>, response: Response<string[]>) => {
		const apiKeyValidatorClient = new ApiKeyValidator(response, 'The service is unavailable.');
		const methodValidatorClient = new MethodValidator(response);

		if (methodValidatorClient.Validate(request.method, 'GET', true) === HttpRequestMethodEnum.UNKNOWN) return;
		if (
			!apiKeyValidatorClient.Validate(
				FetchKeyFromObjectCaseInsensitive(request.query, 'ApiKey'),
				ApiKeys.VersionCompatibilityApi,
				true,
			)
		)
			return;
		if (DFFlag('ReturnEmptyMD5HashArrayForTesting')) return response.send([]);
		return response.send(await ClientVersion.GetAllLatestMD5HashesForUniqueClients());
	},
};
