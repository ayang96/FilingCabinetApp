/*
* 	Users Screen 
*	For viewing users database
*	Simulate on iap140: 640x960 / 2 (iPhone 4)
*   Sections Organization:
* 	1) Export Screen- this screen as a container template
*	2) Imports
*	3) Assets- format standard sizes, colors, images, text fonts
*	4) Behaviors
*	5) Templates
*/

/************ 1) EXPORT SCREEN **********************************************/
export var UsersScreen = Container.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	skin: lineSkin,
	contents: [],
	Behavior: screenBehavior
}));

/************ 2) IMPORTS *****************************************************/
import * as common from "common";

import {
    VerticalScroller,
    VerticalScrollbar,
    TopScrollerShadow,
    BottomScrollerShadow
} from 'src/scroller';

/************ 3) ASSETS ******************************************************/

// Format standards. Edit here if necessary
const userIconSize = 30;		// width and height of a label tag
const lineHeight = 50;			// height of a document listing
const sideMargin = 15;			// left and right margin of a document listing
const spacing = 10;				// spacing left and right of items
const accessTierWidth = 100;	// width of the access tier column
const sortBarHeight = 32;		// height of sortbar/directory from documents


// Solid Fill Skins
let redSkin = new Skin({ fill:'#EB5757' }); 		// = "red"
let orangeSkin = new Skin({ fill:'#F2994A' }); 		// = "orange"
let yellowSkin = new Skin({ fill: '#F2C94C' }); 	// = "yellow"
let greenSkin = new Skin({ fill: '#219653' }); 		// = "green"
let skySkin = new Skin({ fill: '#56CCF2' });		// = "sky"
let blueSkin = new Skin({ fill: '#2F80ED' });		// = "blue"
let purpleSkin = new Skin({ fill: '#9B51E0'});		// = "purple"
let greySkin = new Skin({ fill: '#828282'});		// = "grey"

let lineSkin = new Skin({							//stroked skin of a user listing
		fill: ['white', common.offWhite],			
		stroke: 'silver',
		borders: {left: 0, right: 0, top: 0, bottom: 1}
});	

let pendingIcon = Picture.template($ => ({		// hourglass user icon for pending users
	width: userIconSize, height: userIconSize,
	url: 'assets/icon_pending_hourglass_32x32.png',
	aspect: 'fit'
}));

// Text Labels
// For clickable text
let clickableStyle = common.bodyLinkStyle;
//new Style({font: "16px Roboto Regular", color: "#2F80ED", horizontal: "left"});

// For nonclickable text
let nonClickableStyle = common.bodyStyle;
//new Style({font: "16px Roboto Regular", color: "black", horizontal: "left"});

let iconLabel = Label.template($ => ({				// for a user icon
	width: userIconSize, height: userIconSize,
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	style: new Style({font: "16px Roboto Medium", color: "white", horizontal: "center"}),
	string: $.string
}));

/************* 4) BEHAVIORS ****************************************************/

// Main screen behavior
class screenBehavior extends Behavior {
	onCreate(screen, $) {
		// Extract given data TODO
		this.data = $.data;
	}
	onDisplaying(screen) {
		this.render(screen);
	}
	update(screen) {
		this.render(screen);
	}
	render(screen) {

		screen.empty();

		// Add to screen
		let screenColumn = new Column({
			top: 0, left: 0, right: 0, bottom: 0,
		});
		screen.add(screenColumn);

		// Add nav bar
		let navBar = new common.NavBar({ contents: [
			new common.NavMenuButton(),
			new common.NavTitleLeft({ string: 'Users' }),
			new common.NavSelectButton({
				Behavior: class extends common.ButtonBehavior {
					onTap(content) {
						application.distribute('notify', 'Implementation coming soon!');
					}
				}
			})
		]});
		screenColumn.add(navBar);

		// Add directory bar line
		screenColumn.add(new SortBarLine());
		
		// Add scroller 
		let contentToScrollVertically = new Column({
			top: 0, left: 0, right: 0, 
			contents: []
		});
		// Add users
		let users = this.data.getUserList();
		/* implement sorting */
		for (let user of users) {
			contentToScrollVertically.add(new userLine({ userData: user, data: this.data }));
		}
		let mainScroller = new MainScroller({contentToScrollVertically});
		screenColumn.add(mainScroller);		


		// Add plus button
		let plusButton = common.PlusButton({
			Behavior: class extends common.ButtonBehavior {
				onTap(content) {
					application.distribute('dispatch', 'newUserScreen', 'new');
				}
			}
		});
		screen.add(plusButton);
	}
};

