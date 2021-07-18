import { IDisposable } from 'System/IDisposable';
import { IEnumeratorBase } from 'System/Collections/IEnumeratorBase';

export interface IEnumerator<T> extends IDisposable, IEnumeratorBase {
	readonly Current: T;
}
