import { RobloxDatabase } from 'Assemblies/Mssql/Roblox.Mssql/RobloxDatabase';
import { SqlParameter } from 'System/Data/SqlClient/SqlParameter';

export class RobloxDataAccessPatternExtensions {
	/**
	 * Gets an entity ID, used by ID lookup.
	 * @param {RobloxDatabase} database A shared base class that can be either a Roblox.Mssql.Database, or Roblox.Mssql.GuardedDatabase
	 * @param {string} storedProcedureName The stored procedure name to execute
	 * @param {float} commandTimeout The command timeout in milliseconds
	 * @param {bool} includeApplicationIntent Should include System.Data.ApplicationIntent
	 * @param {SqlParameter[]} queryParameters Optional parameters for procedure execution
	 * @returns {TIndex} Returns the typeof your ID property.
	 */
	public static GetID<TIndex>(
		database: RobloxDatabase,
		storedProcedureName: string,
		commandTimeout?: float,
		includeApplicationIntent: bool = false,
		queryParameters: SqlParameter[] = null,
	): TIndex {
		return null;
	}
}
