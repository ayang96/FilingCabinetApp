/*
*  Documents Screen 
*  For viewing documents filesystem
*  Simulate on iap140: 640x960 / 2 (iPhone 4)
*   Sections Organization:
*  1) Export Screen- this screen as a container template
*  2) Imports
*  3) Assets- format standard sizes, colors, images, text fonts
*  4) Behaviors
*  5) Templates
*/

/*========================*/
/*Exports*/
/*========================*/

export var LogInTemplate = Column.template($ => ({
   left: 0, right: 0, top: 0, bottom: 0, active: true,
   skin: whiteSkin,
   contents: [],
   //screenData: $.screenData,
   Behavior: screenBehavior,
}));

/*========================*/
/*Imports*/
/*========================*/

import * as common from "common";
import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'src/field';

import {
    SystemKeyboard
} from 'src/keyboard';
//import { Data, sampleData } from "model";

/*========================*/
/*Skins and Styles*/
/*========================*/

let whiteSkin = new Skin ({fill: 'white'});
let blackSkin = new Skin ({fill: 'black'});
let blue = '#2F80ED';
let blueSkin = new Skin ({fill: blue});

let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });
let nameInputSkin = new Skin({ borders: { left: 2, right: 2, top: 2, bottom: 2 }, stroke: 'gray' });

var boraderSkin = new Skin({
   stroke: common.grey,
   borders: { left: 1, right: 1, bottom: 1 }
});

let textStyle = common.titleStyle;
let fieldHintStyle = new Style({ font: "18px Roboto", color: '#828282', horizontal: "left" });


/*========================*/
/*Label Template*/
/*========================*/
let LabelTemp = Column.template($ =>({
   top: 10, height: 40, width: 320, skin: whiteSkin, active: true,
   contents: [
      Line($, {height: 39, contents:[$[0], $[1]]}),
      new Container({height:1, width: 200, skin: blackSkin}),
   ]
}));

// let LeftTitle = Label.template($ =>({
//    height: 39, width: 80, left: 55, skin: whiteSkin, string: $, style: textStyle,
// }));

let RightTitle = Label.template($ =>({
   height: 39, width: 220, left: 20, horizontal:'left', skin: whiteSkin, string: $, style: fieldHintStyle,
}));

let Description = Container.template($ => ({
   height: 85, bottom: 10, width: 280, skin: boraderSkin,
   contents:[
      Label($, {string: $, style: new Style({font: '15px', color: 'black',  horizontal:'left', align: 'top'})}),
   ]
}));



/*========================*/
/*Behavior*/
/*========================*/
let MyField = Container.template($ => ({ 
    width: 250, height: 36, skin: nameInputSkin, contents: [
        Scroller($, { 
            left: 4, right: 4, top: 4, bottom: 4, active: true, 
            Behavior: FieldScrollerBehavior, clip: true, 
            contents: [
                Label($, { 
                    left: 0, top: 0, bottom: 0, skin: fieldLabelSkin, 
                    style: textStyle, anchor: 'NAME',
                    editable: true, string: $.name,
                    Behavior: class extends FieldLabelBehavior {
                        onEdited(label) {
                            let data = this.data;
                            data.name = label.string;
                            label.container.hint.visible = (data.name.length == 0);
                            trace(data.name+"\n");
                        }
                    },
                }),
                Label($, {
                    left: 4, right: 4, top: 4, bottom: 4, style: fieldHintStyle,
                    string: "User Name", name: "hint"
                }),
            ]
        })
    ]
}));

let MainContainerTemplate = Container.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0, 
    skin: whiteSkin, active: true,
    contents: [
        new MyField({name: ""})
    ],
    Behavior: class extends Behavior {
        onTouchEnded(content) {
            SystemKeyboard.hide();
            content.focus();
        }
    }
}));



class screenBehavior extends Behavior {
   onCreate(screen) {



      var iconPIC = new Picture({height: 150, width: 150, top: 70, bottom: 30, align:'middle', url:'./assets/LoginLogo.png'});
      let User = new LabelTemp([new Picture({left: 80, height: 32, width: 60, align: 'middle', url:'./assets/icon_user_32x32.png'}), 
                               new RightTitle('User Name')]);
      let Key = new LabelTemp([new Picture({left: 80, height: 32, width: 60, align: 'middle', url:'./assets/icon_login_key_32x32.png'}), 
                               new RightTitle('Password')]);      





      let Content = new Column({
         skin: whiteSkin,
         contents:[
            iconPIC,
            User,
            Key,
            new common.NormalButton({
                  top: 20, 
                  string: "SIGN IN",
                  Behavior: class extends common.ButtonBehavior {
                     onTap(content) {
                        application.distribute("dispatch", "documentsScreen", "push");
                     }
                  }
         }), 
         ]
      });



      // let MainContainerTemplate = Container.template($ => ({
      //     left: 0, right: 0, top: 0, bottom: 0, 
      //     skin: whiteSkin, active: true,
      //     contents: [
      //         iconPIC,
      //         new MyField({name: ""})
      //     ],
      //     Behavior: class extends Behavior {
      //         onTouchEnded(content) {
      //             SystemKeyboard.hide();
      //             content.focus();
      //         }
      //     }
      // }));      

      //screen.add(new MainContainerTemplate());
      screen.add(Content);
   }
};

