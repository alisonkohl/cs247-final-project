var fb_instance;
var fb_instance_stream;
var ready = 0;
var username;
var my_color;

//var request = require("request");
//var DOMParser = require('xmldom').DOMParser;

function GetUrlValue(VarSearch){
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == VarSearch){
            return KeyValuePair[1];
        }
    }
}

$(document).ready(function(){
   	connect_to_chat_firebase();
    connect_webcam();
    document.getElementById("recordBtn").onclick=function() {
      if (ready == 2) {
        record_audio_and_video();
      }
    };
    $("#stopButton").click(function() {
      var videoBase64;
      recordRTC_Video.stopRecording(function(videoURL) {
        datauri_to_blob(videoURL,function(blob){
          blob_to_base64(blob,function(base64){
            videoBase64 = base64;
            //fb_instance_stream.push({m:username, v:base64, c: my_color, r: 0});
          });
        });
      });
      recordRTC_Audio.stopRecording(function(audioURL) {
        datauri_to_blob(audioURL,function(blob){
          blob_to_base64(blob,function(base64){
            fb_instance_stream.push({m:username, v:videoBase64, a:base64, c: my_color, r: 0});
          });
        });
      });
    });
  });

function connect_to_chat_firebase(){
    /* Include your Firebase link here!*/
    fb_instance = new Firebase("https://radiant-fire-2543.firebaseio.com");

    // generate new chatroom id or use existing id
    var url_segments = document.location.href.split("/#");
    if(url_segments[1]){
      fb_chat_room_id = url_segments[1];
    }else{
      fb_chat_room_id = Math.random().toString(36).substring(7);
    }
    //display_msg({m:"Share this url with your friend to join this chat: "+ document.location.origin+"/#"+fb_chat_room_id,c:"red"});
    //display_msg({m:"Type lol, :), or :( to share a sequence of three short videos. Plan accordingly!",c:"red"})

    // set up variables to access firebase data structure
    var home = GetUrlValue("home");
    var away = GetUrlValue("away");
    var date = GetUrlValue("date");
    var fb_new_chat_room = fb_instance.child('chatrooms').child(home + away + date);
    //var fb_new_chat_room = fb_instance.child('chatrooms').child(fb_chat_room_id);
    var fb_instance_users = fb_new_chat_room.child('users');
    fb_instance_stream = fb_new_chat_room.child('stream');
    my_color = "#"+((1<<24)*Math.random()|0).toString(16);

    // listen to events
   /* fb_instance_users.on("child_added",function(snapshot){
      var id = snapshot.name();
      display_msg(id, {m:snapshot.val().name+" joined the room",c: snapshot.val().c});
    }); */
    fb_instance_stream.on("child_added",function(snapshot){
      var id = snapshot.name();
      display_msg(id, snapshot.val());
    });

    fb_instance_stream.on("child_changed", function(snapshot, prevChildName){
      var ratingString = snapshot.val().r;
      if (ratingString.charAt(0) == '-') {
        ratingString = ratingString.substring(1);
      }
      console.log("ratingString is: " + ratingString);
      var indexOfHyphen = ratingString.indexOf("-");
      var id = ratingString.substring(indexOfHyphen);
      console.log("id in child changed function is: " + id);
      var rating = ratingString.substring(0, indexOfHyphen);
      console.log("rating for this id is: " + rating);
      document.getElementById(id).innerHTML = rating;
    });

    // block until username is answered
    console.log("before username prompt");
    username = window.prompt("Hi, please let me know what your name is");
    if(!username){
      username = "anonymous"+Math.floor(Math.random()*1111);
    }
    fb_instance_users.push({ name: username,c: my_color});

    // bind submission box
    var text;
    $("#submission input").keydown(function( event ) {
      text = $(this).val();
      if (event.which == 13) {
        fb_instance_stream.push({m:username+": " +text, c: my_color});
        $(this).val("");
      }
      });
    };

