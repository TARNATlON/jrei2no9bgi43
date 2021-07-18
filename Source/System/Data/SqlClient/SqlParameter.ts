// import { DBNull } from 'System/DBNull';
// import { NotImplementedException } from 'System/NotImplementedException';
// import { Type } from 'System/Type';
// import { ICloneable } from 'System/ICloneable';
// import { DbParameter } from 'System/Data/Common/DbParameter';
// import { DataRowVersion } from 'System/Data/DataRowVersion';
// import { IDataParameter } from 'System/Data/IDataParameter';
// import { IDbDataParameter } from 'System/Data/IDbDataParameter';
// import { ParameterDirection } from 'System/Data/ParameterDirection';
import { SqlDbType } from 'System/Data/SqlDbType';
// import { INullable } from 'System/Data/SqlTypes/INullable';
// import { SqlBinary } from 'System/Data/SqlTypes/SqlBinary';
// import { MetaType } from './MetaType';
// import { SqlCipherMetadata } from './SqlCipherMetadata';
// import { SqlCollation } from './SqlCollation';

export class SqlParameter /* extends DbParameter implements IDbDataParameter, IDataParameter, ICloneable */ {
	public constructor(parameterName: string, dbType: SqlDbType);

	public constructor(parameterName: string, value: any);

	public constructor(parameterName?: string, dbType?: SqlDbType, value?: any);

	public constructor(parameterName?: string, dbType?: SqlDbType, value?: any) {
		// super();
		this._parameterName = parameterName;
		this._dbType = dbType;
		this._value = value;
		this._isNull = value === null;
	}

	public static FromDbType(parameterName: string, dbType: SqlDbType) {
		const out = new SqlParameter(parameterName, dbType, undefined);
		return out;
	}

	public static FromValue(parameterName: string, value: any) {
		const out = new SqlParameter(parameterName, undefined, value);
		return out;
	}

	public get ParameterName() {
		return this._parameterName;
	}

	public get IsNull() {
		return this._isNull;
	}

	public get DbType() {
		return this._dbType;
	}

	public get Value() {
		return this._value;
	}

	private _parameterName: string;

	private _isNull: bool;

	private _dbType: SqlDbType;

	private _value: any;
}
