/*
* 	Documents Screen 
*	For viewing documents filesystem
*	Simulate on iap140: 640x960 / 2 (iPhone 4)
*   Sections Organization:
* 	1) Export Screen- this screen as a container template
*	2) Imports
*	3) Assets- format standard sizes, colors, images, text fonts
*	4) Behaviors
*	5) Templates
*/

/************ 1) EXPORT SCREEN **********************************************/
export var DocumentsScreen = Container.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	skin: lineSkin,
	contents: [],
	Behavior: screenBehavior
}));


/************ 2) IMPORTS *****************************************************/
import * as common from "common";
import * as model from "model";
import { FormSelect } from 'forms';

import {
    VerticalScroller,
    VerticalScrollbar,
    TopScrollerShadow,
    BottomScrollerShadow
} from 'src/scroller';

/************ 3) ASSETS ******************************************************/

// Format standards. Edit here if necessary
const screenWidth = 320;		// width of screen / 2
const screenHeight = 480;		// height of screen / 2
const labelWidth = 25;			// width of a label tag
const labelHeight = 30;			// height of a label tag
const docIconSize = 30;			// width and height of a document and folder icon
const lineHeight = 50;			// height of a document listing
const sideMargin = 15;			// left and right margin of a document listing
const spacing = 10;				// spacing left and right of items
const docNameWidth = 150;		// width of a doc name listing before cutoff
const headingTextHeight = 16;	// height of a heading bold text
const subTextHeight = 14;		// height of a standard sub text
const directoryHeight = 24;		// height of a directory text
const directoryWidth = 275;		// width of a directory before cutoff
let	  levelWidth = undefined;	// will change to truncLevelWidth if truncating
const truncLevelWidth = 18;		// will shrink previous levels to this width
const truncChars = 36;			// minimum # of chars threshold to start truncating
const truncLevels = 4;			// show only this # of levels at a time




// Solid Fill Skins
let redSkin = new Skin({ fill:'#EB5757' }); 		// = "red"
let orangeSkin = new Skin({ fill:'#F2994A' }); 		// = "orange"
let yellowSkin = new Skin({ fill: '#F2C94C' }); 	// = "yellow"
let greenSkin = new Skin({ fill: '#219653' }); 		// = "green"
let skySkin = new Skin({ fill: '#56CCF2' });		// = "sky"
let blueSkin = new Skin({ fill: '#2F80ED' });		// = "blue"
let purpleSkin = new Skin({ fill: '#9B51E0'});		// = "purple"
let greySkin = new Skin({ fill: '#828282'});		// = "grey"

let lineSkin = new Skin({							//stroked skin of a document listing
		fill: ['white', common.offWhite],
		stroke: common.systemLineColor,
		borders: {left: 0, right: 0, top: 0, bottom: 1}
});	

let addDocumentFolderSkin = new Skin({
	width: 90, height: 90, aspect: 'fit',
	texture: new Texture('assets/icon_add_folder_document_45x45.png'),
	states: 90, variants: 90,
});
		
// Source Images
let docInIcon = Picture.template($ => ({			// icon for a in document
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: docIconSize, height: docIconSize,
	url: 'assets/icon_document.png',
	aspect: 'fit'
}));

let docOutOtherIcon = Picture.template($ => ({		// icon for document out by other
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: docIconSize, height: docIconSize,
	url: 'assets/icon_document_out_other.png',
	aspect: 'fit'
}));

let docOutYouIcon = Picture.template($ => ({		// icon for document out by you
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: docIconSize, height: docIconSize,
	url: 'assets/icon_document_out_you.png',
	aspect: 'fit'
}));

let emptyTagIcon = Picture.template($ => ({			// icon for an empty label slot
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: labelWidth, height: labelHeight,
	url: 'assets/icon_empty_tag_label_flat_25x30px.png',
	aspect: 'stretch'
}));

let folderIcon = Picture.template($ => ({		// icon for folder
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: docIconSize, height: docIconSize,
	url: 'assets/icon_folder.png',
	aspect: 'fit'
}));

