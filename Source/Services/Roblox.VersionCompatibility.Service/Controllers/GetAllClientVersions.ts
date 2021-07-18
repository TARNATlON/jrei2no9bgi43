/*
	FileName: GetAllowedSecurityVersions.ts
	Written By: Nikita Nikolaevich Petko
	File Type: Module
	Description: Gets the allowed client Security Version

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
import { KeyValueMapping } from 'Assemblies/Common/Mapping/Roblox.Common.Mapping/KeyValueMapping';
import { ClientVersion } from 'Assemblies/Data/Versioning/Roblox.Data.Versioning/ClientVersion';
import { HttpRequestMethodEnum } from 'Assemblies/Http/Roblox.Http/Enumeration/HttpRequestMethodEnum';
import { DFLog, DYNAMIC_FASTFLAGVARIABLE, DYNAMIC_LOGVARIABLE, FASTLOGNOFILTER } from 'Assemblies/Web/Util/Roblox.Web.Util/Logging/FastLog';
import { ApiKeyValidator } from 'Assemblies/Web/Util/Roblox.Web.Util/Validators/ApiKeyValidator';
import { MethodValidator } from 'Assemblies/Web/Util/Roblox.Web.Util/Validators/MethodValidator';
import { ApiArrayResponse } from 'Assemblies/Web/WebAPI/Models/ApiArrayResponse';

DYNAMIC_FASTFLAGVARIABLE('ReturnDefaultSecurityVersion', false);
DYNAMIC_LOGVARIABLE('ClientVersioning', 7);

export default {
	method: 'all',
	func: async (request: Request<null, string[]>, response: Response<ApiArrayResponse<ClientVersion>>) => {
		const requestApiKey = KeyValueMapping.FetchKeyFromObjectCaseInsensitiveOrDefault(request.query, 'ApiKey', null);

		FASTLOGNOFILTER(
			DFLog('ClientVersioning'),
			`[DFLog::ClientVersioning] GetAllowedMD5Hashes request from ${request.ip} (${
				request['headers']['user-agent'] || 'No Useragent'
			}) with the ApiKey '${requestApiKey ?? 'No Api Key'}'`,
		);

		const apiKeyValidatorClient = new ApiKeyValidator(response, undefined);
		const methodValidatorClient = new MethodValidator(response);

		if (methodValidatorClient.Validate(request.method, 'GET', true) === HttpRequestMethodEnum.UNKNOWN) return;
		if (
			!apiKeyValidatorClient.Validate(
				KeyValueMapping.FetchKeyFromObjectCaseInsensitive(request.query, 'ApiKey'),
				'82147B99-B098-436A-9853-881DEE29DA63',
				true,
			)
		)
			return;
		return response.send({ data: await ClientVersion.GetAllClientVersions() });
	},
};
