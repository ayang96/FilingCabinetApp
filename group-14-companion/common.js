import "src/date.format";
import { CrossFade, Push, Flip, TimeTravel, Reveal, Hide, ZoomAndSlide } from 'src/transition';
import { SystemKeyboard } from 'src/keyboard';
import { FieldLabelBehavior, FieldScrollerBehavior } from 'src/field';

/**
 * This file is for everything that is used universally throughout this project.
 * Colors, styles, common UI elements, useful functions, etc. go here.
 * 
 * The best way to use is to add the import: import * as common from "common";
 * then use any of the assets like: common.assetName
 *
 * Sections Organization:
 * 	1) Colors / Skins / Styles
 *	2) UI Elements
 *	3) Behaviors
 *	4) Miscellaneous
 **/



/************ 1) Colors / Skins / Styles **********************************************/

export var red = '#EB5757';
export var orange = '#F2994A';
export var yellow = '#F2C94C';
export var green = '#219653';
export var sky = '#56CCF2';
export var blue = '#2F80ED';
export var purple = '#9B51E0';
export var grey = '#828282';
export var black = 'black';

export var colorNames = ['red', 'orange', 'yellow', 'green', 'sky',
							'blue', 'purple', 'grey', 'black'];

export var offWhite = '#EEEEEE'; // For second state of white buttons

/* use this to "lookup" the value from a string
  	i.e. colorDict['red'] ==> '#EB5757' */
export var colorDict = {
	red:    red,
	orange: orange,
	yellow: yellow,
	green:  green,
	sky:    sky,
	blue:   blue,
	purple: purple,
	grey:   grey,
	black:  black,
}

export var darkerBlue = "#0455C2"; // for second state of buttons and links
export var systemGrey = "#F2F2F2"; // for backgrounds
export var systemDarkerGrey = "#CCCCCC"; // for second state of backgrounds
export var systemLineColor = 'silver'; // for lines seperating things

// Solid Fill Skins
export var redSkin = new Skin({ fill: red }); 			// = "red"
export var orangeSkin = new Skin({ fill: orange }); 	// = "orange"
export var yellowSkin = new Skin({ fill: yellow }); 	// = "yellow"
export var greenSkin = new Skin({ fill: green }); 		// = "green"
export var skySkin = new Skin({ fill: sky });			// = "sky"
export var blueSkin = new Skin({ fill: blue });			// = "blue"
export var purpleSkin = new Skin({ fill: purple });		// = "purple"
export var greySkin = new Skin({ fill: grey });			// = "grey"

export var buttonSkin = new Skin({ fill: [blue, darkerBlue] });
export var buttonStyleWhite = new Style({font: "16px Roboto", color: blue});
export var buttonStyleBlue = new Style({font: "16px Roboto", color: 'white'});

export var roundButtonSkin = new Skin({
	width: 120, height: 120, aspect: 'fit',
	texture: new Texture('assets/round_buttons_120x120.png'),
	states: 120, variants: 120,
});

export var darkScreenCoverSkin = new Skin({ fill: "rgba(0, 0, 0, 0.5)" });
export var alertSkin = new Skin({ fill: systemGrey });
export var alertOptionsSkin = new Skin({ stroke: systemLineColor, borders: { top: 1 }});
export var alertOptionButtonSkin = new Skin({ fill: [systemGrey, systemDarkerGrey] });
export var alertOptionsSeperatorSkin = new Skin({ fill: systemLineColor });

export var navBarSkin = new Skin({ fill: systemGrey, stroke: systemLineColor, borders: { bottom: 1 }});

export var screenSkin = new Skin({ fill: 'white' });