// Auto-generates skin and text of a label or tag icon
class userIconBehavior extends Behavior {
	onCreate(icon, $) {
		switch ($.tier.color) {
			case 'red':
				icon.skin = redSkin;
				break;
			case 'orange':
				icon.skin = orangeSkin;
				break;
			case 'yellow':
				icon.skin = yellowSkin;
				break;
			case 'green':
				icon.skin = greenSkin;
				break;
			case 'sky':
				icon.skin = skySkin;
				break;
			case 'blue':
				icon.skin = blueSkin;
				break;
			case 'purple':
				icon.skin = purpleSkin;
				break;
			case 'grey':
				icon.skin = greySkin;
				break;
			default:
				icon.skin = greySkin;
				break;
		} 
		
		// If status is pending
		if ($.pending) {
			icon.add(new pendingIcon());
		} else {
			// Add initial to label
			icon.add(new iconLabel({ string: $.abbreviation }));
		}
	}
};

// Auto-generates user icon, name, and tier
class userLineBehavior extends common.ButtonBehavior {
	onCreate(content, $) {

		this.data = $.data;
		this.userData = $.userData;

		// Add left margin spacing
		content.add(new Container({left:0, width: sideMargin}));
		
		// Add user icon
		content.add(new userIcon($.userData));
		
		// Add user name
		content.add(new Label({
			left: spacing, right: spacing, style: ($.userData.pending ? common.bodyLightStyle : common.bodyBoldStyle),
			string: $.userData.fullName
		}));

		// Add tier
		content.add(new Label({
			right: sideMargin, width: accessTierWidth, style: ($.userData.pending ? common.bodyLightStyle : common.bodyStyle),
			string: $.userData.tier.name
		}));
	}
	onTap(content) {
		this.data.setState({ user: this.userData.id });
		application.distribute('dispatch', 'userProfileScreen', 'push');
	}
};

class sortBarBehavior extends Behavior {
	onCreate(col, data) {
		// Sort text
		let top = new Container({
			left: 0, right: 0, top: 0, height: sortBarHeight,
			contents: [
				/* Removing from demo */
				// new sortButton(),
			]
		});
		col.add(top);
		
		// Access tier headings text
		let bottom = new Container({
			left: 0, right: 0, top: 0, height: sortBarHeight,
			contents: [
				new Label({
					left: sideMargin, style: common.bodyBoldStyle,
					string: "Users"
				}),
				new Label({
					right: sideMargin, width: accessTierWidth, style: common.bodyBoldStyle,
					string: "Access Tier"
				}),
			]
		});
		col.add(bottom);
		
	}
};

class sortButtonBehavior extends Behavior {
	onCreate(button) {
		//TODO
	}
	onTouchBegan(button) {
	}
	onTouchEnded(button) {
	}
};



/**************** 5) TEMPLATES *******************************************/

// Sort button on upper right
let sortButton = Label.template($ => ({
	string: 'Sort v',  right: sideMargin, 
	style: common.bodyLinkStyleRight,
	Behavior: sortButtonBehavior
}));


// User icon. Define data = {text = user's name, color = label color}
// When instantiating, call new userIcon(data)
let userIcon = Container.template($ => ({
	width: userIconSize, height: userIconSize, 
	Behavior: userIconBehavior,
	contents: [
		new common.CircleMaskWhite({top: 0, left: 0, right: 0, bottom: 0})
	]
}));

// Listing for a document.
// When instantiating, call new userLine(user's data)
let userLine = Line.template($ => ({
	top: 0, left: 0, right: 0, height: lineHeight,
	skin: lineSkin, active: true,
	Behavior: userLineBehavior,
}));

// Line on top for sort bar. 
let SortBarLine = Column.template($ => ({
	top: 0, left: 0, right: 0,
	skin: lineSkin,
	Behavior: sortBarBehavior,
	contents: []
}));

// Scroller template
let MainScroller = Column.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0, clip: true,
    contents: [
      VerticalScroller($, {
      	active: true,
      	top: 0, left: 0, right: 0,
      	contents: [ $.contentToScrollVertically,
      		VerticalScrollbar(), TopScrollerShadow(), BottomScrollerShadow(),
      	]
      }),  
    ]
}));



