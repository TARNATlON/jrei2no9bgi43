import { ApiArrayResponse } from './ApiArrayResponse';

/**
 * The API standard pagination response. This is supposed to only be used for public endpoints.
 */
export class ApiPageResponse<TPagedItem> extends ApiArrayResponse<TPagedItem> {
	/**
	 * Gets or sets the exclusive start key for the previous page of results.
	 */
	public PreviousPageCursor: string;

	/**
	 * Gets or sets the exclusive start key for the next page of results.
	 */
	public NextPageCursor: string;
}
