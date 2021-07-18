import { Response } from 'express';
import { ReportDebatableErrorDelegate } from 'Assemblies/Web/GameLaunch/Roblox.Web.GameLaunch/Interfaces/IGameLaunchBase';
import { IGameLaunchRequestBase } from 'Assemblies/Web/GameLaunch/Roblox.Web.GameLaunch/Interfaces/IGameLaunchRequestBase';
import { GameLaunchBase } from 'Assemblies/Web/GameLaunch/Roblox.Web.GameLaunch/Models/Abstract/GameLaunchBase';

export class RequestFollowUser extends GameLaunchBase {
	public constructor(response: Response) {
		super(response);
	}

	public Invoke(request: IGameLaunchRequestBase, reportDebatableErrorDelegate: ReportDebatableErrorDelegate): bool {
		throw new Error('Method not implemented.');
	}
}
