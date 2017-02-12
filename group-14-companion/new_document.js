import { FormRow, FormLabel, FormValue, FormRightButton, FormField, FormSelect, TierSelect, LabelSelect, FormTextValue } from 'forms';
import * as common from 'common';

/************ EXPORT SCREEN **********************************************/
export var NewDocumentScreen = Container.template($ => ({
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
				tier: '',
				description: '',
			};
			content.empty();
			content.add(
				new common.NavBar({ contents: [
					new common.NavTitleLeft({ string: 'Store New Item' }),
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
									let valid = (formData.name.length > 0 &&
												formData.tier.length > 0);
									if (! valid) {
										application.distribute('notify', 'Please fill out name and select a tier.');
										return;
									}

									let newData = {
										name: formData.name,
										labels: (formData.label ? [formData.label] : []),
										tier: formData.tier,
										description: formData.description,
										folder: $.data.state.folder,
									}
									let documentID = $.data.addDocument(newData);
									if (documentID) {
										$.data.setState({ document: documentID });
										application.distribute('update');
										application.distribute('dispatch', 'documentInfoScreen');
									} else {
										application.distribute('notify', 'Cannot create item at this time. Please try again later!');
									}
								}
							}
						})
					]
				})
			);
			
			// Kinoma is the dumbest framework I've ever seen.
			// Who thought it was a good idea to use object order for z index??
			// How am I supposed to add things to a Column
			// or Line with the correct ordering, but having
			// custom z indexes, without doing something
			// as contrived as this?
			
			let pseudoColumn = new Container({
				left: 0, right: 0, top: 0,
			});

			content.add(
				new Column({
					left: common.screenPadding, right: common.screenPadding,
					top: common.navBarHeight + common.screenPadding,
					name: 'main',
					contents: [
						new Picture({
							left: 0, top: 0, bottom: common.screenPadding,
							height: 50, width: 50, aspect: 'fit',
							url:'./assets/icon_document_in_ring_70x70_2.png',
						}),
						pseudoColumn,
					]
				}),
			);

			let forcefully_imposed_height = 40;

			pseudoColumn.add(
				new FormRow({
					top: forcefully_imposed_height * 3,
					contents: [
						new FormLabel({ string: 'Description' }),
						new FormField({ formData: formData, name: 'description', hintString: 'Enter Description' }),
					]
				}),
			);

			pseudoColumn.add(
				new FormRow({
					top: forcefully_imposed_height * 2,
					contents: [
						new FormLabel({ string: 'Access Tier' }),
						new TierSelect({ data: $.data, formData: formData, name: 'tier' }),
					]
				})
			);

			pseudoColumn.add(
				new FormRow({
					top: forcefully_imposed_height * 1,
					contents: [
						new FormLabel({ string: 'Tag' }),
						new LabelSelect({ data: $.data, formData: formData, name: 'label' }),
					]
				})
			);

			pseudoColumn.add(
				new FormRow({
					top: forcefully_imposed_height * 0,
					contents: [
						new FormLabel({ string: 'Name' }),
						new FormField({ formData: formData, name: 'name', hintString: 'Enter Name' }),
					]
				})
			);


		}
	}
}));