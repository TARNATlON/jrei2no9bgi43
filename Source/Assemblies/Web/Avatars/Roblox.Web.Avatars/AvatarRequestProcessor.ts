import { Request, Response } from 'express';
import { AssetIdListModel } from 'ApiSites/Roblox.Avatar.Api/Models/AssetIdListModel';
import { AvatarFetchModel } from 'ApiSites/Roblox.Avatar.Api/Models/AvatarFetchModel';
import { AvatarFetchRequest } from 'ApiSites/Roblox.Avatar.Api/Models/AvatarFetchRequest';
import { AvatarFetchResponseModel } from 'Services/Roblox.ApiProxy.Service/Models/AvatarFetchResponseModel';
import { AvatarBodyColorsModel } from 'Services/Roblox.ApiProxy.Service/Models/AvtarBodyColorsModel';
import { GetByUserNameResponse } from 'Services/Roblox.ApiProxy.Service/Models/GetByUserNameResponse';
import { Convert } from 'System/Convert';
import { Task } from 'System/Threading/Task';
import { BodyColorsRequest } from 'Websites/Roblox.GameWebsite/Models/Game/BodyColorsRequest';
import { AvatarAccoutrementsRequest } from 'Websites/Roblox.GameWebsite/Models/Game/IAvatarAccoutrementsRequest';
import { BaseURL } from 'Assemblies/Common/Roblox.Common/BaseUrl';
import { HttpRequestMethodEnum } from 'Assemblies/Http/Roblox.Http/Enumeration/HttpRequestMethodEnum';
import { HttpClientInvoker } from 'Assemblies/Http/HttpClientInvoker/Roblox.Http.HttpClientInvoker/Implementation/HttpClientInvoker';
import { IClientRequest } from 'Assemblies/Http/HttpClientInvoker/Roblox.Http.HttpClientInvoker/Models/IClientRequest';
import { KeyValueMapping } from 'Assemblies/Common/Mapping/Roblox.Common.Mapping/KeyValueMapping';
import { LegacyCacheRepository } from 'Assemblies/Caching/Roblox.Caching/Legacy/LegacyCacheRepository';
import { CachePolicy } from 'Assemblies/Caching/Roblox.Caching/Legacy/Enumeration/CachePolicy';

/* TODO: Actually cache this... It takes an average of 200ms to execute each request. */

export class AvatarRequestProcessor {
	/* Constants */
	private static readonly GLOBAL_CONFIG: IClientRequest = {
		QueryString: {
			ApiKey: '8DAE2E89-BCFA-4735-AB79-D9A07ABA9263',
		},
		Method: HttpRequestMethodEnum.GET,
		CheckResponseDataForOKStatus: true /* NotImplemented */,
	};
	private static readonly API_PROXY_GET_BY_USERNAME = BaseURL.ConstructServicePathFromHostSimple(
		'api.roblox.com',
		'users/get-by-username',
		true,
	);
	private static readonly AVATAR_API_SITE_GET_CURRENTLY_WEARING_ASSET_IDS = (userID: number) =>
		BaseURL.ConstructServicePathFromHostSimple('avatar.roblox.com', `v1/users/${userID}/currently-wearing`, true);

	private static readonly AVATAR_API_SITE_AVATAR_FETCH = BaseURL.ConstructServicePathFromHostSimple(
		'avatar.roblox.com',
		'v1/avatar-fetch',
		true,
	);

	private static readonly API_PROXY_AVATAR_FETCH = BaseURL.ConstructServicePathFromHostSimple(
		'api.roblox.com',
		`v1.1/avatar-fetch`,
		true,
	);

	private static AVATAR_DEFAULT_COLORS = (userID: long, allowUseOfSSL: bool = false) =>
		BaseURL.ConstructServicePathFromSubDomain('assetgame', '/Asset/BodyColors.ashx', { userID }, allowUseOfSSL, false, true);

