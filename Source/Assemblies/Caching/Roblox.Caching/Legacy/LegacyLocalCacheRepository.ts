import {
	DFLog,
	DYNAMIC_LOGVARIABLE,
	FASTLOG,
	FASTLOG1,
	FASTLOG2,
	FASTLOGNOFILTER,
	FASTLOGS,
} from 'Assemblies/Web/Util/Roblox.Web.Util/Logging/FastLog';
import { CachePolicy } from './Enumeration/CachePolicy';
import { LocalCacheHelper } from './LocalCache/Helper';

DYNAMIC_LOGVARIABLE('LocalCache', 7);

export class LegacyLocalCacheRepository {
	public constructor(cacheStoreName: string, policy: CachePolicy) {
		this._Name = cacheStoreName;
		LocalCacheHelper.RegisterLocalCacheStore(cacheStoreName);
		FASTLOGS(DFLog('LocalCache'), "[DFLog::LocalCache] Register Local Cache Store for '%s'", cacheStoreName);
		this.RegisterResetRoundRobin(policy);
	}

	public get Name() {
		return this._Name;
	}

	public get IsCacheClear() {
		return LocalCacheHelper.GetLocalCacheSize(this._Name) === 0;
	}

	public KillReset() {
		if (this._CacheRefreshIntervalTimer) {
			this._CacheRefreshIntervalTimer.unref();
		}
	}

	public Clear() {
		LocalCacheHelper.ClearLocalCacheStore(this._Name);
	}

	public GetAllCachedValues() {
		return LocalCacheHelper.GetAllLocalCacheValues(this._Name);
	}

	public GetCachedValue(key: string): [bool, string] {
		FASTLOG2(DFLog('LocalCache'), "[DFLog::LocalCache] Try get value '%s' from the local cache store '%s'.", key, this._Name);
		if (this._DoNotCache) {
			FASTLOG(DFLog('LocalCache'), '[DFLog::LocalCache] DoNotCache 1, returning false.');
			return [false, null];
		}

		const [hasKey, cachedValue] = LocalCacheHelper.GetLocalCacheValue(this._Name, key);

		if (hasKey) {
			FASTLOG2(
				DFLog('LocalCache'),
				"[DFLog::LocalCache] The value '%s' from the local cache store '%s' was present.",
				key,
				this._Name,
			);
			return [true, cachedValue];
		}
		FASTLOG2(
			DFLog('LocalCache'),
			"[DFLog::LocalCache] The collection '%s' from the local cache store '%s' was not present.",
			key,
			this._Name,
		);
		return [false, null];
	}

	public GetCachedValueJson<T>(key: string, returnTrueValueIfParseFail: bool = false): [bool, T] {
		FASTLOG2(DFLog('LocalCache'), "[DFLog::LocalCache] Try get value '%s' from the local cache store '%s'.", key, this._Name);
		if (this._DoNotCache) {
			FASTLOG(DFLog('LocalCache'), '[DFLog::LocalCache] DoNotCache 1, returning false.');
			return [false, null];
		}

		const [hasKey, cachedValue] = LocalCacheHelper.GetLocalCacheValue(this._Name, key);

		if (hasKey) {
			FASTLOG2(
				DFLog('LocalCache'),
				"[DFLog::LocalCache] The value '%s' from the local cache store '%s' was present.",
				key,
				this._Name,
			);

			try {
				return [true, <T>JSON.parse(cachedValue)];
			} catch {
				FASTLOG2(
					DFLog('LocalCache'),
					"[DFLog::LocalCache] The value '%s' from the local cache store '%s' could not be parsed as json, returning the true value if returnTrue set.",
					key,
					this._Name,
				);
				if (returnTrueValueIfParseFail) return [true, <T>(<unknown>cachedValue)];
				return [false, null];
			}
		}
		FASTLOG2(
			DFLog('LocalCache'),
			"[DFLog::LocalCache] The collection '%s' from the local cache store '%s' was not present.",
			key,
			this._Name,
		);
		return [false, null];
	}

	public GetCachedValueNumber(key: string, returnTrueValueIfParseFail: bool = false): [bool, int] {
		FASTLOG2(DFLog('LocalCache'), "[DFLog::LocalCache] Try get value '%s' from the local cache store '%s'.", key, this._Name);
		if (this._DoNotCache) {
			FASTLOG(DFLog('LocalCache'), '[DFLog::LocalCache] DoNotCache 1, returning false.');
			return [false, null];
		}

		const [hasKey, cachedValue] = LocalCacheHelper.GetLocalCacheValue(this._Name, key);

		if (hasKey) {
			FASTLOG2(
				DFLog('LocalCache'),
				"[DFLog::LocalCache] The value '%s' from the local cache store '%s' was present.",
				key,
				this._Name,
			);

			const val = parseFloat(cachedValue);

			if (isNaN(val)) {
				FASTLOG2(
					DFLog('LocalCache'),
					"[DFLog::LocalCache] The value '%s' from the local cache store '%s' could not be parsed as json, returning the true value if returnTrue set.",
					key,
					this._Name,
				);
				if (returnTrueValueIfParseFail) return [true, <int>(<unknown>cachedValue)];
				return [false, null];
			}

			return [true, val];
		}
		FASTLOG2(
			DFLog('LocalCache'),
			"[DFLog::LocalCache] The collection '%s' from the local cache store '%s' was not present.",
			key,
			this._Name,
		);
		return [false, null];
	}

