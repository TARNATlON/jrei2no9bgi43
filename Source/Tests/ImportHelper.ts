import { __baseDirName } from '../Assemblies/Common/Constants/Roblox.Common.Constants/Directories';
import { isAbsolute, extname, join } from 'path';
import { existsSync } from 'fs';

export default () => {
	(function () {
		const CH_PERIOD = 46;
		const baseUrl = __baseDirName;
		const existsCache = { d: 0 };
		delete existsCache.d;
		const moduleProto = Object.getPrototypeOf(module);
		const origRequire = moduleProto.require;
		moduleProto.require = function (request) {
			let existsPath = existsCache[request];
			if (existsPath === undefined) {
				existsPath = '';
				if (!isAbsolute(request) && request.charCodeAt(0) !== CH_PERIOD) {
					const ext = extname(request);
					const basedRequest = join(baseUrl, ext ? request : request + '.js');
					if (existsSync(basedRequest)) existsPath = basedRequest;
					else {
						const basedIndexRequest = join(baseUrl, request, 'index.js');
						existsPath = existsSync(basedIndexRequest) ? basedIndexRequest : '';
					}
				}
				existsCache[request] = existsPath;
			}
			return origRequire.call(this, existsPath || request);
		};
	})();
};
