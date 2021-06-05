/*
	FileName: _P-placeId.ts
	Written By: Nikita Nikolaevich Petko
	File Type: Module
	Description: https://api.sitetest4.robloxlabs.com/users/:userId/canmanage/:placeId, Checks if a user has permission to access a specific place

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

export default {
	method: 'all',
	func: (_req: unknown, res): void => {
		console.log('a');
		res.send({ Success: true, CanManage: true });
	},
};