	public SetCachedValue(key: string, value: string): string {
		FASTLOG2(
			DFLog('LocalCache'),
			"[DFLog::LocalCache] Set local cache store value for key '%s' to '%s'",
			key,
			value.trim().split('\r\n').join('\\r\\n'),
		);
		if (this._DoNotCache) {
			FASTLOG(DFLog('LocalCache'), '[DFLog::LocalCache] DoNotCache 1, returning.');
			return null;
		}
		return LocalCacheHelper.SetLocalCachedValue(this._Name, key, value);
	}

	public SetCachedValueJson<T>(key: string, value: T): T {
		FASTLOG2(
			DFLog('LocalCache'),
			"[DFLog::LocalCache] Set local cache store value for key '%s' to '%s'",
			key,
			typeof value === 'string' ? value.trim().split('\r\n').join('\\r\\n') : value instanceof Object ? JSON.stringify(value) : value,
		);
		if (this._DoNotCache) {
			FASTLOG(DFLog('LocalCache'), '[DFLog::LocalCache] DoNotCache 1, returning.');
			return null;
		}

		LocalCacheHelper.SetLocalCachedValue(this._Name, key, JSON.stringify(value));

		return value;
	}

	public SetCachedValueNumber(key: string, value: int): int {
		FASTLOG2(DFLog('LocalCache'), "[DFLog::LocalCache] Set local cache store value for key '%s' to '%d'", key, value);
		if (this._DoNotCache) {
			FASTLOG(DFLog('LocalCache'), '[DFLog::LocalCache] DoNotCache 1, returning.');
			return null;
		}

		LocalCacheHelper.SetLocalCachedValue(this._Name, key, value.toString());

		return value;
	}

	public GetCachedValueOrCacheNewValue(key: string, value: string): string {
		let [presentInCache, cachedValue] = this.GetCachedValue(key);

		if (presentInCache) return cachedValue;

		return this.SetCachedValue(key, value);
	}

	public GetCachedValueOrCacheNewValueJson<T>(key: string, value: T): T {
		let [presentInCache, cachedValue] = this.GetCachedValueJson<T>(key);

		if (presentInCache) return cachedValue;

		return this.SetCachedValueJson(key, value);
	}

	public RemoveKey(key: string) {
		LocalCacheHelper.DeleteLocalCachedValue(this._Name, key);
	}

	private static CalculateResetMsForStatePolicy(policy: CachePolicy) {
		FASTLOG1(DFLog('LocalCache'), '[DFLog::LocalCache] Try get the policy timout for CachePolicy[%d]', policy);

		let timeOut = null;

		switch (policy) {
			case CachePolicy.DoNotCache:
				timeOut = null;
				break;
			case CachePolicy.NoReset:
				timeOut = -1;
				break;
			case CachePolicy.StaleAfterFiveSeconds:
				timeOut = 5000;
				break;
			case CachePolicy.StaleAfterTenSeconds:
				timeOut = 10000;
				break;
			case CachePolicy.SateAfterThirtySeconds:
				timeOut = 30000;
				break;
			case CachePolicy.StaleAfterOneMinute:
				timeOut = 60000;
				break;
			case CachePolicy.StaleAfterTwoMinutes:
				timeOut = 120000;
				break;
			case CachePolicy.StaleAfterFiveMinutes:
				timeOut = 300000;
				break;
			case CachePolicy.StaleAfterTenMinutes:
				timeOut = 600000;
				break;
			case CachePolicy.StaleAfterFifteenMinutes:
				timeOut = 900000;
				break;
			case CachePolicy.StateAfterThirtyMinutes:
				timeOut = 1.8e6;
				break;
			case CachePolicy.StaleAfterOneHour:
				timeOut = 3.6e6;
				break;
		}

		FASTLOG2(DFLog('LocalCache'), '[DFLog::LocalCache] The policy timout for CachePolicy[%d] = %d', policy, timeOut || 0);

		return timeOut;
	}

	private RegisterResetRoundRobin(policy: CachePolicy) {
		if (!this._PersistentRoundRobinState.WasRegisteredForCacheReset) {
			FASTLOG(DFLog('LocalCache'), '[DFLog::LocalCache] Try register the local cache store.');
			const cacheRefreshInterval = LegacyLocalCacheRepository.CalculateResetMsForStatePolicy(policy);
			this._DoNotCache = cacheRefreshInterval === null;
			FASTLOG(DFLog('LocalCache'), '[DFLog::LocalCache] Round robin was not registered recently, register it.');
			this._PersistentRoundRobinState.WasRegisteredForCacheReset = true;
			if (cacheRefreshInterval !== null && cacheRefreshInterval !== -1)
				this._CacheRefreshIntervalTimer = setInterval(() => {
					const cacheStoreSize = LocalCacheHelper.GetLocalCacheSize(this._Name);
					if (cacheStoreSize > 0) {
						FASTLOGNOFILTER(
							DFLog('LocalCache'),
							`[DFlog::LocalCache] Perform Round Robin cache clearance on cache store, count of ${this._Name}(${cacheStoreSize})`,
						);

						LocalCacheHelper.ClearLocalCacheStore(this._Name);
					}
				}, cacheRefreshInterval);
		}
	}

	private readonly _PersistentRoundRobinState = {
		WasRegisteredForCacheReset: false,
	};

	private _DoNotCache: bool = false;

	private _Name: string;

	private _CacheRefreshIntervalTimer: NodeJS.Timer;
}