// Text Styles (left aligned by default for convenience)
export var bodyStyle 			= new Style({ font: "16px Roboto", color: black, horizontal: "left" });
export var bodyBoldStyle 		= new Style({ font: "16px Roboto Medium", color: black, horizontal: "left" });
export var bodyLightStyle 		= new Style({ font: "16px Roboto", color: grey, horizontal: "left" });
export var bodyWhiteStyle 		= new Style({ font: "16px Roboto", color: 'white', horizontal: "left" });
export var bodyLinkStyle 		= new Style({ font: "16px Roboto", color: [blue, darkerBlue], horizontal: "left" });
export var bodyLinkBoldStyle 	= new Style({ font: "16px Roboto Medium", color: [blue, darkerBlue], horizontal: "left" });
export var smallStyle 			= new Style({ font: "14px Roboto", color: black, horizontal: "left" });
export var smallLightStyle 		= new Style({ font: "14px Roboto", color: grey, horizontal: "left" });
export var smallWhiteStyle 		= new Style({ font: "14px Roboto", color: 'white', horizontal: "left" });
export var smallLinkStyle		= new Style({ font: "14px Roboto", color: [blue, darkerBlue], horizontal: "left" });
export var titleStyle 			= new Style({ font: "18px Roboto", color: black, horizontal: "left" });
export var titleBoldStyle 		= new Style({ font: "18px Roboto Medium", color: black, horizontal: "left" });

// center aligned
export var bodyStyleCenter			= new Style({ font: "16px Roboto", color: black, horizontal: "center" });
export var bodyBoldStyleCenter		= new Style({ font: "16px Roboto Medium", color: black, horizontal: "center" });
export var bodyLightStyleCenter		= new Style({ font: "16px Roboto", color: grey, horizontal: "center" });
export var bodyWhiteStyleCenter		= new Style({ font: "16px Roboto", color: 'white', horizontal: "center" });
export var bodyLinkStyleCenter		= new Style({ font: "16px Roboto", color: [blue, darkerBlue], horizontal: "center" });
export var bodyLinkBoldStyleCenter 	= new Style({ font: "16px Roboto Medium", color: [blue, darkerBlue], horizontal: "center" });
export var smallStyleCenter			= new Style({ font: "14px Roboto", color: black, horizontal: "center" });
export var smallLightStyleCenter	= new Style({ font: "14px Roboto", color: grey, horizontal: "center" });
export var smallWhiteStyleCenter	= new Style({ font: "14px Roboto", color: 'white', horizontal: "center" });
export var smallLinkStyleCenter		= new Style({ font: "14px Roboto", color: [blue, darkerBlue], horizontal: "center" });
export var titleStyleCenter			= new Style({ font: "18px Roboto", color: black, horizontal: "center" });
export var titleBoldStyleCenter 	= new Style({ font: "18px Roboto Medium", color: black, horizontal: "center" });

// right aligned
export var bodyStyleRight			= new Style({ font: "16px Roboto", color: black, horizontal: "right" });
export var bodyBoldStyleRight		= new Style({ font: "16px Roboto Medium", color: black, horizontal: "right" });
export var bodyLightStyleRight		= new Style({ font: "16px Roboto", color: grey, horizontal: "right" });
export var bodyWhiteStyleRight 		= new Style({ font: "16px Roboto", color: 'white', horizontal: "right" });
export var bodyLinkStyleRight		= new Style({ font: "16px Roboto", color: [blue, darkerBlue], horizontal: "right" });
export var bodyLinkBoldStyleRight 	= new Style({ font: "16px Roboto Medium", color: [blue, darkerBlue], horizontal: "right" });
export var smallStyleRight			= new Style({ font: "14px Roboto", color: black, horizontal: "right" });
export var smallLightStyleRight		= new Style({ font: "14px Roboto", color: grey, horizontal: "right" });
export var smallWhiteStyleRight		= new Style({ font: "14px Roboto", color: 'white', horizontal: "right" });
export var smallLinkStyleRight		= new Style({ font: "14px Roboto", color: [blue, darkerBlue], horizontal: "right" });
export var titleStyleRight			= new Style({ font: "18px Roboto", color: black, horizontal: "right" });
export var titleBoldStyleRight 		= new Style({ font: "18px Roboto Medium", color: black, horizontal: "right" });

