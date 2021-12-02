var aliveSecond = 0;
var heartbeatRate = 5000;

var myChannel = "ethan-channel";

function keepAlive()
{
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if(this.readyState=== 4){
			if(this.status === 200){
				if(this.responseText !== null){
					var date = new Date();
					aliveSecond = date.getTime();
					var keepAliveData = this.responseText;


				}
			}
		}
	};
	request.open("GET","keep_alive","true");
	request.send(null);
	setTimeout('keepAlive()',heartbeatRate);
}

function time()
{
	var d = new Date();
	var currentSec = d.getTime();
	if(currentSec - aliveSecond > heartbeatRate + 1000)
	{
		document.getElementById("Connection_id").innerHTML = "DEAD";
	}
	else
	{
		document.getElementById("Connection_id").innerHTML = "ALIVE";
	}
	setTimeout('time()',1000);
}



function sendEvent(value)
{
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if(this.readystate == 4)
		{
			if(this.responseText !== null)
			{
			}
		}
	};
	request.open("POST","status="+value,true);
	request.send(null);
}

function handleClick(cb)
{
	if(cb.checked)
	{
		value= "ON";
	}
	else
	{
		value="OFF";
	}
	var cksStatus = new Object();
	cksStatus[cb,id] = value;
	var event = new Object();
	event.event = cksStatus;
	publishUpdate(event,myChannel);
}

function logout()
{
   console.log("Logging out and unsubscribing")
   pubnub.unsubscribe(
   {
     channels : [myChannel]
   })
   location.replace('/logout')
}


const pubnub = new PubNub({
  publishKey: "pub-c-e2f8eb96-da10-49b6-ab32-c65f008a3783",
  subscribeKey: "sub-c-bcc96b3e-3d68-11ec-b2c1-a25c7fcd9558",
  uuid: "4012ed30-3d73-11ec-9bbc-0242ac130002"
});

pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishSampleMessage();
            }
        },
        message: function(msg) {
            var msg = message.message;
            console.log(msg);
            document.getElementById("Motion_id").innerHTML = msg["motion"];
        },
        presence: function(presenceEvent) {
            // This is where you handle presence. Not important for now :)
        }
    })

pubnub.subscribe({channels:[myChannel]});

function publishUpdate(data,channel){
    pubnub.publish({
          channel:channel,
          message:data
          },
          function(status,response){
               if(status.error){
                   console.log(status)
               }
               else{
                   console.log("Message is published with timetoken",response.timetoken)
               }

          }

    );
}