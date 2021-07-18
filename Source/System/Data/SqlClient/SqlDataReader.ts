import { IEnumeratorBase } from 'System/Collections/IEnumeratorBase';
import { IDisposable } from 'System/IDisposable';
import { DbDataReader } from 'System/Data/Common/DbDataReader';
import { IDataReader } from 'System/Data/IDataReader';
import { IDataRecord } from 'System/Data/IDataRecord';

export class SqlDataReader extends DbDataReader implements IDataReader, IDisposable, IDataRecord {
	public GetEnumerator?(): IEnumeratorBase {
		throw new Error('Method not implemented.');
	}
	public Depth: number;
	public FieldCount: number;
	public HasRows: boolean;
	public IsClosed: boolean;
	public RecordsAffected: boolean;
	public NextResult(): boolean {
		throw new Error('Method not implemented.');
	}
	public Read(): boolean {
		throw new Error('Method not implemented.');
	}
	[k: string]: any;
}
