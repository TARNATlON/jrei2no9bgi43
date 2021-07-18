import { BaseURL } from 'Assemblies/Common/Roblox.Common/BaseUrl';
import { HttpClientInvoker } from 'Assemblies/Http/HttpClientInvoker/Roblox.Http.HttpClientInvoker/Implementation/HttpClientInvoker';
import { HttpRequestMethodEnum } from 'Assemblies/Http/Roblox.Http/Enumeration/HttpRequestMethodEnum';
import { Task } from 'System/Threading/Task';
import { IServiceUsernameValidationRequest } from 'Assemblies/ApiClients/Roblox.Users.Client/Models/IServiceUsernameValidationRequest';

export class UsersClient {
	public static async ValidateUsername(request: IServiceUsernameValidationRequest): Task<[boolean, number, any, Error]> {
		return new Promise<[boolean, number, any, Error]>(async (resumeFunction) => {
			const Url = BaseURL.ConstructServicePathFromSubDomainSimple('users.api', 'v1/Usernames/ValidateUsername', request.IsSecure);
			const Payload = JSON.stringify({ ...request, IsSecure: undefined });
			const Client = new HttpClientInvoker({
				Url: Url,
				QueryString: {
					ApiKey: 'E9DADB63-5BF6-42FF-A964-79D5E97E7068',
				},
				AdditionalHeaders: { 'Content-Type': 'application/json' },
				Payload: Payload,
				Method: HttpRequestMethodEnum.POST,
				FailedMessage: `Error validating the username ${request.Request.username}`,
			});
			const [Success, Response, Error] = await Client.ExecuteAsync();
			return resumeFunction([<boolean>Success, <number>Response.StatusCode, Response.ResponsePayload, Error]);
		});
	}
}
