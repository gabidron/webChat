
let socket = io();
let myPeer = new Peer();

let myVideo = document.createElement('video');

let camera = true, mute = false;
let Stream;

let urlParams = new URLSearchParams(window.location.search);
const roomName =  urlParams.get('name');
document.getElementById('roomId').innerText = roomName;

let videoGrid = document.getElementById('video-container');
let message = document.getElementById('message');
let output = document.getElementById('output');
let button = document.getElementById('button');

let name = prompt("What's your name?");
if (name == null || name == "")
    name = "username";

    let USERID = name;

socket.emit('join', name);

document.getElementById('welcome-msg').innerText += '   ' + name + '  !';

button.addEventListener('click', (ev) => {

    ev.preventDefault();

    if(message.value){
        socket.emit('chat message', {msg: message.value, name:name});
        let msg = `
        <div class="msg msg-self">
            ${message.value}
        </div>
        `;
        output.innerHTML += msg;
        message.value = ' ';

        output.scrollBy(0,100);

    }

});

socket.on('join', (data) => {
    output.innerHTML += `
        <div class = "alert">
            ${data} joined the room
        </div>
    `;
    output.scrollBy(0,100);

});

socket.on('chat message', (data) => {

    let msg = `
    <div class="msg msg-users">
        <span class="sent-by">${data.name}:</span>
        <br>
        ${data.msg}   
    </div>
    `;

    output.innerHTML += msg;
    output.scrollBy(0,100);
});

socket.on('user-disconnected', (id) => {
    let userVideo = document.getElementById(id);
    userVideo.remove();
    console.log("adsasa");
})
//////////////////////////


myPeer.on('open', id => { 
    socket.emit('join-room', id);
});

function addVideoStream(video, stream) {
    video.srcObject = stream 
    video.addEventListener('loadedmetadata', () => { 
        video.play()
    })
    
    videoGrid.append(video);
}

function connectToNewUser(userId, stream) { 

    const call = myPeer.call(userId, user-disconnectedstream); 

    const video = document.createElement('video'); 
    video.id = userId;
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
  
    call.on('user-disconnected', () => {
        video.remove();
    })
}


const options = document.querySelectorAll('button.option');

for(let opt of options){

    opt.addEventListener('click' ,() => {
        let el = opt.children[0].classList;
        if(el.contains('off')){

                if(el[1] == "fa-microphone-slash"){
                    el.add("fa-microphone");
                    el.remove("fa-microphone-slash");
                    mute = false;
                }

                if(el[1] == "fa-video-slash"){
                    el.add("fa-video");
                    el.remove("fa-video-slash");
                    camera = true;
                }

            }else{
                
                if(el[1] == "fa-microphone"){
                el.remove("fa-microphone");
                el.add("fa-microphone-slash");
                mute = true;
                }

                if(el[1] == "fa-video"){
                    el.remove("fa-video");
                    el.add("fa-video-slash");
                    camera = false;
                }
                
            }
            Stream.getVideoTracks()[0].enabled = camera;
            Stream.getAudioTracks()[0].enabled = !mute;
            el.toggle('off');
    });
}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    Stream = stream;
    myVideo.muted = true; 
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => { 
        
        call.answer(stream); 
        const video = document.createElement('video');
        call.on('stream', userVideoStream => { 
            addVideoStream(video, userVideoStream);
        });
    })

    socket.on('user-connected', userId => {  
        connectToNewUser(userId, stream);
    });

}).catch( err => {
    alert(err.message);
});
