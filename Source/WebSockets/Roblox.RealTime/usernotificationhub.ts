//{"C":"d-9042436C-B,0|z9cD,1|z8Ru,5|z9cE,1","M":[{"H":"UserNotificationHub","M":"notification","A":["FriendshipNotifications","{\"Type\":\"FriendshipRequested\",\"EventArgs\":{\"UserId1\":2377893199,\"UserId2\":158190828},\"SequenceNumber\":49}",0]}]}

import EventManager from 'Assemblies/Web/EventManager/Roblox.Web.EventManager/Notifications';
import Http from 'axios';
import Events from 'events';
import { IncomingMessage } from 'http';
import Socket from 'ws';
import { FASTLOG, FASTLOGS, FLog, LOGGROUP } from 'Assemblies/Web/Util/Roblox.Web.Util/Logging/FastLog';

LOGGROUP('WebSockets');

export default {
	dir: '/notifications/connect',
	func: (socket: Socket, req: IncomingMessage): void => {
		let seq = 1;
		const e = new Events.EventEmitter();
		EventManager.subscribe(req.headers.cookie, e);
		e.on('message', (m, uid) => {
			FASTLOG(
				FLog['WebSockets'],
				'[FLog::WebSockets] Message request!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ' + m,
			);
			console.log(m, uid);
			Http.get('https://assetgame.roblox.com/Game/GetCurrentUser.ashx', {
				headers: { Cookie: req.headers.cookie },
			})
				.then((re2) => {
					let iscurrentuser = false;
					uid.forEach((element) => {
						console.log(element.toString() === re2.data, element === re2.data, element === parseInt(re2.data));
						if (element === re2.data) iscurrentuser = true;
					});
					if (iscurrentuser) {
						console.log(m);
						socket.send(
							JSON.stringify({
								C: 'd-5D8C14A5-B,0|F2hw,1|F2BE,2|F2hx,1',
								M: [
									{
										H: 'UserNotificationHub',
										M: 'notification',
										A: [
											'ChatNotifications',
											JSON.stringify({
												ConversationId: m,
												ActorTargetId: null,
												ActorType: null,
												Type: 'NewMessage',
												SequenceNumber: 130 + seq,
											}),
											0,
										],
									},
								],
							}),
						);
						seq++;
					}
				})
				.catch((e) => {
					FASTLOGS(FLog['WebSockets'], '[FLog::WebSockets] There was an error with this because: %s', e.message);
					return;
				});
		});
		e.on('typing', (uid) => {
			console.log(uid);
			Http.get('https://assetgame.roblox.com/Game/GetCurrentUser.ashx', {
				headers: { Cookie: req.headers.cookie },
			})
				.then((re2) => {
					let iscurrentuser = false;
					uid.forEach((element) => {
						console.log(element.toString() === re2.data, element === re2.data, element === parseInt(re2.data));
						if (element === re2.data) iscurrentuser = true;
					});
					if (iscurrentuser) {
						socket.send(
							JSON.stringify({
								C: 'd-5D8C14A5-B,0|F2hw,1|F2BE,3|F2hx,1',
								M: [
									{
										H: 'UserNotificationHub',
										M: 'notification',
										A: [
											'ChatNotifications',
											'{"UserId":2377893199,"IsTyping":true,"ConversationId":9629329337,"ActorTargetId":null,"ActorType":null,"Type":"ParticipantTyping","SequenceNumber":133}',
											0,
										],
									},
								],
							}),
						);
						seq++;
					}
				})
				.catch((e) => {
					FASTLOGS(FLog['WebSockets'], '[FLog::WebSockets] There was an error with this because: %s', e.message);
					return;
				});
		});
		FASTLOG(FLog['WebSockets'], '[FLog::WebSockets] Connection opened for realtime, echoeing back');
		socket.send(JSON.stringify({ C: 'd-9042436C-B,0|z9cD,0|z8Ru,0|z9cE,1', S: 1, M: [] }));
		socket.send(
			JSON.stringify({
				C: 'd-9042436C-B,0|z9cD,1|z8Ru,0|z9cE,1',
				M: [
					{
						H: 'UserNotificationHub',
						M: 'subscriptionStatus',
						A: [
							'Subscribed',
							'{"MillisecondsBeforeHandlingReconnect":0,"SequenceNumber":4852,"NamespaceSequenceNumbers":{"GameCloseNotifications":286,"CloudEditChatNotifications":152,"AuthenticationNotifications":30,"ChatNotifications":86,"FriendshipNotifications":48,"UserTagChangeNotification":3,"AvatarAssetOwnershipNotifications":3,"NotificationStream":13,"GameFavoriteNotifications":1}}',
						],
					},
				],
			}),
		);
		let r = setInterval(() => {
			socket.send('{}');
		}, 10000);
		socket.on('close', () => {
			r.unref();
			r = undefined;
			socket.close();
			EventManager.unsubscribe(req.headers.cookie);
		});
	},
};