	private static FUNNY_AVATAR_FETCH_MODEL: AvatarFetchModel = {
		resolvedAvatarType: 'R15',
		equippedGearVersionIds: [],
		backpackGearVersionIds: [],
		assetAndAssetTypeIds: [
			{ assetId: 4487955592, assetTypeId: 43 },
			{ assetId: 5917459717, assetTypeId: 18 },
			{ assetId: 5617784770, assetTypeId: 2 },
			{ assetId: 6372437047, assetTypeId: 12 },
		],
		animationAssetIds: { climb: 837013990, run: 837009922, jump: 619528412, fall: 619527817, idle: 1018553897, walk: 754636298 },
		bodyColors: {
			HeadColor: 1,
			TorsoColor: 1,
			RightArmColor: 1,
			LeftArmColor: 1,
			RightLegColor: 1,
			LeftLegColor: 1,
		},
		scales: { height: 0.5, width: 3.0, head: 1.0, depth: 1.0, proportion: 0.0, bodyType: 0.05 },
		emotes: [
			{ assetId: 3576686446, assetName: 'Hello', position: 1 },
			{ assetId: 3360689775, assetName: 'Salute', position: 2 },
			{ assetId: 3360692915, assetName: 'Tilt', position: 3 },
		],
	};

	private static DEFAULT_AVATAR_FETCH_MODEL: AvatarFetchModel = AvatarRequestProcessor.FUNNY_AVATAR_FETCH_MODEL; /*{
		resolvedAvatarType: 'R15',
		equippedGearVersionIds: [],
		backpackGearVersionIds: [],
		assetAndAssetTypeIds: [
			{ assetId: 6395566584, assetTypeId: 2 },
			{ assetId: 11844853, assetTypeId: 8 },
			{ assetId: 19380685, assetTypeId: 42 },
		],
		animationAssetIds: { climb: 837013990, run: 837009922, jump: 619528412, fall: 619527817, idle: 754637456, walk: 754636298 },
		bodyColors: {
			HeadColor: 105,
			TorsoColor: 1003,
			RightArmColor: 105,
			LeftArmColor: 105,
			RightLegColor: 1004,
			LeftLegColor: 1004,
		},
		scales: { height: 1.0, width: 1.0, head: 1.0, depth: 1.0, proportion: 0.0, bodyType: 0.05 },
		emotes: [
			{ assetId: 3576686446, assetName: 'Hello', position: 1 },
			{ assetId: 3360689775, assetName: 'Salute', position: 2 },
			{ assetId: 3360692915, assetName: 'Tilt', position: 3 },
		],
	};*/

	private static DEFAULT_AVATAR_FETCH_RESPONSE_MODEL: AvatarFetchResponseModel = {
		ResolvedAvatarType: 'R15',
		AccessoryVersionIds: [7769558814, 883360292, 883361139],
		EquippedGearVersionIds: [],
		BackpackGearVersionIds: [],
		BodyColors: { HeadColor: 105, LeftArmColor: 105, LeftLegColor: 1004, RightArmColor: 105, RightLegColor: 1004, TorsoColor: 1003 },
		Animations: { Climb: 1217933913, Run: 1217928502, Jump: 969714026, Fall: 969713293, Idle: 1280065371, Walk: 1128122678 },
		Scales: { width: 1.0, height: 1.0, head: 1.0, depth: 1.0, proportion: 0.0, bodyType: 0.05 },
	};

	/* Mutable Data */

	private placeID: long = undefined;
	private userID: long = undefined;
	private userName: string = null;

	/* Usable private members */
	private readonly _response: Response;
	private readonly _cachedClient: HttpClientInvoker;

	public constructor(response: Response) {
		this._response = response;
		this._cachedClient = new HttpClientInvoker(AvatarRequestProcessor.GLOBAL_CONFIG);
	}

	public static get IsCacheCleared() {
		return (
			AvatarRequestProcessor.GeneralCacheRepo.IsCacheClear &&
			AvatarRequestProcessor.UsernameCacheRepo.IsCacheClear &&
			AvatarRequestProcessor.AssetIDsCacheRepo.IsCacheClear &&
			AvatarRequestProcessor.ColorCacheRepo.IsCacheClear &&
			AvatarRequestProcessor.SimpleCharacterFetchCacheRepo.IsCacheClear
		);
	}

