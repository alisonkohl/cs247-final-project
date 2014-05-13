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

(function() {

  var cur_video_blob = null;
  var fb_instance;
  var mediaRecorder;
  var video_container;
  var fb_instance_stream

  $(document).ready(function(){
    connect_to_chat_firebase();
    connect_webcam();
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
    var my_color = "#"+((1<<24)*Math.random()|0).toString(16);

    // listen to events
    fb_instance_users.on("child_added",function(snapshot){
      var id = snapshot.name();
      display_msg(id, {m:snapshot.val().name+" joined the room",c: snapshot.val().c});
    });
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
    var username = window.prompt("Hi, please let me know what your name is");
    if(!username){
      username = "anonymous"+Math.floor(Math.random()*1111);
    }
    fb_instance_users.push({ name: username,c: my_color});
    $("#waiting").remove();

    // bind submission box
    var text;
    $("#submission input").keydown(function( event ) {
      text = $(this).val();
      if (event.which == 13) {
        fb_instance_stream.push({m:username+": " +text, c: my_color});
        $(this).val("");
      }
      });
    //$("#submission button").onclick(function( event ) {
      document.getElementById("recordBtn").onclick=function() {
        record_audio_and_video();
      //text = $(this).val();
      //if (event.which == 13) {
        //if(has_emotions($(this).val().toUpperCase())){
          //fb_instance_stream.push({m:username+": " +text, c: my_color});
            /*var i = 0;
            var second_counter = document.getElementById('second_counter');
            var count = setTimeout(function(){
              second_counter.innerHTML = ""; 
              second_counter.innerHTML = "Talk Some Trash!";
              mediaRecorder.start(7000);

              mediaRecorder.ondataavailable = function (blob) {
                  console.log("new data available!");

                  blob_to_base64(blob,function(b64_data){
                    cur_video_blob = b64_data;
                  });
                  console.log("test");

                };

              console.log('before');

              //$("#stopButton").onclick = function() {
              document.getElementById("stopButton").onclick = function() {
                console.log("in on click");
                mediaRecorder.stop();
                fb_instance_stream.push({m:username, v:cur_video_blob, c: my_color, r: 0});
                console.log('after');
                second_counter.innerHTML = "";
                i++;
                //if(i >=3){
                clearInterval(count);

              };

              setTimeout(function(){
                
                fb_instance_stream.push({m:username, v:cur_video_blob, c: my_color, r: 0});
                console.log('after');
                second_counter.innerHTML = "";
                i++;
                //if(i >=3){
                clearInterval(count);
                //}
              },7500);
              //var j = 2;
              /*if(i <2){
              var countdown = setInterval(function(){
                second_counter.innerHTML = j;
                j--;
                if(j <= 0){
                  clearInterval(countdown);
                }
              },1000);
            }*/
            //}, 500); 
        //}else{
        //  fb_instance_stream.push({m:username+": " +text, c: my_color});
        //}
        //$(this).val("");
      //}
    };
}

  // creates a message node and appends it to the conversation
  function display_msg(id, data){
    $("#conversation").append("<div class='msg' style='color:"+data.c+"'>"+data.m+"</div>");
    if(data.v){
      // for video element
      
      console.log("id is: " + id);
      console.log("data.r is: " + data.r);

      var video = document.createElement("video");
      video.autoplay = true;
      video.controls = false; // optional
      video.loop = true;
      video.width = 120;

      var source = document.createElement("source");
      source.src =  URL.createObjectURL(base64_to_blob(data.v));
      source.type =  "video/webm";

      video.appendChild(source);

      // for gif instead, use this code below and change mediaRecorder.mimeType in onMediaSuccess below
      //var video = document.createElement("img");
       //video.src = URL.createObjectURL(base64_to_blob(data.v));

       document.getElementById("conversation").appendChild(video);
       var yeahButton = document.createElement("button");
       var booButton = document.createElement("button");
       var rating = document.createElement("h6");

       yeahButton.setAttribute("id", "yea" + id);
       booButton.setAttribute("id", "boo" + id);
       rating.setAttribute("id", id);

       yeahButton.innerHTML = "YEAH!";
       booButton.innerHTML = "BOO!";
       rating.innerHTML = data.r;

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
       
       document.getElementById("conversation").appendChild(yeahButton);
       document.getElementById("conversation").appendChild(booButton);
       document.getElementById("conversation").appendChild(rating);

     }
    // Scroll to the bottom every time we display a new message
    scroll_to_bottom(0);
  }

  function scroll_to_bottom(wait_time){
    // scroll to bottom of div
    setTimeout(function(){
      $("html, body").animate({ scrollTop: $(document).height() }, 200);
    },wait_time);
  }

  function connect_webcam(){
    // we're only recording video, not audio
    var mediaConstraints = {
      video: true,
      audio: true
    };

    // callback for when we get video stream from user.
    var onMediaSuccess = function(stream) {
      // create video element, attach webcam stream to video element
      var video_width= 160;
      var video_height= 120;
      var webcam_stream = document.getElementById('webcam_stream');
      var video = document.createElement('video');
      webcam_stream.innerHTML = "";
      // adds these properties to the video
      video = mergeProps(video, {
        controls: false,
        width: video_width,
        height: video_height,
        src: URL.createObjectURL(stream)
      });
      video.play();
      webcam_stream.appendChild(video);

      // counter
      /*
      var time = 0;
      var second_counter = document.getElementById('second_counter');
      var second_counter_update = setInterval(function(){
        second_counter.innerHTML = time++;
      },1000);*/

      // now record stream in 5 seconds interval
      video_container = document.getElementById('video_container');
      mediaRecorder = new MediaStreamRecorder(stream);
      var index = 1;

      mediaRecorder.mimeType = 'video/webm';
      //mediaRecorder.mimeType = 'image/gif';
      // make recorded media smaller to save some traffic (80 * 60 pixels, 3*24 frames)
      mediaRecorder.video_width = video_width/2;
      mediaRecorder.video_height = video_height/2;

     /* mediaRecorder.ondataavailable = function (blob) {
          //console.log("new data available!");
          video_container.innerHTML = "";

          // convert data into base 64 blocks
          blob_to_base64(blob,function(b64_data){
            cur_video_blob = b64_data;
          });
        };
      /*setInterval( function() {
        mediaRecorder.stop();
        mediaRecorder.start(3000);
      }, 3000 );*/
console.log("connect to media stream!");
}

    // callback if there is an error when we try and get the video stream
    var onMediaError = function(e) {
      console.error('media error', e);
    }

    // get video stream from user. see https://github.com/streamproc/MediaStreamRecorder
    //navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

    var ready = 0; // use a counter to make sure audoi and video are all ready

    // record audio
    navigator.getUserMedia({audio: true}, function(mediaStream) {
      $("#status").html("waiting..");
      window.recordRTC_Audio = RecordRTC(mediaStream);
      ready += 1;
      if(ready == 2){
        //record_audio_and_video();
      }
    },function(failure){
      console.log(failure);
    });

    // record video
    navigator.getUserMedia({video: true}, function(mediaStream) {
      $("#status").html("waiting..");
      window.recordRTC_Video = RecordRTC(mediaStream,{type:"video"});
      ready += 1;
      if(ready == 2){
        //record_audio_and_video();
      }
    },function(failure){
      console.log(failure);
    });

  }


    $("#stopButton").click(function (){
      console.log("in stop button code");
      recordRTC_Audio.stopRecording(function(audioURL) {
        //$("#audio_link").append("<a href='"+audioURL+"'' target='_blank'>"+audioURL+"</a>")
        $("#audio_link").append("<audio id='audio' src='"+audioURL+"'></audio>") // use <audio controls> to enable control progress bar
        datauri_to_blob(audioURL,function(blob){
          blob_to_base64(blob,function(base64){
            console.log(blob);
            //console.log(base64);
          });
        });

      });
      recordRTC_Video.stopRecording(function(videoURL) {
        fb_instance_stream.push({m:username, v:videoURL, c: my_color, r: 0});
        //$("#video_link").append("<video id='video' src='"+videoURL+"'></video>") // use <video controls> to enable control progress bar
      });

      setTimeout(function(){
        document.getElementById("video").play();
        setTimeout(function(){
          document.getElementById("audio").play(); // delay 500 seconds for audio, it worked well on my machine
        },7500);
      },500); // wait until audio and video are both appended

      $(this).remove();
    });

  function record_audio_and_video(){

    $("#status").html("Audio and video recording started");

    recordRTC_Video.startRecording();
    recordRTC_Audio.startRecording();
  }

  // check to see if a message qualifies to be replaced with video.
  var has_emotions = function(msg){
    var options = ["TRASH"];
    for(var i=0;i<options.length;i++){
      if(msg.indexOf(options[i])!= -1){
        return true;
      }
    }
    return false;
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


  // some handy methods for converting blob to base 64 and vice versa
  // for performance bench mark, please refer to http://jsperf.com/blob-base64-conversion/5
  // note useing String.fromCharCode.apply can cause callstack error
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

})();