let tagWhiteout4 = Picture.template($ => ({		// hardcoded white cutouts over 4 tags
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: screenWidth, height: lineHeight,
	url: 'assets/listing_line_tags_white_cutouts.png',
	aspect: 'fit'
}));

let tagWhiteout3 = Picture.template($ => ({		// hardcoded white cutouts over 3 tags
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: screenWidth, height: lineHeight,
	url: 'assets/listing_line_tags_white_cutouts_3.png',
	aspect: 'fit'
}));

let tagWhiteout2 = Picture.template($ => ({		// hardcoded white cutouts over 2 tags
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: screenWidth, height: lineHeight,
	url: 'assets/listing_line_tags_white_cutouts_2.png',
	aspect: 'fit'
}));

let tagWhiteout1 = Picture.template($ => ({		// hardcoded white cutouts over 1 tags
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: screenWidth, height: lineHeight,
	url: 'assets/listing_line_tags_white_cutouts_1.png',
	aspect: 'fit'
}));

let tagWhiteout0 = Picture.template($ => ({		// hardcoded white cutouts over 0 tags
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	width: screenWidth, height: lineHeight,
	url: 'assets/listing_line_tags_white_cutouts_0.png',
	aspect: 'fit'
}));

// Text Labels
// For clickable text
let clickableStyle = common.bodyLinkStyle;
//new Style({font: "16px Roboto Regular", color: "#2F80ED", horizontal: "left"});

// For nonclickable text
let nonClickableStyle = common.smallStyle;
//new Style({font: "16px Roboto Regular", color: "black", horizontal: "left"});

let tagLabel = Label.template($ => ({				// for a label tag
	width: labelWidth, height: labelHeight,
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	style: new Style({font: "16px Roboto", color: "white", horizontal: "center"}),
	string: $.string
}));

let docNameLabel = Label.template($ => ({			// for a document's name
	height: headingTextHeight, width: docNameWidth,
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	style: new Style({font: "16px Roboto Medium", color: $.color, horizontal: "left"}),
	string: $.string
}));

let docTierLabel = Label.template($ => ({			// for a document's tier
	height: headingTextHeight, width: docNameWidth,
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	style: new Style({font: "12px Roboto Medium", color: $.color, horizontal: "left"}),
	string: $.string
}));

let docDateLabel = Label.template($ => ({			// for a document's tier
	height: headingTextHeight,
	left: $.left, right: $.right, top: $.top, bottom: $.bottom,
	style: common.smallLightStyle,
	string: $.string
}));

/************* 4) BEHAVIORS ****************************************************/

let applicationData = null;