	public ExtractDataFromQueryStringForAvatarAccoutrementsRequest(
		request: Request<null, string, null, AvatarAccoutrementsRequest>,
	): [ulong, string, bool] {
		let UserID = KeyValueMapping.FetchKeyFromObjectCaseInsensitive<long>(request.query, 'UserID');
		const UserName = KeyValueMapping.FetchKeyFromObjectCaseInsensitiveOrDefault<string>(request.query, 'UserName', null);
		const allowSSL = KeyValueMapping.FetchKeyFromObjectCaseInsensitiveOrDefault<bool>(request.query, 'AllowSSL', false);
		return [Convert.ToUInt64(UserID), UserName, Convert.ToBoolean(allowSSL)];
	}

	public ExtractDataFromQueryStringForBodyColorsRequest(request: Request<null, string, null, BodyColorsRequest>): [ulong, string] {
		let UserID = KeyValueMapping.FetchKeyFromObjectCaseInsensitive<long>(request.query, 'UserID');
		const UserName = KeyValueMapping.FetchKeyFromObjectCaseInsensitiveOrDefault<string>(request.query, 'UserName', null);
		return [Convert.ToUInt64(UserID), UserName];
	}

	public ExtractDataFromQueryStringForGetAvatarFetchRequest(
		request: Request<null, null, null, AvatarFetchRequest>,
	): [ulong, string, ulong] {
		const UserID = KeyValueMapping.FetchKeyFromObjectCaseInsensitive<long>(request.query, 'UserID');
		const UserName = KeyValueMapping.FetchKeyFromObjectCaseInsensitiveOrDefault<string>(request.query, 'UserName', null);
		const PlaceID = KeyValueMapping.FetchKeyFromObjectCaseInsensitiveOrDefault<long>(request.query, 'PlaceID', 1818);
		return [Convert.ToUInt64(UserID), UserName, Convert.ToUInt64(PlaceID)];
	}

	public async GetAvatarBodyColorsAsync(userID: long, userName: string) {
		if (typeof userName === 'string') userName = userName.toLowerCase().trim();
		this.UpdateConfiguredMutables(userID, userName);
		await this.TryUpdateUserIDByUserName();
		const key = `Avatars_GetAvatarBodyColorsAsync:${this.userID}:${this.userName}`;
		const [isCached, cachedValue] = AvatarRequestProcessor.ColorCacheRepo.GetCachedValue(key);
		if (isCached) return this.RespondWithContentTypeAndData('text/xml', cachedValue);
		return await this.GetBodyColors();
	}

	public async GetAvatarFetchResponseAsync(userID: long, userName: string, placeID: long) {
		if (userID === -1) return this._response.send(AvatarRequestProcessor.FUNNY_AVATAR_FETCH_MODEL);
		if (typeof userName === 'string') userName = userName.toLowerCase().trim();
		this.UpdateConfiguredMutablesV2(userID, userName, placeID);
		await this.TryUpdateUserIDByUserName();
		const key = `Avatars_GetAvatarFetchResponseAsync:${this.userID}:${this.userName}:${this.placeID}`;
		const [isCached, cachedValue] = AvatarRequestProcessor.QueriedCharacterFetchCacheRepo.GetCachedValueJson<AvatarFetchModel>(key);

		if (isCached) return this._response.send(cachedValue);
		return this._response.send(await this.GetAvatarResponseModelAsync());
	}

	public async GetAvatarAccoutrementsAsync(userID: long, userName: string, allowUseOfSSL: bool = false) {
		if (typeof userName === 'string') userName = userName.toLowerCase().trim();
		this.UpdateConfiguredMutables(userID, userName);
		await this.TryUpdateUserIDByUserName();
		const key = `Avatars_GetAvatarAccoutrementsAsync:${this.userID}:${this.userName}`;
		const [isCached, cachedValue] = AvatarRequestProcessor.GeneralCacheRepo.GetCachedValue(key);
		if (isCached) return this.RespondWithData(cachedValue);
		return await this.ConstructResponseString(allowUseOfSSL);
	}

