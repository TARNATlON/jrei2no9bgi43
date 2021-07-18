import { IExclusiveStartKeyInfo } from './IExclusiveStartKeyInfo';
import { PagingDirection } from './PagingDirection';

/**
 * A model to use to make requests to get a T:Roblox.Platform.Core.ExclusiveStartPaging.PageResponse\`2
 * @template TExclusiveStartKey The type of the exclusiveStartKey.
 */
export interface IPagingParameters<TExclusiveStartKey> {
	/**
	 * Gets the direction in which the cursor is paging.
	 */
	readonly PagingDirection: PagingDirection;

	/**
	 * Gets the P:Roblox.Platform.Core.ExclusiveStartPaging.IPagingParameters`1.ExclusiveStartKeyInfo
	 */
	readonly ExclusiveStartKeyInfo: IExclusiveStartKeyInfo<TExclusiveStartKey>;
}