// Main screen behavior
class screenBehavior extends Behavior{
	onCreate(screen, data) {
		// Extract given data
		this.data = data;
		applicationData = this.data;
		screen.distribute("render");
	}
	onDisplaying(screen) {
		this.render(screen);
	}
	update(screen) {
		this.render(screen);
	}
	render(screen) {
		screen.empty()
		this.currFolderID = this.data.state.folder;
		this.currFolder = this.data.getFolderData(this.currFolderID);
		this.directory = this.data.getPath(this.currFolderID); //data.directory;
		
		//this.documents = this.data.documents; // Pull from all documents ver
		this.documents = this.currFolder.documents;
		//this.documents = this.data.getDocumentListData(Object.keys(this.currFolder)); //Pull from current children ver
		
		//this.folders = this.data.folders; // Pull from all folders ver
		this.folders = this.currFolder.folders; // Pull from current children ver
		
		//trace('This.currFolderID ' + this.currFolderID + '\n');
		//trace('This.currFolder ' + this.currFolder + '\n');
		//trace('This.currFolder keys ' + Object.keys(this.currFolder) + '\n'); 
		//trace('This.directory ' + this.directory + '\n');
		//trace('This.documents ' + this.documents + '\n');
		//trace('This.folders ' + this.folders + '\n');
		
		// Add nav bar
		let navBar = new common.NavBar({ contents: [
			new common.NavMenuButton(),
			new common.NavSearch({
				hintString: 'Search Items',
				string: (this.data.state.folder === 'search' ? this.data.state.documentsSearch : ''),
				Behavior: class extends Behavior {
					onSearch(content, searchString) {
						applicationData.setState({ documentsSearch: searchString });
						if (searchString) {
							applicationData.search(searchString);
							applicationData.setState({ folder: 'search' });
						} else {
							applicationData.setState({ folder: 'root' });
						}
						application.distribute('update');
					}
				}
			}),
			new common.NavSelectButton({
				Behavior: class extends common.ButtonBehavior {
					onTap(content) {
						application.distribute('notify', 'Implementation coming soon!');
					}
				}
			})
		]});

		// Add directory bar line
		let directoryHeading = new DirectoryLine(this.directory);
		
		// Add scroller 
		let contentToScrollVertically = new Column({
			top: 0, left: 0, right: 0, 
			contents: []});
			// Add folders
			let foldersList = Object.keys(this.folders);
			//trace('foldersList length ' + foldersList.length + '\n');
			for (let i = 0; i < foldersList.length; i++) {
				let addingFolder = this.folders[i]; // Pulling curr directory ver
				//trace("addingFolder keys " + Object.keys(addingFolder) + '\n');
				let addingFolderID = addingFolder.id; // Pulling curr directory ver
				//let addingFolderID = foldersList[i]; // Pulling whole table ver
				//let addingFolder = this.data.getFolderData(addingFolderID); // Pulling whole table ver
				let addingFolderName = addingFolder.name;
				let addingFolderTiers = addingFolder.tiers;
				let addingFolderLabels = addingFolder.labels;
				//trace("addingFolderstats " + addingFolderName + addingFolderTiers + addingFolderLabels + addingFolderID + '\n');
				
				contentToScrollVertically.add(new FolderLine(
						{name: addingFolderName,
						tier: addingFolderTiers,
						labels: addingFolderLabels,
						id: addingFolderID
						}
						//{name: data.folders[i].name,
						//tier: data.folders[i].tier,
						//labels: data.folders[i].labels}
				));
			}
			
			// Add documents
			let docList = Object.keys(this.documents);
			for (let i = 0; i < docList.length; i++) {
				//let addingDocID = docList[i]; // Pulling whole table ver
				//let addingDoc = this.data.getDocumentData(addingDocID); // Pulling whole table ver
				let addingDoc = this.documents[i]; // Pulling curr directory ver
				let addingDocID = addingDoc.id; // Pulling curr directory ver
				let addingDocName = addingDoc.name;
				let addingDocTier = addingDoc.tier; //addingDoc.tier;
				let addingDocLabels = addingDoc.labels;
				let addingDocOut = addingDoc.out; //addingDoc.out;
				//trace("addingDoc keys " + Object.keys(addingDoc) + '\n');
				
				contentToScrollVertically.add(new DocumentLine(
					addingDoc
						// {name: addingDocName,
						// tier: addingDocTier,
						// labels: addingDocLabels,
						// out: addingDocOut,
						// id: addingDocID
						// }
						//{name: data.documents[i].name,
						//tier: data.documents[i].tier,
						//labels: data.documents[i].labels,
						//out: data.documents[i].out}
				));
			}
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
												string: 'New Folder'
											}),
											new Container({
												right: 20, width: 45, height: 45, active: true,
												skin: addDocumentFolderSkin, variant: 0, state: 0,
												Behavior: class extends common.ButtonBehavior {
													onTap(content) {
														content.bubble('exit');
														application.distribute('dispatch', 'newFolderScreen', 'new');
													}
												}
											}),
											new Container({
												left: 20, width: 45, height: 45, active: true,
												skin: addDocumentFolderSkin, variant: 1, state: 0,
												Behavior: class extends common.ButtonBehavior {
													onTap(content) {
														content.bubble('exit');
														application.distribute('dispatch', 'newDocumentScreen', 'new');
													}
												}
											}),
											new Label({
												left: 10, right: 0, style: common.smallWhiteStyle,
												string: 'Store New Item'
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
			top: common.navBarHeight + directoryHeight, left: 0, right: 0, bottom: 0,
			contents: [
				mainScroller
			]
		});
		screen.add(screenColumn);
		screen.add(new Column({
			top: 0, left: 0, right: 0,
			contents: [
				navBar,
				directoryHeading,
			]
		}));
		screen.add(plusButton);
	}
};

