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
import { LegacyLocalCacheRepository } from './LegacyLocalCacheRepository';
import { LegacyMemcachedRepository } from './LegacyMemcachedRepository';

DYNAMIC_LOGVARIABLE('Cache', 7);

export class LegacyCacheRepository {
	public constructor(repoName: string, policy: CachePolicy) {
		this._MemCache = new LegacyMemcachedRepository(repoName, CachePolicy.NoReset);
		this._LocalCache = new LegacyLocalCacheRepository(repoName, CachePolicy.NoReset);
		this._Name = repoName;
		FASTLOGS(DFLog('Cache'), "[DFLog::Cache] Register Cache Store for '%s'", repoName);
		this.RegisterResetRoundRobin(policy);
	}

	public KillReset() {
		if (this._CacheRefreshIntervalTimer) {
			this._CacheRefreshIntervalTimer.unref();
		}
	}

	public get Name() {
		return this._Name;
	}

	public get IsCacheClear() {
		return this._MemCache.IsCacheClear && this._LocalCache.IsCacheClear;
	}

	public Clear() {
		this._MemCache.Clear();
		this._LocalCache.Clear();
	}

	public GetCachedValueJson<T>(key: string): [bool, T] {
		FASTLOG2(DFLog('Cache'), "[DFLog::Cache] Try get value '%s' from the cache store '%s'.", key, this._Name);

		const [wasMemcached, memCacheValue] = this._MemCache.GetCachedValueJson<T>(key);

		if (wasMemcached) {
			FASTLOG2(DFLog('Cache'), "[DFLog::Cache] The value '%s' from the memcached store '%s' was present.", key, this._Name);
			return [true, memCacheValue];
		}
		FASTLOG2(
			DFLog('Cache'),
			"[DFLog::Cache] The collection '%s' from the memcached store '%s' was not present, try check local cache.",
			key,
			this._Name,
		);

		const [wasLocalCached, localCacheValue] = this._LocalCache.GetCachedValueJson<T>(key, true);

		if (wasLocalCached) {
			FASTLOG2(DFLog('Cache'), "[DFLog::Cache] The value '%s' from the local cache store '%s' was present.", key, this._Name);
			return [true, localCacheValue];
		}

		return [false, null];
	}

	public GetCachedValue(key: string): [bool, string] {
		FASTLOG2(DFLog('Cache'), "[DFLog::Cache] Try get value '%s' from the cache store '%s'.", key, this._Name);

		const [wasMemcached, memCacheValue] = this._MemCache.GetCachedValue(key);

		if (wasMemcached) {
			FASTLOG2(DFLog('Cache'), "[DFLog::Cache] The value '%s' from the memcached store '%s' was present.", key, this._Name);
			return [true, memCacheValue];
		}
		FASTLOG2(
			DFLog('Cache'),
			"[DFLog::Cache] The collection '%s' from the memcached store '%s' was not present, try check local cache.",
			key,
			this._Name,
		);

		const [wasLocalCached, localCacheValue] = this._LocalCache.GetCachedValue(key);

		if (wasLocalCached) {
			FASTLOG2(DFLog('Cache'), "[DFLog::Cache] The value '%s' from the local cache store '%s' was present.", key, this._Name);
			return [true, localCacheValue];
		}

		return [false, null];
	}

	public GetCachedValueNumber(key: string): [bool, int] {
		FASTLOG2(DFLog('Cache'), "[DFLog::Cache] Try get value '%s' from the cache store '%s'.", key, this._Name);

		const [wasMemcached, memCacheValue] = this._MemCache.GetCachedValueNumber(key);

		if (wasMemcached) {
			FASTLOG2(DFLog('Cache'), "[DFLog::Cache] The value '%s' from the memcached store '%s' was present.", key, this._Name);
			return [true, memCacheValue];
		}
		FASTLOG2(
			DFLog('Cache'),
			"[DFLog::Cache] The collection '%s' from the memcached store '%s' was not present, try check local cache.",
			key,
			this._Name,
		);

		const [wasLocalCached, localCacheValue] = this._LocalCache.GetCachedValueNumber(key);

		if (wasLocalCached) {
			FASTLOG2(DFLog('Cache'), "[DFLog::Cache] The value '%s' from the local cache store '%s' was present.", key, this._Name);
			return [true, localCacheValue];
		}

		return [false, null];
	}

