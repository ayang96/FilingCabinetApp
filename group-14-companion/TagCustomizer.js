import * as common from "common";

export var TagCustomizerScreen = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0,
	Behavior: class extends Behavior {
		onCreate(content, $) {
			this.data = $.data;
		}
		onDisplaying(content) {
			this.render(content);
		}
		render(content) {
			content.empty();
			content.add(new common.NavBar({ contents: [
				common.NavTitleLeft({ string: 'Create Tag' }),
				common.NavCancelButton({
					Behavior: class extends common.ButtonBehavior {
						onTap(content) {
							application.distribute('dispatch', 'newDocumentScreen', 'cancelNew');
						}
					}
				})
			]}));
			colorSelected = "0";
			letterSelected = "0";
			saveChanged = "0";

			content.add(new tagChooser({ data: this.data, color: '', letter: '' }));
		}
	}
}));

var colorSelected = "0";
var letterSelected = "0";
var saveChanged = "0";

var colorContainer = Container.template($=>({
	name:$.name,top:0,height:40,left:6,right:6,bottom:0,skin:$.colorskin,active:true,
	behavior: Behavior({
        checkIfIAmSelected: function(container, colorname) {	
			if(container.name!==colorname){
			trace(container.colorskin+"\n");			
					    container.skin= $.colorskin;
			} 
        },
        onTouchBegan: function(container) {
			container.skin= new Skin({
					    fill: $.color,
					    borders: {left:3, right: 3, top: 3, bottom: 3}, 
					    stroke: "#595959"});
			colorSelected="1";//letting system know that a color has been selected
			if(colorSelected ==="1" && letterSelected==="1"){//checking if letter has been selected and if so allow user to save
				if(saveChanged!=="1"){
					container.container.container.container.container.buttonLine.SAVE.skin = common.buttonSkin;
					saveChanged="1";
				}
			}
			container.container.container.delegate("updateSelected", container.name);
			container.container.container.container.container.previewTag.skin=new Skin({
					    fill: $.color,});
        }
    })
 }));
 
 var letterContainer = Container.template($=>({
	name:$.name,top:0,height:40,left:5,right:5,bottom:0,skin:new Skin({name:"Skin",
					    fill: "#cccccc"}),active:true,
	contents:[
		new Label({ top: 0, left: 0,right:0,height:40 ,
            		style: new Style({ font: "20px Roboto Medium", color: "white" }), 
            		string: $.name })
	],
	behavior: Behavior({
        checkIfIAmSelected(container, lettername) {
            if(container.name!==lettername){
            	container.skin=new Skin({
					    fill: "#cccccc"});
            }
        },
        onTouchBegan(container) {
        	container.skin= new Skin({name:"Skin",
					    fill: "#cccccc",
					    borders: {left: 3, right: 3, top: 3, bottom: 3}, 
					    stroke: "#595959"});
			letterSelected="1";//letting system know that a letter has been selected
			if(colorSelected ==="1" && letterSelected==="1"){//if color has also been selected, allow user to save
				if(saveChanged!=="1"){
					container.container.container.container.container.buttonLine.SAVE.skin = common.buttonSkin;
					saveChanged="1";
				}
			}
			
			container.container.container.delegate("updateSelected", container.name);
			container.container.container.container.container.previewTag.char.string=container.name;
			container.container.container.delegate("updateSave", "letter");
        }
    })
 }));
 
var previewTag = Container.template($ => ({
	name:"previewTag",top:5,height:50, width: 40, skin:new Skin({fill:"#cccccc"}),
	contents:[
		new Picture({
			left: 0, right: 0, top: 0, bottom: 0, aspect: 'stretch',
			url:"assets/single_tag_cutout_lineless.png"
		}),
		new Label({ name:"char",top: 0, left: 0,right:0,bottom: 0 ,
            		style: new Style({ font: "22px Roboto Medium", color: "white" }), 
            		string: "?" })
	]
}));

