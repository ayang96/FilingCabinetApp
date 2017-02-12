/*
* 	Cabinets Screen 
*	For viewing lockers and cabinets
*	Simulate on iap140: 640x960 / 2 (iPhone 4)
*   Sections Organization:
* 	1) Export Screen- this screen as a container template
*	2) Imports
*	3) Assets- format standard sizes, colors, images, text fonts
*	4) Behaviors
*	5) Templates
*/

/************ 1) EXPORT SCREEN **********************************************/
export var CabinetsScreen = Container.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	skin: lineSkin,
	contents: [],
	active: true,
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

let figmaScreen = Picture.template($ => ({		// prototype image of locker manager screen
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	url: 'assets/figma_cabinetsScreen.png',
	aspect: 'fit',
}));

let lineSkin = new Skin({							//stroked skin of a document listing
		fill: 'white', 			
		stroke: 'silver',
		borders: {left: 0, right: 0, top: 1, bottom: 1}
});	

let addCabinetSkin = new Skin({
	width: 90, height: 90, aspect: 'fit',
	texture: new Texture('assets/icon_add_cabinet_45x45.png'),
	states: 90, variants: 90,
});

/************* 4) BEHAVIORS ****************************************************/
// Main screen behavior
class screenBehavior extends Behavior{
	onCreate(screen, $) {
		screen.active = true;
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

		// Add nav bar
		let navBar = new common.NavBar({ contents: [
			new common.NavMenuButton(),
			new common.NavTitleLeft({ string: 'Locker Manager' }),
		]});

		// Add scroller 
		let contentToScrollVertically = new Container({
			left: 0, right: 0, top: 0,
			contents: []});
		
		// Add figma image simulation of lockers screen
		contentToScrollVertically.add(new figmaScreen({left: 0, right: 0, top: 0}));
		
		let mainScroller = new MainScroller({contentToScrollVertically});
		
		// Add plus button
		let plusButton = common.PlusButton({
			Behavior: class extends common.ButtonBehavior {
				onTap(content) {
					application.add(new common.ScreenCover({
						contents: [
							new Column({
								left: 0, right: 0, bottom: 0,
								contents: [
									new Line({
										left: 0, right: 0, bottom: 0,
										contents: [
											new Label({
												left: 0, right: 10, style: common.smallWhiteStyleRight,
												string: 'New Locker'
											}),
											new Container({
												right: 20, width: 45, height: 45, active: true,
												skin: addCabinetSkin, variant: 0, state: 0,
												Behavior: class extends common.ButtonBehavior {
													onTap(content) {
														content.bubble('exit');
														application.distribute("notify", 
														"Sorry, you do not have the access right to add a new cabinet. Please try again with Admin privileges.");
														//application.distribute('dispatch', 'newLockerScreen', 'new');
													}
												}
											}),
											new Container({ // empty spacer
												left: 20, width: 45, height: 45,
											}),
											new Label({ // empty spacer
												left: 10, right: 0,
											}),
										]
									}),
									new common.CancelButton({
										Behavior: class extends common.ButtonBehavior {
											onTap(content) {
												content.bubble('exit');
											}
										}
									}),
								]
							})
						],
						Behavior: class extends Behavior {
							exit(content) {
								application.remove(content);
								return true;
							}
						}
					}));
				}
			}
		});
		
		// Add to screen
		let screenColumn = new Column({
			top: 0, left: 0, right: 0, bottom: 0,
			contents: []
		});
		screenColumn.add(navBar);
		screenColumn.add(mainScroller);
		screen.add(screenColumn);
		screen.add(plusButton);	
	
	}
};

/**************** 5) TEMPLATES *******************************************/
// Scroller template
let MainScroller = Column.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0, clip: true,
    contents: [
      VerticalScroller($, {
      	active: true,
      	top: 0, left: 0, right: 0, bottom: 0,
      	contents: [ $.contentToScrollVertically,
      		VerticalScrollbar(), TopScrollerShadow(), BottomScrollerShadow(),
      	]
      }),  
    ]
}));
