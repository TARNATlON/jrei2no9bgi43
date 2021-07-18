import { ArgumentOutOfRangeException } from 'System/ArgumentOutOfRangeException';
import { SortOrder } from 'Assemblies/DataV2/Core/Roblox.DataV2.Core/SortOrder';
import { IPagingParameters } from './IPagingParameters';

/**
 * A model to hold basic information about exclusive start paged requests. Can be extended by inheriting from it.
 */
export class ApiPagingParameters<TExclusiveStartKey> {
	/**
	 * Gets or sets the order in which results are being requested.
	 * This is used to verify the consistency of the request if the P:Roblox.Platform.Core.ExclusiveStartPaging.ApiPagingParameters`1.Cursor is specified.
	 */
	public SortOrder: SortOrder;

	/**
	 * Gets or sets the number of results being requested.
	 */
	public Limit?: int;

	/**
	 * Gets or sets the exclusive start key cursor for the previous or next page of results.
	 */
	public Cursor: string;

	/**
	 * Gets or sets the T:Roblox.Platform.Core.ExclusiveStartPaging.IPagingParameters`1 created from an T:Roblox.Platform.Core.ExclusiveStartPaging.ApiPagingParameters`1
	 * The sort order on P:Roblox.Platform.Core.ExclusiveStartPaging.IPagingParameters`1.ExclusiveStartKeyInfo is reversed from the one on the T:Roblox.Platform.Core.ExclusiveStartPaging.ApiPagingParameters`1
	 * if the cursor is parsed with a P:Roblox.Platform.Core.ExclusiveStartPaging.IPagingParameters`1.PagingDirection of F:Roblox.Platform.Core.ExclusiveStartPaging.PagingDirection.Backward
	 * @remarks This property cannot be public due to the way query parameters in models are handled.
	 */
	public PagingParameters: IPagingParameters<TExclusiveStartKey>;

	/**
	 * Constructor for serialization and deserialization.
	 * @param {SortOrder} sortOrder The T:Roblox.DataV2.Core.SortOrder
	 * @param {int} limit The size of the page.
	 * @param {string} cursor The string cursor used to paginate.
	 */
	public constructor(sortOrder: SortOrder = 0, limit: int = null, cursor: string = null) {
		if (sortOrder === <SortOrder>0 && limit === null && cursor === null) return;

		let num = limit;
		let num1 = 1;

		if (!((num || 0) < num1 && num !== null)) {
			num = limit;
			num1 = 100;

			if (!(num > num1 && num !== null)) {
				this.Limit = limit;
				this.SortOrder = sortOrder;
				this.Cursor = cursor;
				return;
			}
		}

		throw new ArgumentOutOfRangeException('limit cannot be less than 1 or greater than 100.');
	}

	/**
	 * The default Limit.
	 */
	public static DefaultLimit: int = 10;

	/**
	 * The default T:Roblox.DataV2.Core.SortOrder
	 */
	public static DefaultSortOrder: SortOrder = SortOrder.Asc;
}
