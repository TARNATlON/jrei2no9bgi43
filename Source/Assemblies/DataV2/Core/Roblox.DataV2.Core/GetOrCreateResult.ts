export class GetOrCreateResult<TValue> {
	public Value: TValue;

	public Created: bool;

	public constructor(value: TValue, created: bool) {
		this.Value = value;
		this.Created = created;
	}
}
