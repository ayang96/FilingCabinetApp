
/*========================*/
/*Exports*/
/*========================*/

export var FileHistoryTemplate = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: whiteSkin,
	contents: [],
	screenData: $.screenData,
	Behavior: screenBehavior,
}));

/*========================*/
/*Imports*/
/*========================*/

import * as common from "common";
import { VerticalScroller, VerticalScrollbar } from "src/scroller";
import { FormRow, FormLabel, FormValue, FormRightButton, FormField, FormSelect, TierSelect, LabelSelect, FormTextValue } from 'forms';

/*========================*/
/*Skins and Styles*/
/*========================*/

let whiteSkin = new Skin ({fill: 'white'});
let blackSkin = new Skin ({fill: 'black'});
let blue = '#2F80ED';
let blueSkin = new Skin ({fill: blue});
let boraderSkin = new Skin ({fill: 'white', stroke:'black', left: 1, right: 1, top: 1, bottom: 1});

let textStyle = common.bodyStyle;
let buttonStyle = common.buttonStyleWhite;
let WbuttonStyle = common.buttonStyleBlue;


var documentHistoryItemSkin = new Skin({
	stroke: common.systemLineColor,
	borders: {bottom: 1},
});

var documentHistoryListSkin = new Skin({
	stroke: common.systemLineColor,
	borders: { left: 1, right: 1, top: 1, bottom: 1 }
});

var screenSkin = new Skin({ fill: "white" });

/*========================*/
/*Buttons*/
/*========================*/


/*==================*/
/*Scetions*/
/*========================*/

let LabelTemp = Column.template($ =>({
	height: 40, width: 320, skin: whiteSkin,
	contents: [
		Line($, {height: 39, contents:[$[0], $[1]]}),
	]
}));

let LeftTitle = Label.template($ =>({
	height: 39, width: 80, left: 30, skin: whiteSkin, string: $, style: textStyle,
}));

let RightTitle = Label.template($ =>({
	height: 39, width: 220, left: 20, horizontal:'left', skin: whiteSkin, string: $, style: textStyle,
}));

var DocumentHistoryList = Container.template(($={}) => Object.assign({
	clip: true,
	contents: [
		VerticalScroller($, {
			left: 0, right: 0, top: 0, bottom: 0, active: true,
			contents: [
				new Column({ left: 0, right: 0, top: 0 }),
				VerticalScrollbar(),
			]
		})
	],
	Behavior: class extends Behavior {
		onDisplayed(content) {
			this.update(content);
		}
		update(content) {
			let column = content.first.first;
			column.empty();
			for (let event of $.documentData.history.slice().reverse()) {
				let userData = event.user;
				column.add(new DocumentHistoryItem({ eventData: event, userData: userData, data: $.data }));
			}
		}
	}
}, $));

var DocumentHistoryItem = Container.template($ => ({
	left: 0, right: 0, top: 0, height: 60, skin: documentHistoryItemSkin,
	contents: [
		new Label({
			left: 10, top: 10, style: common.smallLightStyle,
			string: common.formatDate($.eventData.date),
		}),
		new Container({
			left: 15, bottom: 15, width: 10, height: 10,
			//skin: new Skin({ fill: common[$.userData.avatarColor] }), //Not Sure about Color
			skin: new Skin({ fill: $.userData.tier.color }),
		}),
		new Label({
			left: 30, bottom: 10, style: common.bodyBoldStyle,
			string: $.userData.fullName,
		}),
		new Label({
			right: 10, bottom: 10, style: common.smallLightStyle,
			string: "Item " + $.eventData.action,
		}),
	]
}));


/*========================*/
/*Behavior*/
/*========================*/
class screenBehavior extends Behavior {
	onCreate(screen, data) {
		this.db = data.data;
	}
	onDisplaying(screen) {
		this.render(screen);
	}
	update(screen) {
		this.render(screen);
	}
	render(screen) {
		let docID = this.db.state.document;
		let docData = this.db.getDocumentData(docID);
		this._render(screen, docData);
	}

	_render(screen, data) {
		screen.empty();
		this.data = data;
		this.docName = data.name;
		this.InOut = data.out;
		var iconPIC;

		let findingDoc = data;

		let FileScreen = new Column({
			top: 0, left: 0, right: 0, bottom: 0,
			contents:[]
		});

		let Des = new LabelTemp([new LeftTitle('History'), 
												new RightTitle('')]);

		if (this.InOut == "other"){
			iconPIC = new Picture({height: 50, width: 50, align:'middle', url:'./assets/icon_document_out_other_ring_70x70.png'});
		} else if (this.InOut == "you"){
			trace(JSON.stringify("TRUE") + '\n');
			iconPIC = new Picture({height: 50, width: 50, align:'middle', url:'./assets/icon_document_out_you_ring_70x70.png'});
		} else {
			iconPIC = new Picture({height: 50, width: 50, align:'middle', url:'./assets/icon_document_in_ring_70x70_2.png'});
		}


		let DocTop = new Line({
			left: 0, right: 0, top: 0,
			contents:[
				iconPIC,
				new FormRow({
					left: 20, right: 0,
					contents: [
						new FormValue({ string: findingDoc.name })
					]
				})
			]
		});

		let His = new DocumentHistoryList({
			left: 0, right: 0, top: common.screenPadding, bottom: 0, skin: documentHistoryListSkin,
			//documentData: this.docData.documents[this.docName], data: this.docData,
			documentData: findingDoc, data: this.db,
		});

		let FileContent = new Column({
			left: 0, right: 0, top: 0, bottom: 0,
		});

		let padding = new Container({
			left: common.screenPadding, right: common.screenPadding,
			top: common.screenPadding, bottom: common.screenPadding,
		});

		screen.add(FileScreen);
		FileScreen.add(new common.NavBar({contents: [new common.NavBackButton(),]}));
		FileScreen.add(padding);
		padding.add(FileContent);
		FileContent.add(DocTop)
		FileContent.add(His)

	}
};

