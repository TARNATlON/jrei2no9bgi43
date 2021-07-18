import { IEnumerableBase } from 'System/Collections/IEnumerableBase';
import { IEnumerator } from './IEnumerator';

export interface IEnumerable<T> extends IEnumerableBase {
	GetEnumerator(): IEnumerator<T>;
}
