import { FormRow, FormLabel, FormValue, FormRightButton, FormField, FormSelect, TierSelect, LabelSelect, FormTextValue } from 'forms';
import {
    VerticalScroller,
    VerticalScrollbar,
    TopScrollerShadow,
    BottomScrollerShadow
} from 'src/scroller';
import * as common from 'common';

/************ EXPORT SCREEN **********************************************/
export var HelpScreen = Container.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	skin: common.screenSkin,
	Behavior: class extends Behavior {
		onDisplaying(content) {
			this.render(content);
		}
		update(content) {
			// no re-rendering because this make the user lose any
			// work in progress
		}
		render(content) {
			content.empty();
			content.add(
				new common.NavBar({ contents: [
					new common.NavMenuButton(),
					new common.NavTitleLeft({ string: 'Help' }),
				]})
			);

			let helpContents = new Column({
				left: 0, right: 0, top: 0,
				contents: [
					textblock('Help'),
					textblock('There are 4 important sections in this app: the Item Explorer screen, the Users screen, the Locker Manager screen, and the Account Settings screen. All of these sections can be accessed using the manu button at the top left of each screen.'),
					textblock('Item Explorer'),
					pictureblock('documents'),
					textblock('You can manage your items just as you would with a virtual file explorer. You can group items using folders and give items tags. To store a new item or create a folder, tap the plus button at the bottom. To search for an item, use the search bar at the top. Items can be searched by their name, description, and tags. You can sort your view using the sort drop down at the top right. Items can be sorted by name, date, access tier, and tag.'),
					pictureblock('search_sort'),
					textblock('Users'),
					pictureblock('users'),
					textblock('You can manage your users using the Users screen. To add a new user, tap the plus button at the bottom. You can change a user’s access tier by tapping on them, which will bring up their profile.'),
					pictureblock('user_profile'),
					textblock('Tap the edit button to change their tier'),
					textblock('Locker Manager'),
					pictureblock('locker_manager'),
					textblock('You can add or remove cabinets through the Locker Manager screen To add a new cabinet, tap the plus button at the bottom.'),
					textblock('Account Settings'),
					pictureblock('account_settings'),
					textblock('You can change your account details in the Account Settings screen. You name, email, and access tier can all be changed (if you are an admin).'),
				]
			})

			content.add(
				new Container({
					left: 0, right: 0, top: common.navBarHeight, bottom: 0,
					clip: true,
					contents: [
						VerticalScroller({}, {
							active: true,
							top: 0, left: 0, right: 0, bottom: 0,
							contents: [
								helpContents,
								VerticalScrollbar(), TopScrollerShadow(), BottomScrollerShadow(),
							]
						})
					]
				})
			);
		}
	}
}));

var textblock = Text.template($ => ({
	left: common.screenPadding, right: common.screenPadding,
	top: common.screenPadding,
	style: common.bodyStyle,
	string: $
}));

var pictureblock = Picture.template($ => ({
	left: common.screenPadding, right: common.screenPadding,
	top: 0, height: 300,
	aspect: 'fit',
	url: 'assets/help_screen_shots/' + $ + '.png'
}));