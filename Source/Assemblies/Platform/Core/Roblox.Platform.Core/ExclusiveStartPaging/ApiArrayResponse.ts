import { ArgumentNullException } from 'System/ArgumentNullException';

/**
 * The API standard array response.
 */
export class ApiArrayResponse<TItem> {
	/**
	 * Gets or sets the data of the array.
	 */
	public Data: TItem[];

	/**
	 * Initializes a new T:Roblox.Platform.Core.ExclusiveStartPaging.ApiArrayResponse`1 with P:Roblox.Platform.Core.ExclusiveStartPaging.ApiArrayResponse`1.Data unset or set.
	 * @param {TItem[]}data The items for the response.
	 * @exception ArgumentNullException data
	 */
	public constructor(data?: TItem[]) {
		if (data === null) {
			throw new ArgumentNullException('data');
		}

		this.Data = data;
	}
}
