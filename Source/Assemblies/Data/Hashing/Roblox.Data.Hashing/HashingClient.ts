import { Response } from 'express';
import { readFileSync as ReadAllLines } from 'fs';
import { createSign as CreateSignature } from 'crypto';
import { __baseDirName } from 'Assemblies/Common/Constants/Roblox.Common.Constants/Directories';

export class HashingClient {
	private _response: Response;

	public constructor(response: Response) {
		this._response = response;
	}

	public SignFileAndRespond(fileName: string, useBaseDirectory: boolean = true) {
		try {
			const file = ReadAllLines(
				`${useBaseDirectory ? __baseDirName : ''}${useBaseDirectory && !fileName.startsWith('/') ? '/' : ''}${fileName}`,
				'utf-8',
			);
			return this.SendSignedResponse(file);
		} catch (e) {
			throw new Error("There was an error signing the given file, the file most likely didn't exist or the path entered was wrong.");
		}
	}

	public SendSignedResponse(data: string) {
		const splitter = '\r\n' + data;
		const sig = HashingClient.GetSignedData(data, 'sha1');
		const out = `--rbxsig%${sig}%${splitter}`;
		this._response.contentType('text/plain');
		this._response.send(out);
	}

	public static GetSignedData(data: string, algorithm: string = 'sha1') {
		const signature = CreateSignature(algorithm);
		signature.write(data);
		signature.end();

		const key = ReadAllLines(__baseDirName + '/InternalCDN/PrivateKey.pem'); // Change the directory if needed.
		const sig = signature.sign(key, 'base64');
		return sig;
	}
}