var tagChooser = Container.template($=>({
       		top:0,bottom:0,left:0,right:0,skin:new Skin({fill:  "white"}),
       		contents:[
            	new previewTag(),
       			/*new Label({ top: 0, left: 189,height:20 ,
            		style: new Style({ font: "15px Roboto Medium", color: "#595959" }), 
            		string: "Tag Preview" }),*/
            	new Container({top:75,height:1,left:10,right:10,skin: new Skin({fill:"#595959"})}),
            	new Container({top:85,left:0,right:0,active:true,//Super Container to manage colors and letters
            		contents:[
		            	new Container({top:0,left:0,right:0,active:true,//COLOR CONTAINER to manage colors
		              		contents:[
				            	new Line({top:0,height:40,left:0,right:0,
				            		contents:[
				            			new colorContainer({name:"red",colorskin:common.redSkin,color:common.red}),
				            			new colorContainer({name:"orange",colorskin:common.orangeSkin,color:common.orange}),
				            			new colorContainer({name:"yellow",colorskin:common.yellowSkin,color:common.yellow}),
				            			new colorContainer({name:"green",colorskin:common.greenSkin,color:common.green}),
				            			new colorContainer({name:"sky",colorskin:common.skySkin,color:common.sky}),
				            			new colorContainer({name:"blue",colorskin:common.blueSkin,color:common.blue}),
				            			new colorContainer({name:"purple",colorskin:common.purpleSkin,color:common.purple})
				            		]
				            	})
				            ],	
			            	behavior: Behavior({
			            		updateSelected: function(content,colorname) {
			            			$.color = colorname;
					            	content.distribute("checkIfIAmSelected", colorname);
		       				  	}
		       			 	})
		               }),
		               new Container({top:50,height:1,left:80,right:80,skin: new Skin({fill:"#595959"})}),
		               new Container({top:60,left:0,right:0,active:true,//ALPHABET CONTAINER to manage alphabets
		              		contents:[
					               new Line({top:0,height:40,left:0,right:0,
					            		contents:[
					            			new letterContainer({name:"A"}),
					            			new letterContainer({name:"B"}),
					            			new letterContainer({name:"C"}),
					            			new letterContainer({name:"D"}),
					            			new letterContainer({name:"E"}),
					            			new letterContainer({name:"F"}),
					            			new letterContainer({name:"G"}),
					            		]
					               }),
					               new Line({top:50,height:40,left:0,right:0,
					            		contents:[
					            			new letterContainer({name:"H"}),
					            			new letterContainer({name:"I"}),
					            			new letterContainer({name:"J"}),
					            			new letterContainer({name:"K"}),
					            			new letterContainer({name:"L"}),
					            			new letterContainer({name:"M"}),
					            			new letterContainer({name:"N"}),
					            		]
					               }),
					               new Line({top:100,height:40,left:0,right:0,
					            		contents:[
					            			new letterContainer({name:"O"}),
					            			new letterContainer({name:"P"}),
					            			new letterContainer({name:"Q"}),
					            			new letterContainer({name:"R"}),
					            			new letterContainer({name:"S"}),
					            			new letterContainer({name:"T"}),
					            			new letterContainer({name:"U"}),
					            		]
					               }),
					               new Line({top:150,height:40,left:0,right:88,
					            		contents:[
					            			new letterContainer({name:"V"}),
					            			new letterContainer({name:"W"}),
					            			new letterContainer({name:"X"}),
					            			new letterContainer({name:"Y"}),
					            			new letterContainer({name:"Z"}),
					            		]
					               })
				              ],
				              behavior: Behavior({
							      updateSelected: function(content,colorname) {
							            //this.count = this.startCount = Number(container.first.string);
							            $.letter = colorname;
							            content.distribute("checkIfIAmSelected", colorname);
							           // container.duration = this.startCount*1000;
			       				  }
		       				  })
				       }),
					]
				}),
               	new Line({name:"buttonLine",top:355,contents: [
               		new common.NormalButton({
               			name: 'SAVE',
					   string: "CREATE",
					   Behavior: class extends common.ButtonBehavior {
					   	  onCreate(content){
					   	  	//content.active=true;
					   	  	content.skin=common.greySkin;
					   	  }
					      onTap(content) {

					      	if (saveChanged === "1") {
								$.data.addLabel({
									name: $.letter,
									color: $.color,
								});
								application.distribute('dispatch', 'newDocumentScreen', 'pushRight');
					      	}

					         
					      }
					   }
					})
               	]})
        ],
}));
//application.add(new colorContainer({skin:common.redSkin}));