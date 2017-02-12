/*
* 	Main Screen 
*	Runs everything at start
*	Simulate on iap140: 640x960 / 2 (iPhone 4)
*   Sections Organization:
* 	1) Imports- import each screen
*	2) Assets- common stuff from Figma and our own icons
*	3) Behaviors
*	4) Templates
*	5) Application and Application Data- application, example data here
*	6) Launch Code
*/

// Note: While working, be sure to clear cache before compiling as follows:
// rm -r ~/Library/Preferences/fsk/1/Kinoma\ Code/com.marvell.kinoma.project.*

/***************** 1) IMPORTS *******************************************/

import { DocumentsScreen } from "documents";
import { UsersScreen } from "users";
import { FileScreenTemplate } from "FileScreen";
import { UserProfileScreen } from "user_profile";
import { FileHistoryTemplate } from "FileHistory";
import { Menu } from "Menu";
import { Data, sampleData } from "model";
import { NewDocumentScreen } from "new_document";
import { NewFolderScreen } from "new_folder";
import { NewUserScreen } from "new_user";
import { CabinetsScreen } from "cabinets";
import { TagCustomizerScreen } from "TagCustomizer";
import { SettingsScreen } from "settings";
import { HelpScreen } from "help";
import { LogInTemplate } from "LogIn";
import { NetworkManager } from "network";
import * as common from "common";
import * as form from "forms";

/***************** 5) APPLICATION AND APPLICATION DATA ******************/


let data = sampleData;
data.setState({ folder: 'root' });

let net = new NetworkManager(data);

let screens = {
	"documentsScreen" : new DocumentsScreen(data),
	"documentInfoScreen" : new FileScreenTemplate({ data: data, net: net }),
	"documentHistoryScreen" : new FileHistoryTemplate({ data: data}),
	"newDocumentScreen" : new NewDocumentScreen({ data: data }),
	"newFolderScreen" : new NewFolderScreen({ data: data }),
	"userProfileScreen": new UserProfileScreen({ data: data }),
	"usersScreen": new UsersScreen({ data: data }),
	"newUserScreen": new NewUserScreen({ data: data }),
	"cabinetsScreen" : new CabinetsScreen(data),
	"newLabelScreen" : new TagCustomizerScreen({ data: data }),
	"settingsScreen" : new SettingsScreen({ data: data }),
	"helpScreen" : new HelpScreen({ data: data }),
	"loginScreen" : new LogInTemplate({ data: data }),
}

let screenParents = {
	"documentsScreen" : "root:documents",
	"documentInfoScreen" : "documentsScreen",
	"documentHistoryScreen" : "documentInfoScreen",
	"newDocumentScreen" : "documentsScreen",
	"newFolderScreen" : "documentsScreen",
	"userProfileScreen": "usersScreen",
	"usersScreen": "root:users",
	"newUserScreen": "usersScreen",
	"cabinetsScreen" : "root:cabinets",
	"newLabelScreen" : "newDocumentScreen",
	"settingsScreen" : "root:settings",
	"helpScreen" : "root:help",
	"loginScreen" : "root:logout",
}

class ApplicationBehavior extends Behavior {
	onLaunch(application) {
		let dispatcher = new common.Dispatcher({
			menu: new Menu({ data: data }),
			screens: screens,
			screenParents: screenParents
		});
		application.add(dispatcher);
		application.distribute("dispatch", "loginScreen");
		net.start();
	}
	onQuit(application) {
		net.end();
	}
}


/* TOGGLE THIS true/false TO TEST YOUR OWN CODE */
let USE_TEST_CODE = false

if (USE_TEST_CODE) {

/***************** BEGIN TESTING AREA *************************************/


// put all test code here
// any code you write will execute if USE_TEST_CODE == true  */
// example
// application.add(new Container({ name: 'My Test Screen' }));





/***************** END TESTING AREA *************************************/

} else {
	application.behavior = new ApplicationBehavior();
}
