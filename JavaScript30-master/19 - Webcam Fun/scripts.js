const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => console.error('Error: ', err));
}

function paintToCanvas() {
    const {videoHeight: height, videoWidth: width} = video;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
    }, 16)
}

function takePhoto() {
    // Play the camera sound
    snap.currentTime = 0;
    snap.play();

    // Take the data out of canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a')
    link.href = data;
    link.setAttribute('download', 'turbo-photo');
    link.textContent = 'Download Image';
    strip.insertBefore(link, strip.firstChild);
}

getVideo();
video.addEventListener('canplay', paintToCanvas);
