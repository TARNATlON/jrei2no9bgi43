import { Request, Response } from 'express';
import { KeyValueMapping } from 'Assemblies/Common/Mapping/Roblox.Common.Mapping/KeyValueMapping';
import { IReport } from 'Assemblies/Moderation/Roblox.Moderation/Entities/IReport';
import { Report } from 'Assemblies/Moderation/Roblox.Moderation/Entities/Report';

export default {
	method: 'all',
	func: async (_request: Request, response: Response) => {
		const remoteReports = await Report.GetReports();

		const results = [];

		for (let i = 0; i < remoteReports.length; i++) {
			const formattedResults: IReport = { ...remoteReports[i], Created: undefined, Updated: undefined };
			results.push(KeyValueMapping.BringKeyMapKeysToUppercase(formattedResults));
		}

		response.send({ error: 0, msg: 'Success', result: results });
	},
};