	/* UTIL */

	private async ClearCacheAsync() {
		await this._cachedClient.ClearCacheAsync();
	}

	private async ClearConfigAndCacheAsync() {
		this._cachedClient.ClearConfiguration();
		await this.ClearCacheAsync();
	}

	private RespondWithData(data: string = null) {
		if (this._response !== null) this._response.contentType('text/plain').send(data);
		return data;
	}

	private RespondWithContentTypeAndData(contentType: string = 'text/plain', data: string = null) {
		if (this._response !== null) this._response.contentType(contentType).send(data);
		return data;
	}

	private RespondWithStatusAndData(status: int = 200, data: string = null) {
		if (this._response !== null) {
			this._response.statusCode = status;

			return this.RespondWithData(data);
		}
	}

	private UpdateConfiguredMutables(userID: number, userName: string) {
		this.userID = userID;
		this.userName = userName;
	}

	private UpdateConfiguredMutablesV2(userID: number, userName: string, placeID: long) {
		this.userID = userID;
		this.userName = userName;
		this.placeID = placeID;
	}

	private async TryUpdateUserIDByUserName() {
		if (this.userName) {
			if (this.TryUpdateUserIDFromCache()) return;

			this.UpdateConfigForUsernameFetch();
			await this.TryGetUsernameFromUserIDAsync();
			await this.ClearConfigAndCacheAsync();
		}
	}

	private TryUpdateUserIDFromCache() {
		const collectionId = `Users_TryUpdateUserIDByUserName:${this.userName}`;

		const [cached, cachedValue] = AvatarRequestProcessor.UsernameCacheRepo.GetCachedValueNumber(collectionId);

		if (cached) {
			if (cachedValue !== null) this.userID = cachedValue;
			return true;
		}
		return false;
	}

	private async TryGetUsernameFromUserIDAsync() {
		const collectionId = `Users_TryUpdateUserIDByUserName:${this.userName}`;
		const [WasSuccessful, CachedResponse] = await this._cachedClient.ExecuteAsync<GetByUserNameResponse>();

		const WasRemotelySuccessful = KeyValueMapping.FetchKeyFromObjectCaseInsensitive<bool>(CachedResponse.ResponsePayload, 'Success');
		const RemoteUserID = KeyValueMapping.FetchKeyFromObjectCaseInsensitiveOrDefault<long>(CachedResponse.ResponsePayload, 'ID', null);

		AvatarRequestProcessor.UsernameCacheRepo.SetCachedValueNumber(collectionId, RemoteUserID);

		if (WasSuccessful && WasRemotelySuccessful !== false) {
			this.userID = RemoteUserID;
		} else {
			this.userName = null;
		}
	}

	private UpdateConfigForUsernameFetch() {
		this._cachedClient.UpdateConfiguration({
			...AvatarRequestProcessor.GLOBAL_CONFIG,
			Url: AvatarRequestProcessor.API_PROXY_GET_BY_USERNAME,
			QueryString: { ...AvatarRequestProcessor.GLOBAL_CONFIG.QueryString, UserName: this.userName },
		});
	}

	private async GetAvatarFetchModel(isBodyColorsRequest: bool = true): Task<AvatarFetchResponseModel> {
		return new Promise(async (resumeFunction) => {
			if (this.userID) {
				const [WasCached, CachedModel] =
					AvatarRequestProcessor.SimpleCharacterFetchCacheRepo.GetCachedValueJson<AvatarFetchResponseModel>(
						`Avatars_GetAvatarSimple:${this.userID}:${this.userName}`,
					);
				if (WasCached) return resumeFunction(CachedModel);
				this.UpdateConfigForAvatarFetchRequest();
				return resumeFunction(await this.ExecuteGetAvatarFetchAsync(isBodyColorsRequest));
			} else {
				if (isBodyColorsRequest) return this.RespondWithDefaultBodyColors(resumeFunction);
				return AvatarRequestProcessor.DEFAULT_AVATAR_FETCH_RESPONSE_MODEL;
			}
		});
	}

