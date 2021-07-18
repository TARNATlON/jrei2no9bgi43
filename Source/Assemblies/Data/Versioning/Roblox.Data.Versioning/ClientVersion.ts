import { Convert } from 'System/Convert';
import { Task } from 'System/Threading/Task';
import { PartialDatabaseConditionType } from 'Assemblies/Mssql/Roblox.Mssql.PartialDatabase/Enumeration/PartialDatabaseConditionType';
import { PartialDatabase } from 'Assemblies/Mssql/Roblox.Mssql.PartialDatabase/Implementation/PartialDatabase';
import { DFLog, DYNAMIC_LOGGROUP, FASTLOGS } from 'Assemblies/Web/Util/Roblox.Web.Util/Logging/FastLog';
import { IClientVersion } from './IClientVersion';

DYNAMIC_LOGGROUP('Tasks');

export class ClientVersion implements IClientVersion {
	ID: number;
	Name: string;
	MD5Hash: string;
	Version: string;
	SecurityVersion: string;
	CDNVersion: string;
	Created: string;
	Updated: string;
	UseInVersionCompatibility: bool;

	private static isConnected: boolean;
	private static connectionAttemptRunning: boolean;
	private static dataBase: PartialDatabase;

	private static async connectIfNotConnected(): Task<void> {
		return new Promise<void>(async (resumeFunction) => {
			if (!this.connectionAttemptRunning) {
				this.connectionAttemptRunning = true;
				this.dataBase = new PartialDatabase('RobloxVersioning', 'root', 'Io9/9DEF');
				const [didConnect, errMessage] = await this.dataBase.Connect();
				if (!didConnect) {
					FASTLOGS(DFLog('Tasks'), '[DFLog::Tasks] Error when connecting to DB: %s', errMessage);
					return false;
				}
				this.isConnected = didConnect;
				this.connectionAttemptRunning = false;
				resumeFunction();
			} else {
				setTimeout(async () => await this.connectIfNotConnected(), 50);
				return;
			}
		});
	}

	public static async GetByName(name: string) {
		if (!this.isConnected) await this.connectIfNotConnected();
		const [, , ClientVersions] = this.dataBase.GetTable<IClientVersion>('ClientVersion', 'ID', true);
		const [, , result] = await ClientVersions.SelectAllWhere({
			Key: 'Name',
			Condition: PartialDatabaseConditionType.Equal,
			Value: name,
		});

		const thisVersion = result.Rows[0];

		if (!thisVersion) return null;

		const version = new ClientVersion();
		version.Name = name;
		version.ID = <number>(<unknown>thisVersion.Data[0].Value);
		version.MD5Hash = <string>(<unknown>thisVersion.Data[1].Value);
		version.Version = <string>(<unknown>thisVersion.Data[2].Value);
		version.SecurityVersion = <string>(<unknown>thisVersion.Data[3].Value);
		version.CDNVersion = <string>(<unknown>thisVersion.Data[4].Value);
		version.Created = <string>(<unknown>thisVersion.Data[5].Value);
		version.Updated = <string>(<unknown>thisVersion.Data[6].Value);
		version.UseInVersionCompatibility = Convert.ToBoolean(thisVersion.Data[7].Value);

		return version;
	}

	public static async GetById(id: number) {
		if (!this.isConnected) await this.connectIfNotConnected();
		const [, , ClientVersions] = this.dataBase.GetTable<IClientVersion>('ClientVersion', 'ID', true);
		const [, , result] = await ClientVersions.SelectKeyWhere('Name', {
			Key: 'ID',
			Condition: PartialDatabaseConditionType.Equal,
			Value: id,
		});
		if (!result) return null;
		const thisVersion = result.Rows[0];

		if (!thisVersion) return null;

		return await this.GetByName(<string>thisVersion.Data[0].Value);
	}

	public static async GetAllLatestMD5HashesForUniqueClients() {
		if (!this.isConnected) await this.connectIfNotConnected();
		const [, , ClientVersions] = this.dataBase.GetTable<IClientVersion>('ClientVersion', 'ID', true);
		const [success, errorMessage, result] = await ClientVersions.SelectKeys(['MD5Hash', 'UseInVersionCompatibility']);
		if (!success) throw errorMessage;
		if (!result) return [];
		if (result.Rows.length < 1) return [];

		const md5Hashes = [];

		result.Rows.forEach((version, idx) => {
			const latestClientMD5Hash = <string>version.Data[0].Value;
			const useInVersionCompatibility = Convert.ToBoolean(version.Data[1].Value);
			if (!useInVersionCompatibility) return;
			md5Hashes.push(latestClientMD5Hash);
		});

		return md5Hashes;
	}

	public static async GetAllLatestSecurityVersionsForUniqueClients() {
		if (!this.isConnected) await this.connectIfNotConnected();
		const [, , ClientVersions] = this.dataBase.GetTable<IClientVersion>('ClientVersion', 'ID', true);
		const [success, errorMessage, result] = await ClientVersions.SelectKeys(['SecurityVersion', 'UseInVersionCompatibility']);
		if (!success) throw errorMessage;
		if (!result) return [];
		if (result.Rows.length < 1) return [];

		const securityVersions = [];

		result.Rows.forEach((version, idx) => {
			const latestSecurityVersions = <string>version.Data[0].Value;
			const useInVersionCompatibility = Convert.ToBoolean(version.Data[1].Value);
			if (!useInVersionCompatibility) return;
			securityVersions.push(latestSecurityVersions);
		});

		return securityVersions;
	}

	public static async GetAllClientVersions() {
		if (!this.isConnected) await this.connectIfNotConnected();
		const [, , ClientVersions] = this.dataBase.GetTable<IClientVersion>('ClientVersion', 'ID', true);
		const [success, errorMessage, result] = await ClientVersions.SelectAll();
		if (!success) throw errorMessage;
		if (!result) return [];
		if (result.Rows.length < 1) return [];

		const clientVersions: ClientVersion[] = [];

		result.Rows.forEach((thisVersion, idx) => {
			const version = new ClientVersion();

			version.ID = <long>thisVersion.Data[0].Value;
			version.Name = <string>thisVersion.Data[1].Value;
			version.MD5Hash = <string>thisVersion.Data[2].Value;
			version.Version = <string>thisVersion.Data[3].Value;
			version.SecurityVersion = <string>thisVersion.Data[4].Value;
			version.CDNVersion = <string>thisVersion.Data[5].Value;
			version.Created = <string>thisVersion.Data[6].Value;
			version.Updated = <string>thisVersion.Data[7].Value;
			version.UseInVersionCompatibility = Convert.ToBoolean(thisVersion.Data[8].Value);

			clientVersions.push(version);
		});

		return clientVersions;
	}
}
