import * as common from "common";

const menuWidth = 230;

var menuboxSkin= new Skin({fill: ["#666666", "#333333", "#4C4C4C"] });
var menufont = new Style({ font: "15px Roboto Medium", color: "white" })

var selectionbox = Container.template($ =>({//A Button overlayed with a rectangle of the same color, rectangle changes if button is selected 
 name:$.name, top: $.offset,height:35, left: 0, right: 0,
    skin: menuboxSkin,
    contents:[
    	new Container({
        name:"selected",top:3,left:5,right:5,bottom:3,skin:menuboxSkin, active: true,
        contents: [
          $.icon,
          new Label({ top: 0, left: $.left,height:35 ,
                style: menufont, 
                string: $.string }),
        ],
        Behavior: class extends common.ButtonBehavior {
          onTap(content) {
            application.distribute("dispatch", $.screenName);
          }
          updateCategory(content, category) {
            if (category === $.name) {
              content.state = 2;
            } else {
              content.state = 0;
            }
          }
        }
      }),
    ],
}));
var subtitlebox =  Container.template($=>({
       		top:0,height:$.height,left:0,right:0,skin:new Skin({fill: "#595959"}),
       		contents:[
       			new Label({ top: 0, left: 20,height:22 ,
            		style: new Style({ font: "15px Roboto Medium", color: "#cdcbcd" }), 
            		string: $.string })
            ]
}));
var whiteDocIcon = new Picture({height:15,left: 12,url:"assets/icon_document_32x32White.png"});
var whiteCabinetIcon = new Picture({height:15,left: 12,url:"assets/icon_cabinet_32x32White.png"});
var whiteUsersIcon = new Picture({height:20,left: 12,url:"assets/icon_users_32x32White.png"});
var Screen1Template = Column.template($ => ({
    top: 0, bottom: 0, left: 0, width: menuWidth, active: true,
    skin: new Skin({fill: "#595959"}),
    contents: [
        new Container({ top: 0, height: 70, left: 0, right: 0,  skin: menuboxSkin,
			contents:[
			new common.ProfileIcon({ height:50, width: 50, left: 20 }),			
			new Label({ top: 15, left: 100, height:22 ,
            		style: new Style({ font: "16px Roboto Medium", color: "white" }), 
            		Behavior: class extends Behavior {
                  update(content) {
                    let user = $.data.getUserData($.data.state.login);
                    if (user) {
                      content.string = user.fullName;
                    }
                  }
                }
                }),
            new Label({ top: 35, left: 100, height:22 ,
            		style: new Style({ font: "13px Roboto Medium", color: "#cdcbcd" }), 
                Behavior: class extends Behavior {
                  update(content) {
                    let user = $.data.getUserData($.data.state.login);
                    if (user) {
                      content.string = "Access Tier    " + user.tier.name;
                    }
                  }
                }
            }),
        ] }),
       new subtitlebox({height:22,string: "Tabs"}),
       new selectionbox({offset:1,icon:whiteDocIcon,left:45,name: "documents", string: "Items Explorer", screenName: "documentsScreen",color:menuboxSkin}),
       new selectionbox({offset:1,icon:whiteUsersIcon,left:45,name:"users",string: "Users", screenName: "usersScreen",color:menuboxSkin}),
       new selectionbox({offset:1,icon:whiteCabinetIcon,left:45,name:"cabinets",string: "Locker Manager", screenName: "cabinetsScreen", color:menuboxSkin}),
	     new subtitlebox({height:22,string: "Other"}),
       new selectionbox({offset:1,left:20,name:"settings",string: "Account Settings", screenName: "settingsScreen", color:menuboxSkin}),
       new selectionbox({offset:1,left:20,name:"help",string: "Help", screenName: "helpScreen", color:menuboxSkin}),
       new selectionbox({offset:1,left:20,name:"logout",string: "Log Out", screenName: "loginScreen", color:menuboxSkin}),
       new Container({top:1,height:200,left:0,right:0,skin:menuboxSkin})
            
    ],
    Behavior: class extends Behavior {
      onDisplaying(content) {
        content.distribute('update');
      }
    }
}));

export var Menu = Screen1Template;

//var currentScreen = new Screen1Template();
//application.add(currentScreen);