	public SetCachedValueJson<T>(key: string, value: T): T {
		this._MemCache.SetCachedValueJson(key, value);

		return value;
	}

	public SetCachedValue(key: string, value: string): string {
		this._MemCache.SetCachedValue(key, value);

		return value;
	}

	public SetCachedValueNumber(key: string, value: int): int {
		this._MemCache.SetCachedValueNumber(key, value);

		return value;
	}

	public GetCachedValueOrCacheNewValueJson<T>(key: string, value: T): T {
		let [presentInCache, cachedValue] = this.GetCachedValueJson<T>(key);

		if (presentInCache) return cachedValue;

		return this.SetCachedValueJson<T>(key, value);
	}

	public GetCachedValueOrCacheNewValue(key: string, value: string): string {
		let [presentInCache, cachedValue] = this.GetCachedValue(key);

		if (presentInCache) return cachedValue;

		return this.SetCachedValue(key, value);
	}

	public GetCachedValueOrCacheNewValueNumber(key: string, value: int): int {
		let [presentInCache, cachedValue] = this.GetCachedValueNumber(key);

		if (presentInCache) return cachedValue;

		return this.SetCachedValueNumber(key, value);
	}

	public RemoveKey(key: string) {
		this._LocalCache.RemoveKey(key);
		this._MemCache.RemoveKey(key);
	}

	public MoveFromMemcache() {
		this._MemCache.GetAllCachedValues().forEach((v, k) => {
			this._LocalCache.SetCachedValue(k, v);
		});

		this._MemCache.Clear();
	}

	private static CalculateResetMsForStatePolicy(policy: CachePolicy) {
		FASTLOG1(DFLog('Cache'), '[DFLog::Cache] Try get the policy timout for CachePolicy[%d]', policy);

		let timeOut = null;

		switch (policy) {
			case CachePolicy.DoNotCache:
				timeOut = null;
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

		FASTLOG2(DFLog('Cache'), '[DFLog::Cache] The policy timout for CachePolicy[%d] = %d', policy, timeOut || 0);

		return timeOut;
	}

	private RegisterResetRoundRobin(policy: CachePolicy) {
		if (!this._PersistentRoundRobinState.WasRegisteredForCacheReset) {
			FASTLOG(DFLog('Cache'), '[DFLog::Cache] Try register the cache store.');
			const cacheRefreshInterval = LegacyCacheRepository.CalculateResetMsForStatePolicy(policy);
			FASTLOG(DFLog('Cache'), '[DFLog::Cache] Round robin was not registered recently, register it.');
			this._PersistentRoundRobinState.WasRegisteredForCacheReset = true;
			if (cacheRefreshInterval !== null)
				this._CacheRefreshIntervalTimer = setInterval(() => {
					if (this._MemCache.GetAllCachedValues().size > 0) {
						FASTLOGNOFILTER(
							DFLog('Cache'),
							`[DFlog::Cache] Perform Round Robin cache clearance on cache store, count of ${this._Name}(${
								this._MemCache.GetAllCachedValues().size
							})`,
						);
						this._LocalCache.Clear();
						this.MoveFromMemcache();
					}
				}, cacheRefreshInterval);
		}
	}

	private readonly _PersistentRoundRobinState = {
		WasRegisteredForCacheReset: false,
	};

	private readonly _MemCache: LegacyMemcachedRepository;
	private readonly _LocalCache: LegacyLocalCacheRepository;
	private readonly _Name: string;
	private _CacheRefreshIntervalTimer: NodeJS.Timer;
}
