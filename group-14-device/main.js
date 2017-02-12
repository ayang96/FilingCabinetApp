import * as common from "common";
import * as form from "forms";

import { DEVICE_UNIQUE_ID, DEVICE_UNIQUE_PASSCODE } from 'DEVICE_UNIQUE';

let Pins = require("pins");

const COMPANION_PROJECT_ID = "group-14-companion.project.kinoma.marvell.com";

let availablePins = [];
for (let i = 51; i <= 66; i++) {
	availablePins.push(i);
}
for (let i = 3; i <= 12; i++) {
	availablePins.push(i);
}
for (let i = 15; i <= 24; i++) {
	availablePins.push(i);
}

let lockerNames = new Set();

const LOCKER_CAPACITY = 17

let companions = new Set();

function configurePins() {

	let configuration = {};

	// This is used to signal to all the lockers that they have been closed
	// for the sake of the demo. Normally would have each locker with it's
	// own input
	configuration['universalInput'] = {
		require: "Digital",
		pins: {
			digital: { pin: 24, direction: "input"},
		}
	}

	for (let i = 1; i <= LOCKER_CAPACITY; i++) {
		lockerNames.add('locker' + i);
		configuration['locker' + i] = {
			require: "Digital",
			pins: {
				digital: { pin: availablePins[(i - 1) * 2], direction: "output" },
			}
		}
		/* uncomment for real app */
		// configuration['lockerInput' + i] = {
		// 	require: "Digital",
		// 	pins: {
		// 		digital: { pin: availablePins[(i - 1) * 2 + 1], direction: "input" },
		// 	}
		// }
	}


	Pins.configure(configuration, function(success) {
		if (!success) {
			trace("Failed to configure\n");
		} else {

			Pins.repeat("/universalInput/read", 100, result => {
				if (result) {
					for (let i = 1; i <= LOCKER_CAPACITY; i++) {
						let pin = 'locker' + i;
						Pins.invoke("/" + pin + "/write", 0);
					}
					application.distribute("clearOpenLockers");
				}
			});

			/* uncomment for real app */
			// for (let i = 1; i <= LOCKER_CAPACITY; i++) {
			// 	let pinIn = 'lockerInput' + i;
			// 	Pins.repeat("/" + pinIn + "/read", 20, result => {
			// 		let pinOut = 'locker' + i;
			// 		Pins.invoke("/" + pin + "/write", 0);
			// 	})
			// }

		}
	});
}


Handler.bind("/openLocker", Behavior({
	onInvoke: function(handler, message) {
		let json = JSON.parse(message.requestText);
		if (! (json.userName && json.lockerNumer)) {

			let pin = 'locker' + json.lockerNumber;
			if (lockerNames.has(pin)) {
				Pins.invoke('/' + pin + '/write', 1);
				application.distribute('addOpenLocker', json);
				message.status = 200;
			} else {
				message.status = 400;
				message.responseText = "Locker does not exist on device."
			}
		} else {
			message.status = 400;
			message.responseText = "Bad request to open locker."
		}
	}
}));

Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message) {
		let deviceURL = JSON.parse(message.requestText).url;
		trace("Device discovered mobile at " + deviceURL + "\n");
		companions.add(deviceURL);
	}
}));

Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		companions = new Set();
	}
}));

let Screen = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: common.screenSkin,
	contents: [
		new common.NavBar({ contents: [
			common.NavTitleCenter({ string: 'Current Open Lockers' })
		]}),
		new Column({
			left: common.screenPadding, right: common.screenPadding,
			top: common.screenPadding, bottom: common.screenPadding,
			Behavior: class extends Behavior {
				onCreate(content) {
					this.userLockers = {};
				}
				addOpenLocker(content, data) {
					let user = data.userName;
					let locker = data.lockerNumber;
					let lockerSet = this.userLockers[user];
					if (lockerSet) {
						lockerSet.add(locker);
					} else {
						this.userLockers[user] = new Set([locker]);
					}
					this.render(content);
				}
				clearOpenLockers(content) {
					this.userLockers = {};
					this.render(content);
				}
				render(content) {
					content.empty();
					for (let user of Object.keys(this.userLockers)) {
						let lockers = Array.from(this.userLockers[user]);
						content.add(
							new form.FormRow({ contents: [
								new form.FormLabel({ string: user }),
								new form.FormValue({ string: 'Lockers ' + lockers.join(', ') }),
							]})
						);
					}
				}
			}
		})
	]
}))

class ApplicationBehavior extends Behavior {
	onLaunch(application) {

		configurePins();
		application.shared = true;
		application.discover(COMPANION_PROJECT_ID);
		application.add(new Screen());
	}
	onQuit(application) {
		application.forget(COMPANION_PROJECT_ID);
		application.shared = false;
	}
}

application.behavior = new ApplicationBehavior();