	private async GetAvatarFetchModelV2(bodyColors: AvatarBodyColorsModel): Task<AvatarFetchModel> {
		if (this.userID) {
			const [WasCached, CachedModel] = AvatarRequestProcessor.QueriedCharacterFetchCacheRepo.GetCachedValueJson<AvatarFetchModel>(
				`Avatars_GetAvatarFetchResponseAsync:${this.userID}:${this.userName}:${this.placeID}`,
			);
			if (WasCached) return CachedModel;
			this.UpdateConfigForAvatarFetchRequestV2();
			return await this.ExecuteGetAvatarFetchAsyncV2(bodyColors);
		} else {
			return AvatarRequestProcessor.DEFAULT_AVATAR_FETCH_MODEL;
		}
	}

	private async ExecuteGetAvatarFetchAsync(isBodyColorsRequest: bool = true): Task<AvatarFetchResponseModel> {
		return new Promise(async (resumeFunction) => {
			const collectionId = `Avatars_GetAvatarSimple:${this.userID}:${this.userName}`;
			const [WasSuccessful, CachedAvatarResponse] = await this._cachedClient.ExecuteAsync<AvatarFetchResponseModel>();

			if (!WasSuccessful) {
				if (isBodyColorsRequest) return this.RespondWithDefaultBodyColors(resumeFunction);
				AvatarRequestProcessor.SimpleCharacterFetchCacheRepo.SetCachedValueJson<AvatarFetchResponseModel>(
					collectionId,
					AvatarRequestProcessor.DEFAULT_AVATAR_FETCH_RESPONSE_MODEL,
				);
				return AvatarRequestProcessor.DEFAULT_AVATAR_FETCH_RESPONSE_MODEL;
			}

			AvatarRequestProcessor.SimpleCharacterFetchCacheRepo.SetCachedValueJson<AvatarFetchResponseModel>(
				collectionId,
				CachedAvatarResponse.ResponsePayload,
			);

			return resumeFunction(CachedAvatarResponse.ResponsePayload);
		});
	}

	private async ExecuteGetAvatarFetchAsyncV2(bodyColors: AvatarBodyColorsModel): Promise<AvatarFetchModel> {
		const key = `Avatars_GetAvatarFetchResponseAsync:${this.userID}:${this.userName}:${this.placeID}`;
		const [WasSuccessful, CachedAvatarResponse] = await this._cachedClient.ExecuteAsync<AvatarFetchModel>();

		CachedAvatarResponse.ResponsePayload.bodyColors = bodyColors;

		if (!WasSuccessful) {
			AvatarRequestProcessor.QueriedCharacterFetchCacheRepo.SetCachedValueJson<AvatarFetchModel>(
				key,
				AvatarRequestProcessor.DEFAULT_AVATAR_FETCH_MODEL,
			);

			return AvatarRequestProcessor.DEFAULT_AVATAR_FETCH_MODEL;
		}

		AvatarRequestProcessor.QueriedCharacterFetchCacheRepo.SetCachedValueJson<AvatarFetchModel>(
			key,
			CachedAvatarResponse.ResponsePayload,
		);

		return CachedAvatarResponse.ResponsePayload;
	}

	private async GetAvatarAssetIDS() {
		if (this.userID) {
			const [WasCached, CachedData] = AvatarRequestProcessor.AssetIDsCacheRepo.GetCachedValueJson<long[]>(
				`Assets_TryGetCachedAssetIDs:${this.userID}:${this.userName}`,
			);
			if (WasCached) return CachedData;
			this.UpdateConfigForAvatarAssetIDsFetch();
			return await this.ExecuteGetAvatarAssetIDsAsync();
		} else {
			AvatarRequestProcessor.GeneralCacheRepo.SetCachedValue(
				`Avatars_GetAvatarAccoutrementsAsync:${this.userID}:${this.userName}`,
				AvatarRequestProcessor.AVATAR_DEFAULT_COLORS(this.userID, false),
			);
			this.RespondWithDefault();
			return null;
		}
	}