// Auto-generates skin and text of a label or tag icon
class labelBehavior extends Behavior {
	onCreate(label, data) {
		// Extract given data
		this.text = data.text; 
		this.color = data.color;
		
		// Add initial to label
		label.add(new tagLabel({string: this.text}));
		//label.add(new tagLabel({string: this.text.slice(0, 1).toUpperCase()}));
		
		// Color label
		let foundColor = false;
		switch (this.color) {
			case 'red':
				label.skin = redSkin;
				foundColor = true;
				break;
			case 'orange':
				label.skin = orangeSkin;
				foundColor = true;
				break;
			case 'yellow':
				label.skin = yellowSkin;
				foundColor = true;
				break;
			case 'green':
				label.skin = greenSkin;
				foundColor = true;
				break;
			case 'sky':
				label.skin = skySkin;
				foundColor = true;
				break;
			case 'blue':
				label.skin = blueSkin;
				foundColor = true;
				break;
			case 'purple':
				label.skin = purpleSkin;
				foundColor = true;
				break;
			case 'grey':
				label.skin = greySkin;
				foundColor = true;
				break;
		} 
		if (!foundColor) { // assume grey
			label.skin = greySkin;
		}
	}
};

// Auto-generates icon, name, label, and tier of a document
class documentBehavior extends common.ButtonBehavior {
	onCreate(document, data) {
		// Extract given data
		this.name = data.name;
		this.tierName = data.tier.name; //data.tier;
		this.labels = data.labels; 
		this.out = data.out;
		this.id = data.id;
		//trace("DocStats " + Object.keys(data) + '\n');
		//trace("DocumentStats " + this.name + this.tierName + this.labels + this.out + this.id + '\n');

		// Creation of Line
		let docLine = new Line({top: 0, bottom: 0, left: 0, right: 0, contents: []});
		
		// Add document icon
		let validOut = false;
		switch (this.out) {
			case 'in':
				docLine.add(new docInIcon({left: sideMargin}));
				validOut = true;
				break;
			case 'other':
				docLine.add(new docOutOtherIcon({left: sideMargin}));
				validOut = true;
				break;
			case 'you':
				docLine.add(new docOutYouIcon({left: sideMargin}));
				validOut = true;
				break;
		}
		if (!validOut) docLine.add(new docOutOtherIcon({left: sideMargin})); // Assume other
		
		let docBottomLine = new Line({ left: 0, width: 100});
		docBottomLine.add(new docTierLabel({string: this.tierName, color: ((this.out === 'in') ? "black" : "gray"), left: 0, right: 0}))
		if (applicationData.state.documentsSort === "dateCreated") {
			let dateString = common.formatDate(data.history[0].date);
			docBottomLine.add(new docDateLabel({ string: dateString }));
		} else if (applicationData.state.documentsSort === "dateLastAccessed") {
			let dateString = common.formatDate(data.history[data.history.length - 1].date);
			docBottomLine.add(new docDateLabel({ string: dateString }));
		}

		// Add document name and tier
		docLine.add(new Column({
			width: docNameWidth, left: spacing,
			contents: [
				new docNameLabel({string: this.name, color: ((this.out === 'in') ? "black" : "gray")}),
				docBottomLine,
			]
		}));
				
		// Add document labels
		let tagLine = new Line({
			right: sideMargin, top: 0, bottom: 0
		});

		for (let i = 0; i < Math.min(4, this.labels.length); i++) {
			let label = this.labels[i]; //this.labels[i];
			let addingLabelText = label.abbreviation;
			let addingLabelColor = label.color;
			//let addingLabelText = this.labels[i][0];
			//let addingLabelColor = this.labels[i][1];
			tagLine.add(new common.Tag({
				left: 2, top: 0, width: 25, height: 35,
				string: addingLabelText, color: addingLabelColor,
			}));
		}
		
		document.add(docLine);
		document.add(tagLine);

	}
	onTap(document) {
		applicationData.setState({document: this.id});
		application.distribute("dispatch", "documentInfoScreen", "push");
	}
};

