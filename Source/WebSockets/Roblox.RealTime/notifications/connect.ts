import { IncomingMessage } from 'http';
import Socket from 'ws';
import { client } from '@mfd/signalr';
import { DFLog, DYNAMIC_LOGVARIABLE, FASTLOG, FASTLOGS } from 'Assemblies/Web/Util/Roblox.Web.Util/Logging/FastLog';

DYNAMIC_LOGVARIABLE('Websockets', 7);

export default {
	Callback: (connection: Socket, request: IncomingMessage): void => {
		const hubClient = new client('https://realtime.roblox.com/notifications', ['usernotificationhub']);

		// To give client custom headers:
		hubClient.headers.cookie = request.headers.cookie;

		hubClient.on('connected', () => {
			FASTLOG(DFLog('Websockets'), '[DFLog::Websockets] Successfully connected to the hub, start receiving messages now!');
		});
		hubClient.on('reconnecting', () => {
			FASTLOG(DFLog('Websockets'), '[DFLog::Websockets] The hubclient is reconnecting, close connection and close hubclient');
			hubClient.end();
		});
		hubClient.on('disconnected', () => {
			FASTLOG(DFLog('Websockets'), '[DFLog::Websockets] The hubclient disconnected, close connection and close hubclient');
			if (<any>connection.readyState !== connection.CLOSED || connection.readyState !== connection.CLOSING) connection.close();
		});

		hubClient.on('error', (message) => {
			FASTLOG(DFLog('Websockets'), '[DFLog::Websockets] The hubclient errored, close connection and close hubclient');
			FASTLOGS(DFLog('Websockets'), '[DFLog::Websockets] Hubclient error: %s', message);
			hubClient.end();
		});

		// receiving messages and stuffs
		hubClient.on('message', (data) => {
			FASTLOGS(DFLog('Websockets'), '[DFLog::Websockets] Hubclient receive raw data: %s', data);
			FASTLOGS(DFLog('Websockets'), '[DFLog::Websockets] Raw data as Buffer: %s', Buffer.from(data).join(' '));
			connection.send(data, { binary: false, compress: false });
		});

		connection.on('close', () => {
			FASTLOG(DFLog('Websockets'), '[DFLog::Websockets] Client requested shutdown, close connection NOW!');
			do {} while (hubClient._websocket === undefined);
			hubClient.end();
		});

		// Call to start client
		hubClient.start();
	},
};