	private async ExecuteGetAvatarAssetIDsAsync() {
		const collectionId = `Assets_TryGetCachedAssetIDs:${this.userID}:${this.userName}`;
		const [WasSuccessful, CachedAvatarResponse] = await this._cachedClient.ExecuteAsync<AssetIdListModel>();
		const collection = KeyValueMapping.FetchKeyFromObjectCaseInsensitiveOrDefault<long[]>(
			CachedAvatarResponse.ResponsePayload,
			'AssetIDs',
			null,
		);

		AvatarRequestProcessor.AssetIDsCacheRepo.SetCachedValueJson<long[]>(collectionId, collection);

		if (!WasSuccessful) {
			AvatarRequestProcessor.GeneralCacheRepo.SetCachedValue(
				`Avatars_GetAvatarAccoutrementsAsync:${this.userID}:${this.userName}`,
				AvatarRequestProcessor.AVATAR_DEFAULT_COLORS(this.userID, false),
			);

			this.RespondWithDefault();
			return null;
		}

		return collection;
	}

	private UpdateConfigForAvatarAssetIDsFetch() {
		this._cachedClient.UpdateConfiguration({
			...AvatarRequestProcessor.GLOBAL_CONFIG,
			Url: AvatarRequestProcessor.AVATAR_API_SITE_GET_CURRENTLY_WEARING_ASSET_IDS(this.userID),
		});
	}

	private UpdateConfigForAvatarFetchRequest() {
		this._cachedClient.UpdateConfiguration({
			...AvatarRequestProcessor.GLOBAL_CONFIG,
			Url: AvatarRequestProcessor.API_PROXY_AVATAR_FETCH,
			QueryString: {
				...AvatarRequestProcessor.GLOBAL_CONFIG.QueryString,
				UserID: this.userID,
			},
		});
	}

	private UpdateConfigForAvatarFetchRequestV2() {
		this._cachedClient.UpdateConfiguration({
			...AvatarRequestProcessor.GLOBAL_CONFIG,
			Url: AvatarRequestProcessor.AVATAR_API_SITE_AVATAR_FETCH,
			QueryString: {
				...AvatarRequestProcessor.GLOBAL_CONFIG.QueryString,
				UserID: this.userID,
				PlaceID: this.placeID,
			},
		});
	}

	private async ConstructResponseString(allowUseOfSSL: bool = false) {
		const collectionId = `Avatars_GetAvatarAccoutrementsAsync:${this.userID}:${this.userName}`;
		const avatarAssetIDs = await this.GetAvatarAssetIDS();
		let RESPONSE_STRING = AvatarRequestProcessor.AVATAR_DEFAULT_COLORS(this.userID, allowUseOfSSL);

		if (avatarAssetIDs === null) {
			return;
		}

		let isAllowed: bool = true;
		if (Array.isArray(avatarAssetIDs) && avatarAssetIDs.length > 0)
			avatarAssetIDs.forEach(async (assetID, idx, arr) => {
				if (isAllowed) {
					RESPONSE_STRING += this.GetNextResponseStringForSequence(assetID, allowUseOfSSL);
					if (idx === arr.length - 1) {
						AvatarRequestProcessor.GeneralCacheRepo.SetCachedValue(collectionId, RESPONSE_STRING);
						return this.RespondWithData(RESPONSE_STRING);
					}
				}
			});
		else {
			AvatarRequestProcessor.GeneralCacheRepo.SetCachedValue(collectionId, RESPONSE_STRING);
			return this.RespondWithData(RESPONSE_STRING);
		}
	}