function connect_webcam() {
  // use a counter to make sure audoi and video are all ready

  // record audio
  navigator.getUserMedia({audio: true}, function(mediaStream) {
    $("#status").html("waiting..");
    window.recordRTC_Audio = RecordRTC(mediaStream);
    ready += 1;
  },function(failure){
    console.log(failure);
  });

  // record video
  navigator.getUserMedia({video: true}, function(mediaStream) {
    $("#status").html("waiting..");
    window.recordRTC_Video = RecordRTC(mediaStream,{type:"video"});
    ready += 1;

  var webcam_stream = document.getElementById('webcam_stream');
  var video = document.createElement('video');
  webcam_stream.innerHTML = "";
  // adds these properties to the video
  video = mergeProps(video, {
    controls: false,
    src: URL.createObjectURL(mediaStream)
  });
  video.play();
  webcam_stream.appendChild(video);

  },function(failure){
    console.log(failure);
  });
}

function record_audio_and_video(){
    recordRTC_Video.startRecording();
    recordRTC_Audio.startRecording();
  }

function display_msg(id, data){
  //$("#conversation").append("<div class='msg' style='color:"+data.c+"'>"+data.m+"</div>");
  if(data.v){
    // for video element
    
    console.log("id is: " + id);
    console.log("data.r is: " + data.r);

    var video = document.createElement("video");
    video.setAttribute("id", "video" + id);
    video.autoplay = false;
    video.controls = false; // optional
    video.loop = false;
    video.width = 240;

    var source = document.createElement("source");
    source.src =  URL.createObjectURL(base64_to_blob(data.v));
    source.type =  "video/webm";

    video.appendChild(source);

    // for gif instead, use this code below and change mediaRecorder.mimeType in onMediaSuccess below
    //var video = document.createElement("img");
     //video.src = URL.createObjectURL(base64_to_blob(data.v));

     //document.getElementById("conversation").appendChild(video);

    

    var playButton = document.createElement("button");
    var stopButton = document.createElement("button");
    playButton.setAttribute("id", "play" + id);
    stopButton.setAttribute("id", "stop" + id);
    playButton.innerHTML = "Play";
    stopButton.innerHTML = "Pause";

    playButton.onclick = function() {
      var currID = playButton.id.substring(4);
      /*document.getElementById("video" + currID).play();
      document.getElementById("audio" + currID).play(); */
      setTimeout(function(){
        document.getElementById("video" + currID).play();
        setTimeout(function(){
          document.getElementById("audio" + currID).play(); // delay 500 seconds for audio, it worked well on my machine
        },620);
      },500);
    }

    stopButton.onclick = function() {
      var currID = stopButton.id.substring(4);
      document.getElementById("video" + currID).pause();
      document.getElementById("audio" + currID).pause(); 
      /*setTimeout(function() {
        document.getElementById("video" + currID).pause();
        setTimeout(function(){
          document.getElementById("audio" + currID).pause(); // delay 500 seconds for audio, it worked well on my machine
        },500);
      },500);*/
    }

    var div = document.createElement("div");

    var usernameDiv = document.createElement("div");
    usernameDiv.style.color = data.c;
    usernameDiv.innerHTML = data.m;


    div.appendChild(usernameDiv);
    div.appendChild(video);
    //div.appendChild(playButton);

    var buttonsTable = document.createElement("table");
    buttonsTable.setAttribute("width", "240");
    var playRow = document.createElement("tr");
    var playCell = document.createElement("td");
    playCell.appendChild(playButton);
    playRow.appendChild(playCell);
    buttonsTable.appendChild(playRow);

    if (data.a) {
      var audioSrc = URL.createObjectURL(base64_to_blob(data.a));
      audioSrc.type= "audio/wav";
      $("#conversation").append("<audio id='audio" + id + "' src='"+audioSrc+"'></audio>");
    }


    //document.getElementById("conversation").appendChild(playButton);
    //document.getElementById("conversation").appendChild(stopButton);


    var yeahButton = document.createElement("button");
    var booButton = document.createElement("button");
    var rating = document.createElement("div");


     /*yeahButton.setAttribute("float", "left");
     booButton.setAttribute("float", "left");
     rating.setAttribute("float", "left");*/

     yeahButton.setAttribute("id", "yea" + id);
     booButton.setAttribute("id", "boo" + id);
     rating.setAttribute("id", id);

     yeahButton.innerHTML = "YEAH!";
     booButton.innerHTML = "BOO!";
     rating.innerHTML = 0;
     //rating.innerHTML = data.r;

     yeahButton.onclick = function() {
        var currID = yeahButton.id.substring(3);
        var ratingElement = document.getElementById(currID);
        var rating = parseInt(ratingElement.innerHTML);
        var newRating = rating + 1;
        var ratingString = newRating.toString() + currID;
        fb_instance_stream.child(currID).update({r: ratingString});
        ratingElement.innerHTML = (rating + 1).toString();

     }

     booButton.onclick = function() {
        var currID = booButton.id.substring(3);
        var ratingElement = document.getElementById(currID);
        var rating = parseInt(ratingElement.innerHTML);
        var newRating = rating - 1;
        var ratingString = newRating.toString() + currID;
        fb_instance_stream.child(currID).update({r: ratingString});
        ratingElement.innerHTML = (rating - 1).toString();
     }
     
     /*document.getElementById("conversation").appendChild(yeahButton);
     document.getElementById("conversation").appendChild(booButton);
     document.getElementById("conversation").appendChild(rating);*/

     /*buttonsDiv.appendChild(yeahButton);
     buttonsDiv.appendChild(rating);
     buttonsDiv.appendChild(booButton);
     div.appendChild(buttonsDiv);*/

     var rightVideoDiv = document.createElement("div");
    rightVideoDiv.setAttribute("float", "right");
    rightVideoDiv.setAttribute("width", "50px");
    rightVideoDiv.appendChild(playButton);

    rightVideoDiv.appendChild(yeahButton);
     rightVideoDiv.appendChild(rating);
     rightVideoDiv.appendChild(booButton);
     div.appendChild(rightVideoDiv);

    div.appendChild(buttonsTable);
   $("#conversation").append(div);

  }
}

