import {
	DFLog,
	DYNAMIC_LOGVARIABLE,
	FASTLOG,
	FASTLOG1,
	FASTLOG2,
	FASTLOG3,
	FASTLOGNOFILTER,
	FASTLOGS,
} from 'Assemblies/Web/Util/Roblox.Web.Util/Logging/FastLog';
import { CachePolicy } from './Enumeration/CachePolicy';

DYNAMIC_LOGVARIABLE('MemCached', 7);
DYNAMIC_LOGVARIABLE('MemCachedRun', 0);

export class LegacyMemcachedRepository {
	public constructor(cacheStoreName: string, policy: CachePolicy) {
		this._Name = cacheStoreName;
		this._MemcacheStore.clear();
		FASTLOGS(DFLog('MemCached'), "[DFLog::MemCached] Register MemCached for '%s'", cacheStoreName);
		this.RegisterResetRoundRobin(policy);
	}

	public get Name() {
		return this._Name;
	}

	public get IsCacheClear() {
		return this._MemcacheStore.size === 0;
	}

	public KillReset() {
		if (this._CacheRefreshIntervalTimer) {
			this._CacheRefreshIntervalTimer.unref();
		}
	}

	public Clear() {
		this._MemcacheStore.clear();
	}

	public GetAllCachedValues() {
		return this._MemcacheStore;
	}

	public GetCachedValue(key: string): [bool, string] {
		FASTLOG2(DFLog('MemCached'), "[DFLog::MemCached] Try get value '%s' from the memcached store '%s'.", key, this._Name);
		if (this._DoNotCache) {
			FASTLOG(DFLog('MemCached'), '[DFLog::MemCached] DoNotCache 1, returning false.');
			return [false, null];
		}

		if (this._MemcacheStore.has(key)) {
			FASTLOG2(DFLog('MemCached'), "[DFLog::MemCached] The value '%s' from the memcached store '%s' was present.", key, this._Name);
			return [true, this._MemcacheStore.get(key)];
		}
		FASTLOG2(
			DFLog('MemCached'),
			"[DFLog::MemCached] The collection '%s' from the memcached store '%s' was not present.",
			key,
			this._Name,
		);
		return [false, null];
	}

	public SetCachedValue(key: string, value: string): string {
		FASTLOG2(
			DFLog('MemCached'),
			"[DFLog::MemCached] Set memcached store value for key '%s' to '%s'",
			key,
			value.trim().split('\r\n').join('\\r\\n'),
		);
		if (this._DoNotCache) {
			FASTLOG(DFLog('MemCached'), '[DFLog::MemCached] DoNotCache 1, returning.');
			return null;
		}
		this._MemcacheStore.set(key, value);

		return value;
	}

	public SetCachedValueJson<T>(key: string, value: T): T {
		FASTLOG2(
			DFLog('MemCached'),
			"[DFLog::MemCached] Set memcached store value for key '%s' to '%s'",
			key,
			typeof value === 'string' ? value.trim().split('\r\n').join('\\r\\n') : value instanceof Object ? JSON.stringify(value) : value,
		);
		if (this._DoNotCache) {
			FASTLOG(DFLog('MemCached'), '[DFLog::MemCached] DoNotCache 1, returning.');
			return null;
		}
		this._MemcacheStore.set(key, JSON.stringify(value));

		return value;
	}

	public SetCachedValueNumber(key: string, value: int): int {
		FASTLOG2(DFLog('MemCached'), "[DFLog::MemCached] Set memcached store value for key '%s' to '%d'", key, value);
		if (this._DoNotCache) {
			FASTLOG(DFLog('MemCached'), '[DFLog::MemCached] DoNotCache 1, returning.');
			return null;
		}
		this._MemcacheStore.set(key, value.toString());

		return value;
	}

	public GetCachedValueJson<T>(key: string, returnTrueValueIfParseFail: bool = false): [bool, T] {
		FASTLOG2(DFLog('MemCached'), "[DFLog::MemCached] Try get value '%s' from the memcached store '%s'.", key, this._Name);
		if (this._DoNotCache) {
			FASTLOG(DFLog('MemCached'), '[DFLog::MemCached] DoNotCache 1, returning false.');
			return [false, null];
		}

		if (this._MemcacheStore.has(key)) {
			const cachedValue = this._MemcacheStore.get(key);
			FASTLOG2(DFLog('MemCached'), "[DFLog::MemCached] The value '%s' from the memcached store '%s' was present.", key, this._Name);
			try {
				return [true, <T>JSON.parse(cachedValue)];
			} catch {
				FASTLOG2(
					DFLog('MemCached'),
					"[DFLog::MemCached] The value '%s' from the local cache store '%s' could not be parsed as json, returning the true value if returnTrue set.",
					key,
					this._Name,
				);
				if (returnTrueValueIfParseFail) return [true, <T>(<unknown>cachedValue)];
				return [false, null];
			}
		}
		FASTLOG2(
			DFLog('MemCached'),
			"[DFLog::MemCached] The collection '%s' from the memcached store '%s' was not present.",
			key,
			this._Name,
		);
		return [false, null];
	}

