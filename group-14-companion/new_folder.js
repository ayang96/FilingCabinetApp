import { FormRow, FormLabel, FormValue, FormRightButton, FormField, FormSelect, TierSelect, LabelSelect, FormTextValue } from 'forms';
import * as common from 'common';

/************ EXPORT SCREEN **********************************************/
export var NewFolderScreen = Container.template($ => ({
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
			let formData = {
				name: '',
				label: '', // change later to accomidate multiple
			};
			content.empty();
			content.add(
				new common.NavBar({ contents: [
					new common.NavTitleLeft({ string: 'New Folder' }),
					new common.NavCancelButton({
						Behavior: class extends common.ButtonBehavior {
							onTap(content) {
								application.distribute('dispatch', 'documentsScreen', 'cancelNew');
							}
						}
					})
				]})
			);
			content.add(
				new Line({
					bottom: common.normalButtonBottomOffset,
					contents: [
						new common.NormalButton({
							string: 'CREATE',
							Behavior: class extends common.ButtonBehavior {
								onTap(content) {

									// basic form validation, please change later
									let valid = (formData.name.length > 0);
									if (! valid) {
										application.distribute('notify', 'Please fill out name.');
										return;
									}

									let newData = {
										name: formData.name,
										labels: (formData.label ? [formData.label] : []),
										parent: $.data.state.folder,
									}
									let id = $.data.addFolder(newData);
									if (id) {
										application.distribute('dispatch', 'documentsScreen');
									} else {
										application.distribute('notify', 'Cannot create folder at this time. Please try again later!');
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
						new Picture({
							left: 0, top: 0, bottom: common.screenPadding,
							height: 50, width: 50, aspect: 'fit',
							url:'./assets/icon_folder.png',
						}),
						new FormRow({ contents: [
							new FormLabel({ string: 'Name' }),
							new FormField({ formData: formData, name: 'name', hintString: 'Enter Name' }),
						]}),
						new FormRow({ contents: [
							new FormLabel({ string: 'Tag' }),
							new LabelSelect({ data: $.data, formData: formData, name: 'label' }),
						]}),
					]
				}),
			);
		}
	}
}));