/*
	FileName: api.ts
	Written By: Nikita Nikolaevich Petko
	File Type: Module
	Description: api 404 middleware

	All commits will be made on behalf of mfd-co to https://github.com/mfd-core/sitetest4.robloxlabs.com

	***

	Copyright 2015-2020 MFD

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

import { Roblox } from '../../Api';
import fs from 'fs';

export default (req, res) => {
	let template = fs.readFileSync(
		Roblox.Api.Constants.RobloxDirectories.__iBaseDirectory + '\\ErrorViews\\SimulPong\\SimulPong.404.html',
		{ encoding: 'utf-8' },
	);
	template = template.split('<REQUESTURLGOESHERE>').join(req.url);
	return res.send(template);
};