class folderBehavior extends common.ButtonBehavior {
	onCreate(folder, data) {
		// Extract given data
		this.name = data.name;
		this.tier = data.tier;
		this.labels = data.labels; 
		this.id = data.id;
		//trace("DocStats " + Object.keys(data) + '\n');
		//trace("DocumentStats " + this.name + this.tier + this.labels + this.id + '\n');

		
		// Creation of line
		let folderLine = new Line({top: 0, bottom: 0, left: 0, right: 0, contents: []});
		
		// Add folder icon
		folderLine.add(new folderIcon({left: sideMargin}));
		
		// Add folder name 
		let folderName = new Column({
			width: docNameWidth, left: spacing,
			contents: [
				new docNameLabel({string: this.name, color: "black"}),
			]
		});
		
		// Add folder tiers
		let tierString = "";
		for (let i = 0; i < this.tier.length; i++) {
			if (i == 0) {
				tierString = this.tier[i].name; //this.tier[i];
			} else {
				tierString += ", ";
				tierString += this.tier[i].name; //this.tier[i];
			}
		}
		folderName.add(new docTierLabel({string: tierString, color: "black"}));
		folderLine.add(folderName);
		
		// Add folder labels
		let tagLine = new Line({
			right: sideMargin, top: 0, bottom: 0
		});

		for (let i = 0; i < Math.min(4, this.labels.length); i++) {
			let label = this.labels[i]; //this.labels[i];
			let addingLabelText = label.abbreviation;
			let addingLabelColor = label.color;
			//let addingLabelText = this.labels[i][0];
			//let addingLabelColor = this.labels[i][1];
			tagLine.add(new common.Tag({
				left: 2, top: 0, width: 25, height: 35,
				string: addingLabelText, color: addingLabelColor,
			}));
		}

		folder.add(folderLine);
		folder.add(tagLine)
	
	}
	onTap(folder) {
		applicationData.setState({folder: this.id});
		application.distribute("dispatch", "documentsScreen", "pushLeft"); // Going to child level
		application.distribute("render");
	}
};

class directoryLevelBehavior extends common.ButtonBehavior {
	onCreate(level, data) {
		this.folder = data.string.split("\\")[0];
		level.string = this.folder;
		//trace("DirectoryID " + Object.keys(data) + '\n');
		this.folderID = data.id.id;
		//trace("DirectoryStats " + level.string + this.folderID + '\n');
		//trace("dirID " + this.folderID + '\n'); 
		
		level.style = clickableStyle;
		this.clickable = data.clickable;
		if (!data.clickable) { level.style = nonClickableStyle; }
	}
	onTap(level) {
		applicationData.setState({folder: this.folderID});
		application.distribute("update");
	}
};

class directoryLineBehavior extends Behavior {
	onCreate(line, data) {
		// Extract given data
		this.name = data.string;
		this.ids = data.folderDataList;
		this.levels = data.string.split("\\");

		
		// Truncate width of level text based on # of chars, 
		// show only truncLevels levels at a time
		let hierarchy = new Line({left: 0, width: directoryWidth, height: line.height, top: 0, bottom: 0, contents: []});
		hierarchy.add(new Container({width: sideMargin, top: 0, bottom: 0, left: 0}));
		let levelStart = 0;
		if (this.name.length >= truncChars) { 
			levelWidth = truncLevelWidth;
			if (this.levels.length >= truncLevels) {
				levelStart = this.levels.length - truncLevels;
				hierarchy.add(new Label({style: nonClickableStyle, string: '\\ ', left: 0}));
			}
		}
		
		
		// Add directory listing
		let currLevelIndex = 0;
		for (; levelStart < this.levels.length - 2; levelStart++) {
			if (this.levels[levelStart]) {
				hierarchy.add(new directoryLabel({showFull: false, 
						clickable: true, string: this.levels[levelStart], 
						id: this.ids[currLevelIndex]}));
				currLevelIndex++;
				hierarchy.add(new Label({style: nonClickableStyle, string: '\\ ', left: 0}));
			}
		}
		levelWidth = undefined;
		for (let i = this.levels.length - 2; i < this.levels.length; i++) {
			if (this.levels[i]) {
				let click = true;
				if (i == this.levels.length-1) { click = false; }
				hierarchy.add(new directoryLabel({showFull: true, 
							clickable: click, string: this.levels[i],
							id: this.ids[currLevelIndex] }));
				currLevelIndex++;
				hierarchy.add(new Label({style: nonClickableStyle, string: '\\ ', left: 0}));
			}
		}
		let levelsParsedCorrectly = (currLevelIndex == Object.keys(this.ids).length);
		
		line.add(hierarchy);
		
		// Add Sort function 
		line.add(new sortButton());
	}
};