function datauri_to_blob(dataURI,callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', dataURI, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    if (this.status == 200) {
      callback(this.response);
    }
  };
  xhr.send();
}

var blob_to_base64 = function(blob, callback) {
  var reader = new FileReader();
  reader.onload = function() {
    var dataUrl = reader.result;
    var base64 = dataUrl.split(',')[1];
    callback(base64);
  };
  reader.readAsDataURL(blob);
};

var base64_to_blob = function(base64) {
  var binary = atob(base64);
  var len = binary.length;
  var buffer = new ArrayBuffer(len);
  var view = new Uint8Array(buffer);
  for (var i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }
  var blob = new Blob([view]);
  return blob;
};

/*window.onload = function() {
    window.setInterval(function() {
    update();
  }, 5000);
};



function updatePlay(result) {
  console.log("working");
};

function update() {
$.ajax({
    type: "GET",
    url: "https://api.sportsdatallc.org/nba-t3/games/' + id + '/pbp.xml?api_key=rqukdyxzrs73sp4zrgg3v98j",
    dataType: "jsonp xml",
    success: updatePlay
  });
};*/

  /*var url = 'https://api.sportsdatallc.org/nba-t3/games/' + id + '/pbp.xml?api_key=rqukdyxzrs73sp4zrgg3v98j';
  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    console.log("CORS not supported");
    return;
  }

  xhr.onload = function() {
    console.log(xhr.responseText);
  }

  xhr.send();*/

  //$.get('https://api.sportsdatallc.org/nba-t3/games/' + id + '/pbp.xml?api_key=rqukdyxzrs73sp4zrgg3v98j', updatePlay, 'jsonp');
/*}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  return xhr;
}*/


