/**
 * Used for enumerative paging to decide direction
 */
export enum PagingDirection {
	/**
	 * The default value. This is suppposed to be unused and invalid.
	 */
	Unspecified,

	/**
	 * The cursor is being paged forwards, which is the same direction as specified by Roblox.DataV2.Core.SortOrder
	 */
	Forward,

	/**
	 * The cursor is being paged backwards, which is the opposite direction as specified by Roblox.DataV2.Core.SortOrder
	 */
	Backward,
}