// Layout constants/parameters
export const screenWidth = 320;		// width of screen / 2
export const screenHeight = 480;		// height of screen / 2
export const screenPadding = 20;	// padding for screens that use it (document info, user profile, etc)
export const plusButtonSize = 60;		// width and height of the plus add button
export const plusBottomOffset = 15;	// bottom offset of the plus add button
export const normalButtonBottomOffset = 70; // bottom offset of the normal buttons (user profile, new user)
export const navBarHeight = 40;
export const navPadding = 15; // left-right padding of navBar items

// Images

/************ 2) UI Elements **********************************************/



/** 
Handles switching between screens in the app.
Use this as the main container for the app

Params:
$.menu : menu content to be displayed
$.screens: dict of <"screenName", screenContent>

Usage:
application.distribute("dispatch", "screenName")
	Makes the app switch to the screen with name "screenName" in $.screens
application.distribute("dispatch", "back")
	Makes the app go back to the last screen that it was on
application.distribute("showMenu")
	Shows the menu
application.distribute("hideMenu")
	Hides the menu
application.distribute("notify", "You're opening a doc!")
	Notifies the user about something
application.distribute("alert", { some settings })
	Alerts the user and prompts for action.
	See the document for Alert below on what settings can be passed in.
**/
export var Dispatcher = Container.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, active: true,
	contents: [
		new Container({
			left: 0, right: 0, top: 0, bottom: 0,
			name: "page", contents: [ new Container() ],
		}),
		new MenuHolder({ menu: $.menu }),
	],
	Behavior: class extends Behavior {
		onTouchEnded(content) {
			SystemKeyboard.hide();
			content.focus();
		}
		onCreate(content, data) {
			this.currentScreenName = "";
		}
		dispatch(content, screenName, transition) {
			if (screenName === "back") {
				screenName = $.screenParents[this.currentScreenName];
				transition = transition || 'pushRight';
			}
			let screen = $.screens[screenName];
			let currentScreen = content.page.last;
			if (screen && screen != currentScreen) {
				switch (transition) {
					case 'push':
					case 'pushLeft':
						content.page.run( new Push(), currentScreen, screen, { duration: 300, direction: "left" } );
						break;
					case 'pushRight':
						content.page.run( new Push(), currentScreen, screen, { duration: 300, direction: "right" } );
						break;
					case 'new':
					case 'revealUp':
						content.page.run( new Reveal(), currentScreen, screen, { duration: 300, direction: "up" } );
						break;
					case 'cancelNew':
					case 'hideDown':
						content.page.run( new Hide(), currentScreen, screen, { duration: 300, direction: "down" } );
						break;
					case 'none':
						content.page.empty();
						content.page.add(screen);
						break;
					default:
						content.page.run( new CrossFade(), currentScreen, screen, { duration: 50 } );
						break;
				}
				this.currentScreenName = screenName;
				this.updateMenu(content);
			}
			this.hideMenu(content);
		}
		showMenu(content) {
			content.holder.visible = true;
			this.updateMenu(content);
		}
		hideMenu(content) {
			content.holder.visible = false;
		}
		updateMenu(content) {
			let name = this.currentScreenName;
			while (name in $.screenParents) {
				name = $.screenParents[name];
			}
			if (name.length > 5 && name.substring(0, 5) === "root:") {
				let category = name.substring(5);
				content.holder.distribute("updateCategory", category);
			}
		}
		notify(content, message) {
			let settings = {
				message: message,
				blocking: true,
				options: [{ string: "OK", callback: function(){} }]
			};
			application.add(new Alert(settings));
		}
		alert(content, settings) {
			application.add(new Alert(settings));
		}
	}
}));

let MenuHolder = Container.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, active: true,
	visible: false,
	name: "holder",
	contents: [ $.menu ],
	Behavior: class extends ButtonBehavior {
		onTap(content) {
			application.distribute("hideMenu");
		}
	}
}));

