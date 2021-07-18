import { OutgoingMessage } from 'http';

export interface IPageOptions<R extends OutgoingMessage = OutgoingMessage> {
	cacheControl?: boolean;
	dotfiles?: string;
	etag?: boolean;
	extensions?: string[] | false;
	fallthrough?: boolean;
	immutable?: boolean;
	index?: boolean | string | string[];
	lastModified?: boolean;
	maxAge?: number | string;
	redirect?: boolean;
	setHeaders?: (res: R, path: string, stat: unknown) => unknown;
}
