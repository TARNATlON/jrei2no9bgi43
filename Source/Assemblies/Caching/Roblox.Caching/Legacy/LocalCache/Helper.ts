import {
	existsSync as FileOrFolderExist,
	mkdirSync as CreateDirectory,
	rmSync as RemoveDirectory,
	readdirSync as ReadDirectory,
	readFileSync as ReadLocally,
	writeFileSync as WriteLocally,
	unlinkSync as DeleteLocally,
} from 'fs';

export class LocalCacheHelper {
	public static RegisterLocalCacheStore(storeName: string) {
		const baseDir = LocalCacheHelper.GetCacheDirectoryByOS();
		if (!FileOrFolderExist(baseDir)) CreateDirectory(baseDir, { recursive: true });
		const qualifiedCacheStoreLocation = baseDir + storeName;
		if (!FileOrFolderExist(qualifiedCacheStoreLocation)) CreateDirectory(qualifiedCacheStoreLocation, { recursive: true });
	}

	public static ClearLocalCacheStore(storeName: string) {
		const baseDir = LocalCacheHelper.GetCacheDirectoryByOS();
		if (!FileOrFolderExist(baseDir)) return LocalCacheHelper.RegisterLocalCacheStore(storeName);
		const qualifiedCacheStoreLocation = baseDir + storeName;
		if (!FileOrFolderExist(qualifiedCacheStoreLocation)) return LocalCacheHelper.RegisterLocalCacheStore(storeName);

		RemoveDirectory(qualifiedCacheStoreLocation, { recursive: true, force: true });
		CreateDirectory(qualifiedCacheStoreLocation, { recursive: true });
	}

	public static GetLocalCacheSize(storeName: string) {
		const baseDir = LocalCacheHelper.GetCacheDirectoryByOS();
		if (!FileOrFolderExist(baseDir)) {
			LocalCacheHelper.RegisterLocalCacheStore(storeName);
			return 0;
		}
		const qualifiedCacheStoreLocation = baseDir + storeName;
		if (!FileOrFolderExist(qualifiedCacheStoreLocation)) {
			LocalCacheHelper.RegisterLocalCacheStore(storeName);
			return 0;
		}

		return ReadDirectory(qualifiedCacheStoreLocation).length;
	}

	public static GetLocalCacheValue(cacheStore: string, key: string): [bool, string] {
		const baseDir = LocalCacheHelper.GetCacheDirectoryByOS();
		if (!FileOrFolderExist(baseDir)) {
			LocalCacheHelper.RegisterLocalCacheStore(cacheStore);
			return [false, null];
		}
		const qualifiedCacheStoreLocation = baseDir + cacheStore;
		if (!FileOrFolderExist(qualifiedCacheStoreLocation)) {
			LocalCacheHelper.RegisterLocalCacheStore(cacheStore);
			return [false, null];
		}

		const keyName = key.split(':').join('-').split(' ').join('~') + '.rbx-CachedValue';

		try {
			return [true, ReadLocally(`${qualifiedCacheStoreLocation}/${keyName}`, { encoding: 'utf-8' })];
		} catch (e) {
			return [false, null];
		}
	}

	public static SetLocalCachedValue(cacheStore: string, key: string, value: string): string {
		const baseDir = LocalCacheHelper.GetCacheDirectoryByOS();
		if (!FileOrFolderExist(baseDir)) {
			LocalCacheHelper.RegisterLocalCacheStore(cacheStore);
		}
		const qualifiedCacheStoreLocation = baseDir + cacheStore;
		if (!FileOrFolderExist(qualifiedCacheStoreLocation)) {
			LocalCacheHelper.RegisterLocalCacheStore(cacheStore);
		}

		const keyName = key.split(':').join('-').split(' ').join('~') + '.rbx-CachedValue';

		WriteLocally(`${qualifiedCacheStoreLocation}/${keyName}`, value, { encoding: 'utf-8' });
		return value;
	}

	public static DeleteLocalCachedValue(cacheStore: string, key: string): void {
		const baseDir = LocalCacheHelper.GetCacheDirectoryByOS();
		if (!FileOrFolderExist(baseDir)) {
			LocalCacheHelper.RegisterLocalCacheStore(cacheStore);
			return;
		}
		const qualifiedCacheStoreLocation = baseDir + cacheStore;
		if (!FileOrFolderExist(qualifiedCacheStoreLocation)) {
			LocalCacheHelper.RegisterLocalCacheStore(cacheStore);
			return;
		}

		const keyName = key.split(':').join('-').split(' ').join('~') + '.rbx-CachedValue';

		try {
			DeleteLocally(`${qualifiedCacheStoreLocation}/${keyName}`);
		} catch (e) {}
	}

	public static GetAllLocalCacheValues(cacheStore: string) {
		const baseDir = LocalCacheHelper.GetCacheDirectoryByOS();
		if (!FileOrFolderExist(baseDir)) {
			LocalCacheHelper.RegisterLocalCacheStore(cacheStore);
			return new Map<string, any>();
		}
		const qualifiedCacheStoreLocation = baseDir + cacheStore;
		if (!FileOrFolderExist(qualifiedCacheStoreLocation)) {
			LocalCacheHelper.RegisterLocalCacheStore(cacheStore);
			return new Map<string, any>();
		}

		const map = new Map<string, any>();

		ReadDirectory(qualifiedCacheStoreLocation).forEach((entry) => {
			map[entry.split('-').join(':').split('~').join(' ').replace('.rbx-CachedValue', '')] = ReadLocally(
				qualifiedCacheStoreLocation + entry,
				{
					encoding: 'utf-8',
				},
			);
		});

		return map;
	}

	public static ClearLocalCache() {
		const baseDir = LocalCacheHelper.GetCacheDirectoryByOS();
		if (!FileOrFolderExist(baseDir)) return CreateDirectory(baseDir, { recursive: true });

		RemoveDirectory(baseDir, { recursive: true, force: true });
		CreateDirectory(baseDir, { recursive: true });
	}

	private static GetCacheDirectoryByOS() {
		switch (process.platform) {
			case 'linux' || 'darwin':
				return '/var/cache/roblox/';
			case 'win32':
				return 'C:/Roblox/TempFiles/Persistence/';
		}
	}
}
