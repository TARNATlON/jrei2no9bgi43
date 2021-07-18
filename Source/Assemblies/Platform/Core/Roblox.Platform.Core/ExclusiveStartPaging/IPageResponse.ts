import { SortOrder } from 'Assemblies/DataV2/Core/Roblox.DataV2.Core/SortOrder';

/**
 * A model to hold information about paged results that can be returned by an endpoint.
 * User for calls between internal components (eg. a public api and the backing service which provides the data)
 * @template TPagedItem The type of the paged items.
 */
export interface IPageResponse<TPagedItem> {
	/**
	 * Gets the max expected results.
	 */
	readonly Count: int;

	/**
	 * Gets the array of `TPagedItem` results.
	 */
	readonly Items: TPagedItem[];

	/**
	 * Gets the P:Roblox.Platform.Core.ExclusiveStartPaging.IPageResponse\`1.SortOrder of the P:Roblox.Platform.Core.ExclusiveStartPaging.IPageResponse\`1.Items
	 */
	readonly SortOrder: SortOrder;
}
