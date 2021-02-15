var colorIndex=0;
var colors=[ "FFFFFF"
            ,"FF0000"
            ,"00FF00"
            ,"FFFF00"
            ,"0000FF"
            ,"FF00FF"
            ,"00FFFF"
            ];

function nextColor(){
    colorIndex++;
    if (colorIndex>=colors.length){ colorIndex=0; }
    setState('zigbee.0.7cb03eaa0a006e66.color',colors[colorIndex]);
} 

var PTM216ZState=[
    {down:false,release:false,count:0,click:function(){
            nextColor(); 
        },hold:function(){
         console.log("PTM216ZState[0].hold");   
        }},
    {down:false,release:false,count:0},
    {down:false,release:false,count:0},
    {down:false,release:false,count:0},
    {down:false,release:false,count:0},
    {down:false,release:false,count:0}
]

function press(index){
    console.log("press "+index);
    PTM216ZState[index].down=true;
    PTM216ZState[index].count=0;
}
function release(index){
    console.log("release "+index);
    PTM216ZState[index].down=false;
    PTM216ZState[index].release=true;
}

const steps=5;
// Example with 6 digits:
schedule("* * * * * *", function () {
    PTM216ZState.forEach(element => {
        if (element.down){
            element.count++;
            if (element.count>=3){
                element.down=false;
                if (element.hold){element.hold();}
            }  
        }
        if (element.release){
            if (element.count<3 && element.click){element.click();}
            element.release=false;
        }
    });
});

on({id: "zigbee.1.000000000172c2cd.action", change:"ne"}, function (obj) {
  var value = obj.state.val;
  var oldValue = obj.oldState.val;
      switch(value){
      case "recall_scene_0": press(0); break;
      case 'recall_scene_1': press(1); break;
      case 'recall_scene_2': press(2); break;
      case 'recall_scene_3': press(3); break;
      case 'press_2_of_2':   press(4); break;
      case 'press_1_of_2':   press(5); break;
      case "recall_scene_4": release(0); break;
      case 'recall_scene_5': release(1); break;
      case 'recall_scene_6': release(2); break;
      case 'recall_scene_7': release(3); break;
      case 'release_2_of_2': release(4); break;
      case 'release_1_of_2': release(5); break;
      default: console.log("Unbekannte Zeichenkette"); break;        
  }
  
});
