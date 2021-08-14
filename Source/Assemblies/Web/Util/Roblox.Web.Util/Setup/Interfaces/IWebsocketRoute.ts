import { IncomingMessage } from 'http';
import Socket from 'ws';

export interface IWebsocketRoute {
	Callback: (client: Socket, incomingClientMessage: IncomingMessage) => unknown;
	/* USED BY SYSTEM SDK, DO NOT SET AS IT WILL BE OVERWRITTEN! */
	Route: string;
}