const menuBarHeight = 35;

// Template for adding a menu bar placeholder above and on top of screen.
// Instantiate as new screenWithMenubar({screen: [ScreenObject]})
export var ScreenWithMenuBar = Container.template($ => ({
	top:0, left:0, bottom:0, right:0, active: true,
	contents: [
		new Container({
			left: 0, right: 0, top: navBarHeight, bottom: 0, contents: [ $.screen ]
		}),
		new NavBar({
			contents: [
				new NavMenuButton(),
			]
		}),
	]
}));

export var NavBar = Line.template($ => ({
	left: 0, right: 0, top: 0, height: navBarHeight,
	name: "nav", skin: navBarSkin, contents: $.contents,
}));

export var NavMenuButton = Picture.template($ => ({
	height: 26, left: navPadding,
	url: "assets/MenuIcon.png", active: true,
	Behavior: class extends ButtonBehavior {
		onTap(content){
			application.distribute("showMenu");
		}
	}
}));

export var NavBackButton = Line.template($ => ({
	left: navPadding, right: navPadding, active: true,
	contents: [
		new Picture({
			left: 0, width: 8, aspect: 'fit',
			url: 'assets/arrow_left.png',
		}),
		new Label({
			left: 5, style: bodyLinkStyle,
			string: "Back",
		})
	],
	Behavior: class extends ButtonBehavior {
		onTap(content) {
			application.distribute("dispatch", "back");
		}
	}
}));

export var NavSelectButton = Label.template($ => ({
	right: navPadding, style: bodyLinkStyleRight, active: true,
	string: "Select", Behavior: $.Behavior
}));

export var NavSelectAllButton = Label.template($ => ({
	right: navPadding, style: bodyLinkStyleLeft, active: true,
	string: "Select All", Behavior: $.Behavior
}));

export var NavCancelButton = Label.template($ => ({
	right: navPadding, style: bodyLinkBoldStyleRight, active: true,
	string: "Cancel", Behavior: $.Behavior
}));

export var NavEditButton = Label.template($ => ({
	right: navPadding, style: bodyLinkStyleRight, active: true,
	string: "Edit", Behavior: $.Behavior
}))

export var NavTitleLeft = Label.template($ => ({
	left: navPadding, right: navPadding, style: bodyStyle, string: $.string,
}));

export var NavTitleCenter = Label.template($ => ({
	left: navPadding, right: navPadding, style: bodyStyleCenter, string: $.string,
}));

/**
 * Use for nav bar search, only creates the UI, actual updating of
 * application state should be done in the behavior passed in
 * @params
 * $.hintString {String} -hint string to display
 * $.string {String} -current search string in field
 * $.Behavior {Behavior} -should implement one method:
 * 		onSearch(content, searchString)
 * 			-content: this content, not important
 * 			-searchString: String that user will type in
 * 		onSearch will be call every time the user hits search
 *
 * Usage:
 * class mySearchBehavior extends Behavior {
 * 		onSearch(content, searchString) {
 * 			globalData.search(searchString);
 * 			globalData.setState({ folder: 'search' });
 * 			application.distribute('update');
 * 		}
 * }
 * let mySearchField = new NavSearch({
 * 		hintString: 'Search Documents/Folders/Labels...',
 * 		string: '',
 * 		Behavior: mySearchBehavior,
 * })
 */
