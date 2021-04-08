import { DFLog, DYNAMIC_LOGGROUP, FASTLOGS } from '../../../Helpers/WebHelpers/Roblox.Util/Roblox.Util.FastLog';
import { Task } from '../../../Http/Task';
import { PartialDataBase } from '../../../PartialDatabase/PartialDataBase';
import { PartialDatabaseConditionType } from '../../../PartialDatabase/PartialDatabaseConditionType';
import { SanitizeData } from '../../../Util/SanitizeData';
import { ICounter } from './ICounter';

DYNAMIC_LOGGROUP('Tasks');
export class Counter implements ICounter {
	public Id: number;
	public Name: string;
	public Count: number;

	private static isConnected: boolean;
	private static connectionAttemptRunning: boolean;
	private static dataBase: PartialDataBase;

	private static async connectIfNotConnected(): Task<void> {
		return new Promise<void>(async (resumeFunction) => {
			if (!this.connectionAttemptRunning) {
				this.connectionAttemptRunning = true;
				this.dataBase = new PartialDataBase('RobloxAnalytics', 'root', 'Io9/9DEF');
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

	public static async CreateOrIncrementCounter(Name: string, Amount: number): Task<boolean> {
		if (!Amount) Amount = 1;
		Name = SanitizeData(Name);
		if (!this.isConnected) await this.connectIfNotConnected();

		const [, , counters] = this.dataBase.GetTable<ICounter>('counter', 'Id', true);

		const [, , result] = await counters.SelectKeyWhere('Count', {
			Key: 'Name',
			Condition: PartialDatabaseConditionType.Equal,
			Value: Name,
		});

		const thisCounter = result.Rows[0];

		if (!thisCounter) {
			// The counter did not exist, so we are going to create one and write the single data.
			const [didInsert, errMessage] = await counters.InsertValues([
				{ Key: 'Name', Value: Name },
				{ Key: 'Count', Value: Amount },
			]);

			if (!didInsert) {
				FASTLOGS(DFLog['Tasks'], '[DFLog::Tasks] Error Updating Counter %s', errMessage);
				throw errMessage;
			}

			return true;
		}
		let originalAmout = parseInt(<string>thisCounter.Data[0].Value);
		if (isNaN(originalAmout)) return true;
		originalAmout += Amount;

		const [didUpdate, errMsg] = await counters.UpdateKey('Count', originalAmout, {
			Key: 'Name',
			Condition: PartialDatabaseConditionType.Equal,
			Value: Name,
		});

		if (!didUpdate) {
			FASTLOGS(DFLog['Tasks'], '[DFLog::Tasks] Error Updating Counter %s', errMsg);
			throw errMsg;
		}
		return true;
	}
}
