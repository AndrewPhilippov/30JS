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
        // Take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);

        // Mess with them

        // pixels = redEffect(pixels) // uncomment to apply RED Effect

        // pixels = rgbSplit(pixels); // uncomment to apply SplitRgb Effect
        // ctx.globalAlpha = .1

        pixels = greenScreen(pixels); // uncomment to apply greenScreen Effect

        // Put pixels back
        ctx.putImageData(pixels, 0, 0)
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
    link.innerHTML = `<img src="${data}" alt="Andrew Dev" />`
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 200; // R - RED
        pixels.data[1 + 1] = pixels.data[i + 1] - 50;  // G - GREEN
        pixels.data[1 + 2] = pixels.data[i + 2] * .5;  // B - BLUE
    }
    return pixels
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // R - RED
        pixels.data[i + 150] = pixels.data[i + 1]; // G - GREEN
        pixels.data[i - 300] = pixels.data[i + 2]; // B - BLUE
    }
    return pixels
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach(input => {
        levels[input.name] = input.value
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            // take it out!
            pixels.data[i + 3] = 0;
        }
    }
    return pixels
}

getVideo();
video.addEventListener('canplay', paintToCanvas);
