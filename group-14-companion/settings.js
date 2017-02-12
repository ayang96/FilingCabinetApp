import { FormRow, FormLabel, FormValue, FormRightButton, FormField, FormSelect, TierSelect, LabelSelect, FormTextValue } from 'forms';
import * as common from 'common';

/************ EXPORT SCREEN **********************************************/
export var SettingsScreen = Container.template($ => ({
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
					new common.NavTitleLeft({ string: 'Edit Account Details' }),
				]})
			);

			let userData = $.data.getUserData($.data.state.login);
			let formData = {
				firstName: userData.firstName,
				lastName: userData.lastName,
				email: userData.email,
				tier: userData.tier.id,
			}
			content.add(
				new Line({
					bottom: common.normalButtonBottomOffset,
					contents: [
						new common.NormalButton({
							string: 'SAVE',
							Behavior: class extends common.ButtonBehavior {
								onTap(content) {

									// basic form validation, please change later
									let valid = (formData.firstName.length > 0 &&
												formData.lastName.length > 0 &&
												formData.email.length > 0 &&
												formData.tier.length > 0);
									if (! valid) {
										application.distribute('notify', 'Please fill out all fields.');
										return;
									}

									let success = $.data.updateUser(userData.id, formData);
									if (success) {
										application.distribute('update');
										application.distribute('notify', 'Changes saved successfully!');
									} else {
										application.distribute('notify', 'Cannot update data at this time. Please try again later!');
									}
								}
							}
						})
					]
				})
			);
			content.add(
				new Column({
					left: common.screenPadding, right: common.screenPadding,
					top: common.navBarHeight + common.screenPadding,
					name: 'main',
					contents: [
						new common.ProfileIcon({
							left: 0, top: 0, bottom: common.screenPadding,
						}),
						new FormRow({ contents: [
							new FormLabel({ string: 'First Name' }),
							new FormField({ formData: formData, name: 'firstName', hintString: 'Enter First Name' }),
						]}),
						new FormRow({ contents: [
							new FormLabel({ string: 'Last Name' }),
							new FormField({ formData: formData, name: 'lastName', hintString: 'Enter Last Name' }),
						]}),
						new FormRow({ contents: [
							new FormLabel({ string: 'Email Address' }),
							new FormField({ formData: formData, name: 'email', hintString: 'Enter Email Address' }),
						]}),
						new FormRow({ contents: [
							new FormLabel({ string: 'Access Tier' }),
							new TierSelect({ data: $.data, formData: formData, name: 'tier' }),
						]}),
					]
				}),
			);
		}
	}
}));