	private async GetBodyColors() {
		return new Promise(async (resumeFunction) => {
			const simpleAvatarResponse = await this.GetAvatarFetchModel();

			if (simpleAvatarResponse === null) {
				return;
			}

			const bodyColors = KeyValueMapping.FetchKeyFromObjectCaseInsensitive<AvatarBodyColorsModel>(simpleAvatarResponse, 'BodyColors');

			if (bodyColors && !this.isEmptyObject(bodyColors)) {
				return this.RespondWithBodyColors(bodyColors, (_err, res) => {
					if (_err) return resumeFunction(null);
					AvatarRequestProcessor.ColorCacheRepo.SetCachedValue(
						`Avatars_GetAvatarBodyColorsAsync:${this.userID}:${this.userName}`,
						res,
					);
					this.RespondWithContentTypeAndData('text/xml', res);
					return resumeFunction(null);
				});
			} else {
				return this.RespondWithDefaultBodyColors(resumeFunction);
			}
		});
	}

	private async GetAvatarResponseModelAsync() {
		const simpleAvatarResponse = await this.GetAvatarFetchModel(false);
		if (simpleAvatarResponse === null) {
			return;
		}
		const bodyColors = KeyValueMapping.FetchKeyFromObjectCaseInsensitive<AvatarBodyColorsModel>(simpleAvatarResponse, 'BodyColors');
		const data = await this.GetAvatarFetchModelV2(bodyColors);

		if (data && !this.isEmptyObject(data)) return data;

		return AvatarRequestProcessor.DEFAULT_AVATAR_FETCH_MODEL;
	}

	private isEmptyObject(obj: Object) {
		return !Object.keys(obj).length;
	}

	private RespondWithDefault() {
		return this.RespondWithStatusAndData(200, AvatarRequestProcessor.AVATAR_DEFAULT_COLORS(this.userID, false));
	}

	private RespondWithDefaultBodyColors(resumeFunction: (...args: any) => any) {
		return this.RespondWithBodyColors(
			{
				HeadColor: 1004,
				LeftArmColor: 1004,
				LeftLegColor: 1004,
				RightArmColor: 1004,
				RightLegColor: 1004,
				TorsoColor: 1004,
			},
			(_err, res) => {
				if (_err) return resumeFunction(null);
				AvatarRequestProcessor.ColorCacheRepo.SetCachedValue(
					`Avatars_GetAvatarBodyColorsAsync:${this.userID}:${this.userName}`,
					res,
				);
				return resumeFunction(null);
			},
		);
	}

	private RespondWithBodyColors(bodyColors: AvatarBodyColorsModel, cb?: (e: Error, r: string) => void) {
		if (this._response !== null)
			this._response.render(
				'Game/BodyColors',
				{
					bodyColors: bodyColors,
				},
				cb,
			);
	}

	private GetNextResponseStringForSequence(assetID: number, allowUseOfSSL: boolean) {
		return `;${BaseURL.ConstructServicePathFromSubDomain('assetgame', '/Asset', { ID: assetID }, allowUseOfSSL, false, true)}`;
	}

	private static readonly GeneralCacheRepo: LegacyCacheRepository = new LegacyCacheRepository(
		'GeneralCacheRepoV2',
		CachePolicy.StaleAfterOneMinute,
	);
	private static readonly UsernameCacheRepo: LegacyCacheRepository = new LegacyCacheRepository(
		'UsernameCacheRepo',
		CachePolicy.StaleAfterFifteenMinutes,
	);
	private static readonly AssetIDsCacheRepo: LegacyCacheRepository = new LegacyCacheRepository(
		'AssetIDsCacheRepo',
		CachePolicy.StaleAfterOneMinute,
	);
	private static readonly ColorCacheRepo: LegacyCacheRepository = new LegacyCacheRepository(
		'ColorCacheRepo',
		CachePolicy.StaleAfterOneMinute,
	);
	private static readonly SimpleCharacterFetchCacheRepo: LegacyCacheRepository = new LegacyCacheRepository(
		'SimpleCharacterFetchCacheRepo',
		CachePolicy.StaleAfterOneMinute,
	);
	private static readonly QueriedCharacterFetchCacheRepo: LegacyCacheRepository = new LegacyCacheRepository(
		'QueriedCharacterFetchCacheRepo',
		CachePolicy.StaleAfterOneMinute,
	);
}