	public GetCachedValueNumber(key: string, returnTrueValueIfParseFail: bool = false): [bool, int] {
		FASTLOG2(DFLog('MemCached'), "[DFLog::MemCached] Try get value '%s' from the memcached store '%s'.", key, this._Name);
		if (this._DoNotCache) {
			FASTLOG(DFLog('MemCached'), '[DFLog::MemCached] DoNotCache 1, returning false.');
			return [false, null];
		}

		if (this._MemcacheStore.has(key)) {
			const cachedValue = this._MemcacheStore.get(key);
			FASTLOG2(DFLog('MemCached'), "[DFLog::MemCached] The value '%s' from the memcached store '%s' was present.", key, this._Name);
			const val = parseFloat(cachedValue);

			if (isNaN(val)) {
				FASTLOG2(
					DFLog('MemCached'),
					"[DFLog::MemCached] The value '%s' from the local cache store '%s' could not be parsed as a number, returning the true value if returnTrue set.",
					key,
					this._Name,
				);
				if (returnTrueValueIfParseFail) return [true, <int>(<unknown>cachedValue)];
				return [false, null];
			}

			return [true, val];
		}
		FASTLOG2(
			DFLog('MemCached'),
			"[DFLog::MemCached] The collection '%s' from the memcached store '%s' was not present.",
			key,
			this._Name,
		);
		return [false, null];
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

	public GetCachedValueOrCacheNewValueNumber(key: string, value: int): int {
		let [presentInCache, cachedValue] = this.GetCachedValueNumber(key, true);

		if (presentInCache) return cachedValue;

		return this.SetCachedValueNumber(key, value);
	}

	public RemoveKey(key: string) {
		this._MemcacheStore.delete(key);
	}

	private static CalculateResetMsForStatePolicy(policy: CachePolicy) {
		FASTLOG1(DFLog('MemCached'), '[DFLog::MemCached] Try get the policy timout for CachePolicy[%d]', policy);

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

		FASTLOG2(DFLog('MemCached'), '[DFLog::MemCached] The policy timout for CachePolicy[%d] = %d', policy, timeOut || 0);

		return timeOut;
	}

	private RegisterResetRoundRobin(policy: CachePolicy) {
		if (!this._PersistentRoundRobinState.WasRegisteredForCacheReset) {
			FASTLOG(DFLog('MemCached'), '[DFLog::MemCached] Try register the mem cached cache store.');
			const cacheRefreshInterval = LegacyMemcachedRepository.CalculateResetMsForStatePolicy(policy);
			this._DoNotCache = cacheRefreshInterval === null;
			FASTLOG(DFLog('MemCached'), '[DFLog::MemCached] Round robin was not registered recently, register it.');
			this._PersistentRoundRobinState.WasRegisteredForCacheReset = true;
			if (cacheRefreshInterval !== null && cacheRefreshInterval !== -1)
				this._CacheRefreshIntervalTimer = setInterval(() => {
					if (this._MemcacheStore.size > 0) {
						FASTLOGNOFILTER(
							DFLog('MemCached'),
							`[DFlog::MemCached] Perform Round Robin cache clearance on cache store, count of ${this._Name}(${this._MemcacheStore.size})`,
						);

						this.RunTheRoundRobinRunThrough();

						this._MemcacheStore.clear();
					}
				}, cacheRefreshInterval);
		}
	}

	private readonly _MemcacheStore = new Map<string, string>();

	private readonly _PersistentRoundRobinState = {
		WasRegisteredForCacheReset: false,
	};

	private _DoNotCache: bool = false;

	private _Name: string;

	private RunTheRoundRobinRunThrough() {
		if (DFLog('MemCachedRun') > 5) {
			this._MemcacheStore.forEach((memcachedValue, memcachedKey) => {
				FASTLOG3(
					DFLog('MemCachedRun'),
					'[DFlog::MemCachedRun] Run through %s, Key: %s, value: %s.',
					this._Name,
					memcachedKey,
					memcachedValue.trim().split('\r\n').join('\\r\\n'),
				);
			});
		}
	}

	private _CacheRefreshIntervalTimer: NodeJS.Timer;
}
