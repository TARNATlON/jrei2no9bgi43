import { SortOrder } from 'Assemblies/DataV2/Core/Roblox.DataV2.Core/SortOrder';

/**
 * A model containing information needed for interaction with start key based paging methods.
 * @template TExclusiveStartKey The type of the exclusive start ID.
 */
export interface IExclusiveStartKeyInfo<TExclusiveStartKey> {
	/**
	 * Gets the sort order.
	 */
	readonly SortOrder: SortOrder;

	/**
	 * Gets the page size.
	 */
	readonly Count: int;

	/**
	 * The exclusive start key value.
	 * @param {TExclusiveStartKey} exclusiveStartKey The exclusive start key value.
	 * @returns True if an exclusive start key was successfully retrieved, otherwise false.
	 */
	TryGetExclusiveStartKey(exclusiveStartKey: TExclusiveStartKey): [bool];
}
