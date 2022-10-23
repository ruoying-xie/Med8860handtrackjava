const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
videoElement.setAttribute('autoplay', '');
videoElement.setAttribute('muted', '');
videoElement.setAttribute('playsinline', '');

var video = document.querySelector("#input_video");

function onResults(results) {
  var cx,cy;	
  canvasCtx.save();
  //canvasCtx.translate(canvasElement.width, 0);
  //canvasCtx.scale(-1, 1);
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
	  var myJSON = JSON.stringify(landmarks[8]);
	  var myJSON2 = JSON.parse(myJSON);
	  cx = parseInt(myJSON2.x*canvasElement.width);
	  cy = parseInt(myJSON2.y*canvasElement.height);	
	  
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.restore();
  
  let src = cv.imread('output_canvas');
  if (cx > 50 && cx < 150 && cy > 100 && cy<200)
  {
	  cv.rectangle(src, new cv.Point(50, 100), new cv.Point(150, 200), [0, 0, 255, 255], -1); //RGBA - A for alpha
  }else
  {
	  cv.rectangle(src, new cv.Point(50, 100), new cv.Point(150, 200), [0, 0, 255, 255], 4); //RGBA - A for alpha
  }
  
  if (cx > 200 && cx < 300 && cy > 100 && cy<200)
  {
	  cv.rectangle(src, new cv.Point(200, 100), new cv.Point(300, 200), [255, 0, 0, 255], -1); //RGBA - A for alpha
  }else
  {
	  cv.rectangle(src, new cv.Point(200, 100), new cv.Point(300, 200), [0, 0, 255, 255], -1); //RGBA - A for alpha
  }
  
  cv.imshow('output_canvas', src);
  src.delete();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 480,
  height: 480
});
camera.start();

