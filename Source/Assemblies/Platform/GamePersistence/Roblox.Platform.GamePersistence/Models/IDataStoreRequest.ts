import { IUser } from 'Assemblies/Platform/Membership/Roblox.Platform.Membership/IUser';
import { IUniverse } from 'Assemblies/Platform/Universes/Roblox.Platform.Universes/IUniverse';

export interface IDataStoreRequest {
	/*IUniverse*/ Universe: IUniverse;
	/*IUser*/ User: IUser;
	/*Int32*/ MaxItemsToReturn: System.Int32;
}
