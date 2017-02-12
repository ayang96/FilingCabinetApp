let DEVICE_PROJECT_ID = "group-14-device.project.kinoma.marvell.com";

export class NetworkManager {
	constructor(data) {
		this.data = data
	}

	start() {

		let data = this.data;

		Handler.bind("/discover", Behavior({
			onInvoke: function(handler, message) {
				let deviceURL = JSON.parse(message.requestText).url;
				trace("Mobile discovered device at " + deviceURL + "\n");

				/**
				 * DEMO CODE - remove later
				 */
				for (let id of Object.keys(data.cabinets)) {
					let cabinet = data.getCabinetData(id);
					if (cabinet.name === "Cabinet 01") {
						data.updateCabinet(id, { url: deviceURL });
					}
				}
			}
		}));

		Handler.bind("/forget", Behavior({
			onInvoke: function(handler, message){
				//deviceURL = "";
			}
		}));

		application.shared = true;
		application.discover(DEVICE_PROJECT_ID);
	}

	end() {
		application.forget(DEVICE_PROJECT_ID);
		application.shared = false;
	}

	openLocker(lockerID, callback) {
		let locker = this.data.getLockerData(lockerID);
		if (! locker) {
			callback({ status: false, message: 'Not a valid locker' });
			return;
		}
		let deviceURL = locker.cabinet.url;
		if (! deviceURL) {
			callback({ status: false, message: 'You are not connected to the locker' });
			return;
		}
		let message = new Message(deviceURL + 'openLocker');
		message.requestText = JSON.stringify({
			userName: this.data.getUserData(this.data.state.login).fullName,
			lockerNumber: locker.index,
		});
		let promise = message.invoke(Message.TEXT);
		promise.then(text => {
			if (200 == message.status) {
				callback({ status: true });
			}
			else {
				callback({ status: false, message: text });
			}
		});
	}
}