export var NavSearch = Line.template($ => ({
	left: navPadding, right: navPadding, active: true,
	contents: [
		new Picture({
			height: 21, left: 0, url: "assets/icon_search_glass_20x20.png", active: true,
			Behavior: class extends ButtonBehavior {
				onTap(content) {
					content.container.field.distribute('_search');
				}
			}
		}),
		new Container({
		    name: 'field', left: 0, right: 0, clip: true,
		    contents: [
		        new Scroller({
		            left: 2, right: 2, active: true,
		            Behavior: FieldScrollerBehavior,
		            contents: [
		                new Label({
		                    left: 0,
		                    style: bodyStyle,
		                    editable: true, string: $.string,
		                    Behavior: class extends FieldLabelBehavior {
		                        _search(content) {
		                        	content.bubble('onSearch', content.string);
		                        }
		                    },
		                }),
		                new Label({
		                    left: 0, right: 0, style: bodyLightStyle,
		                    visible: (! $.string),
		                    string: $.hintString || '', name: "hint",
		                }),
		            ]
		        })
		    ]
		}),
	],
	Behavior: $.Behavior,
}));


/**
Use for the big blue buttons at the bottom of a lot of our screens
Params:
$.string: "TAP ME" or something like that
$.Behavior: Behavior for this button, recommended is to extend ButtonBehavior
$.skin: optional, skin for the button, default is the blue common.buttonSkin
$.style: optional, style for the label in the button, default is the white common.buttonStyleBlue
$.left, $.right, $.top, $.bottom, $.width, $.height: optional, default is pretty good too
**/
export var NormalButton = Container.template($ => ({
	name:$.name, left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: $.width || 120, height: $.height || 40,
	skin: $.skin || buttonSkin, active: true,
	Behavior: $.Behavior,
	contents: [
		new Label({ string: $.string, style: $.style || buttonStyleBlue })
	]
}));


// Use to cover the screen entirely to register taps
export var ScreenCover = Container.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: darkScreenCoverSkin, active: true,
	contents: ($ && $.contents ? $.contents : []),
	Behavior: ($ && $.contents ? $.Behavior : null),
}));


/**
Use to display an alert. 
Note: For general alerts you should still use the dipatcher
Params:
$.title: optional, the title of the alert
$.message: the message
$.blocking: optional, set to true if you don't want the user
			to be able to get out of the alert without clicking
			an option, false otherwise (can click outside the
			bounds of the alert to exit), default is true
$.options: corresponds to the buttons, should be a list of dicts
			of the form:
			{
				string: "Okay/Cancel/etc",
				callback: function() {
					// zero argument function called when this
					// option is selected
				}
			}
**/
export var Alert = ScreenCover.template($ => ({
	contents: [ new AlertBox($) ],
	Behavior: class extends ButtonBehavior {
		onTap(content) {
			if ('blocking' in $ && ! $.blocking) {
				this.exit(content);
			}
		}
		exit(content) {
			application.remove(content);
			return true;
		}
	}
}));

let AlertBox = Container.template($ => ({
	left: 40, right: 40, active: true,
	skin: alertSkin, contents: [
		new Column({
			left: 0, right: 0, top: 0, bottom: 0,
			name: 'main', contents: [
				new Column({
					left: alertPadding, right: alertPadding, top: alertPadding, bottom: alertPadding,
					name: 'textArea'
				})
			]
		})
	],
	Behavior: class extends Behavior {
		onCreate(content) {
			if ($.title) {
				content.main.textArea.add(new AlertTitle($.title));
			}
			content.first.textArea.add(new AlertMessage($.message));
			if ($.options) {
				content.main.add(new AlertOptions($.options));
			}
		}
	}
}));

let AlertTitle = Label.template($ => ({
	left: 0, right: 0, bottom: alertPadding,
	string: $, style: titleBoldStyleCenter,
}));

let AlertMessage = Text.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0,
	string: $, style: bodyStyle,
}));

let AlertOptions = Line.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: alertOptionsSkin,
	Behavior: class extends Behavior {
		onCreate(content) {
			content.add(new AlertOptionButton($[0]));
			for (let i = 1; i < $.length; i++) {
				content.add(new AlertOptionSeperator());
				content.add(new AlertOptionButton($[i]));
			}
		}
	}
}));