/**************** 5) TEMPLATES *******************************************/
// For each directory level in the top bar
// When instantiating, call new directoryLabel({showFull: disallow truncation, 
//								clickable: link style or not, string: text here})
let directoryLabel = Label.template($ => ({	
	left: 0, width: levelWidth,
	style: clickableStyle,
	active: true,
	Behavior: directoryLevelBehavior
}));

// Sort button on upper right
let sortButton = Container.template($ => ({
	right: sideMargin, width: 130,
	contents: [
		new FormSelect({
			formData: { sort: applicationData.state.documentsSort },
			name: 'sort',
			options: [
				{ value: 'name', string: 'Name', callback: callbackGen('name') },
				{ value: 'dateCreated', string: 'Date Created', callback: callbackGen('dateCreated')},
				{ value: 'dateLastAccessed', string: 'Date Last Accessed', callback: callbackGen('dateLastAccessed')},
				{ value: 'accessTierAsc', string: 'Access Tier Asc', callback: callbackGen('accessTierAsc')},
				{ value: 'accessTierDesc', string: 'Access Tier Desc', callback: callbackGen('accessTierDesc')},
				{ value: 'labels', string: 'Tags', callback: callbackGen('labels')},
			]
		})
	]
}));

function callbackGen(value) {
	return function(content) {
		content.bubble('select', value);
		applicationData.setState({ documentsSort: value });
		application.distribute('update');
	}
}

// Label or tag icon. Define data = {text = label name, color = label color}
// When instantiating, call new LabelTag(data)
let LabelTag = Container.template($ => ({
	width: labelWidth, height: labelHeight, 
	right: $.right, top: $.top, left: $.left, bottom: $.bottom,
	Behavior: labelBehavior,
	contents: []
}));

// Listing for a document. Define data = {name = docName, tier, labels list, 
//									out = 'in', 'other', or 'you'}
// When instantiating, call new DocumentLine(data)
let DocumentLine = Container.template($ => ({
	top: 0, left: 0, right: 0, height: lineHeight,
	active: true,
	skin: lineSkin,
	Behavior: documentBehavior,
	contents: []
}));

// Listing for a folder. Define data = {name = docName, tier list, labels list}
// When instantiating, call new FolderLine(data)
let FolderLine = Container.template($ => ({
	top: 0, left: 0, right: 0, height: lineHeight,
	skin: lineSkin,
	Behavior: folderBehavior,
	active: true,
	contents: []
}));

// Line on top for a directory. Define name = directory
// When instantiating, call DirectoryLine(name)
let DirectoryLine = Container.template($ => ({
	height: directoryHeight,
	top: 0, left: 0, right: 0,
	skin: new Skin({fill:"#e6e6e6", stroke: common.systemLineColor, borders: { bottom: 1 }}),
	Behavior: directoryLineBehavior,
	contents: []
}));



// Scroller template
let MainScroller = Column.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0, clip: true,
    contents: [
      VerticalScroller($, {
      	top: 0, left: 0, right: 0,
      	contents: [ $.contentToScrollVertically,
      		VerticalScrollbar(), TopScrollerShadow(), BottomScrollerShadow(),
      	]
      }),
    ]
}));



