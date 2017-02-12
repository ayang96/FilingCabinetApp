import { FormRow, FormLabel, FormValue, FormRightButton, FormField, TierSelect } from 'forms';
import * as common from 'common';

/************ EXPORT SCREEN **********************************************/
export var UserProfileScreen = Container.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	skin: common.screenSkin,
	Behavior: class extends Behavior {
		onCreate(content) {
			this.mode = 'view';
		}
		changeMode(content, mode) {
			this.mode = mode;
			this.render(content);
			return true;
		}
		onDisplaying(content) {
			this.render(content);
		}
		update(content) {
			if (this.mode !== 'edit') {
				this.render(content);
			}
		}
		render(content) {

			let userID = $.data.state.user;
			let userData = $.data.getUserData(userID);
			let formData = {
				tier: userData.tier.id
			};

			content.empty();

			// Add nav bar
			let navBar = new common.NavBar({ contents: [
				new common.NavBackButton(),
			]});
			if (this.mode === 'edit') {
				navBar.add(new common.NavCancelButton({
					Behavior: class extends common.ButtonBehavior {
						onTap(content) {
							content.bubble('changeMode', 'view');
						}
					}
				}));
			}
			content.add(navBar);

			// Add save button
			if (this.mode === 'edit') {
				let bottomButtons = new Line({
					bottom: common.normalButtonBottomOffset,
					contents: [
						new common.NormalButton({
							string: 'SAVE',
							Behavior: class extends common.ButtonBehavior {
								onTap(content) {

									// basic form validation, please change later
									let valid = (formData.tier.length > 0);
									if (! valid) {
										application.distribute('notify', 'Please select tier.');
										return;
									}

									let updateSuccess = $.data.updateUser(userID, formData);
									if (updateSuccess) {
										content.bubble('changeMode', 'view');
									} else {
										application.distribute('notify', 'Cannot update user at this time. Please try again later!');
									}
								}
							}
						})
					]
				});
				content.add(bottomButtons);
			}

			// Add main content
			let mainContent = new Column({
				left: common.screenPadding, right: common.screenPadding,
				top: common.navBarHeight + common.screenPadding,
				name: 'main',
				contents: [
					new common.ProfileIcon({
						left: 0, top: 0, bottom: common.screenPadding,
					}),
					new FormRow({ contents: [
						new FormLabel({ string: 'First Name' }),
						new FormValue({ string: common.capitalize(userData.firstName) }),
					]}),
					new FormRow({ contents: [
						new FormLabel({ string: 'Last Name' }),
						new FormValue({ string: common.capitalize(userData.lastName) }),
					]}),
					new FormRow({ contents: [
						new FormLabel({ string: 'Email Address' }),
						new FormValue({ string: userData.email }),
					]}),
				]
			});
			if (this.mode === 'edit') {
				mainContent.add(new FormRow({ contents: [
					new FormLabel({ string: 'Access Tier' }),
					new TierSelect({ data: $.data, formData: formData, name: 'tier' }),
				]}));
			} else {
				mainContent.add(new FormRow({ contents: [
					new FormLabel({ string: 'Access Tier' }),
					new FormValue({ string: userData.tier.name }),
					new FormRightButton({
						string: 'Edit',
						Behavior: class extends common.ButtonBehavior {
							onTap(content) {
								content.bubble('changeMode', 'edit');
							}
						}
					})
				]}));
			}
			content.add(mainContent);
		}
	}
}));