let AlertOptionButton = Container.template($ => ({
	left: 0, right: 0, top: 1,
	active: true, skin: alertOptionButtonSkin, contents: [
		new Container({
			left: 0, right: 0, top: alertPadding, bottom: alertPadding,
			contents: [ new Label({ string: $.string, style: buttonStyleWhite }) ]
		})
	],
	Behavior: class extends ButtonBehavior {
		onTap(content) {
			$.callback();
			content.bubble("exit");
		}
	}
}));

let AlertOptionSeperator = Container.template($ => ({
	top: 0, bottom: 0, width: 1, skin: alertOptionsSeperatorSkin
}));

let alertPadding = 15;


// Plus Add button template. set Behavior by extending common.ButtonBehavior
export var PlusButton = Container.template($ => ({
	bottom: plusBottomOffset, width: plusButtonSize, height: plusButtonSize,
	active: true, skin: roundButtonSkin, variant: 0, state: 0,
	Behavior: ($ ? $.Behavior : ButtonBehavior)
}));

export var CancelButton = Container.template($ => ({
	bottom: plusBottomOffset, width: plusButtonSize, height: plusButtonSize,
	active: true, skin: roundButtonSkin, variant: 1, state: 0,
	Behavior: ($ ? $.Behavior : ButtonBehavior)
}));

export var ProfileIcon = Picture.template(($={}) => (Object.assign({
	height: 50, width: 50, url:'./assets/icon_user_ring_70x70.png'
}, $)));

export var CircleMaskWhite = Picture.template(($={}) => (Object.assign({
	url: 'assets/circle_mask_white_120x120.png', aspect: 'stretch',
}, $)));

/**
 * Creates a bookmark shaped tag, default height and width can be overridden
 * $.color {String} - name of the color, e.g. 'red'
 * $.string {String} - letter in tag
 * $.style {Style} - Optional, style to use for label
 */
export var Tag = Container.template(($={}) => (Object.assign({
	skin: new Skin({ fill: colorDict[$.color] }),
	height: 30, width: 25,
	contents: [
		new Picture({
			left: 0, right: 0, top: 0, bottom: 0,
			aspect: 'stretch', url: 'assets/single_tag_cutout_shadow.png',
		}),
		new Label({
			name: 'char',
			style: $.style || bodyWhiteStyle, string: $.string,
		}),
	]
}, $)));

/************ 3) Behaviors **********************************************/

/**
 * Use this behavior for anything that acts like a button,
 * e.g. When you press on it, it changes to a different color, and when
 * you release, it goes back to its original color. Different colors, fonts,
 * etc. should be implemented using different states. You can optionally
 * extend this behavior to take some action after pressing the button
 * using the onTap method.
 * Example:
		let myButton = new Container({ width: 100, height: 100, active: true,
			skin: new Skin({ fill: ['silver', 'gray'] }),
			Behavior: class extends ButtonBehavior {
				onTap(content) {
					// execute some code
					foo();
				}
			}
		});
*/
export class ButtonBehavior extends Behavior {
	onTouchBegan(content) {
		content.state = 1;
	}
	onTouchEnded(content) {
		content.state = 0;
		content.delegate("onTap");
		content.focus();
	}
}


/************ 4) Miscellaneous **********************************************/

/** Date string format to be used through the app **/
export function formatDate(date) {
	return date.format("mmm. d yyyy");
	//return date.format();
}

/** Returns a string corresponding to a randomly chosen color **/
export function randomColor() {	// Modified as was yielding improper values frequently?
	let colorNum = Math.floor(Math.random() * colorNames.length);
	if (colorNum == colorNames.length) colorNum--;
	return colorNames[colorNum];
}

/** Returns the capitalized full name of someone given their first and last names **/
export function fullName(firstName, lastName) {
	return (firstName.slice(0, 1).toUpperCase() + firstName.slice(1) + ' ' +
			lastName.slice(0, 1).toUpperCase() + lastName.slice(1)).trim();
}

export function capitalize(name) {
	return (name.slice(0, 1).toUpperCase() + name.slice(1)).trim();
}
