let x = 0;
let angle = 0;
let dancing = false;
let audio, ctx, analyser, dataArray;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight - 100);
  cnv.parent('dance');
  noStroke();
  audio = document.getElementById('music');
  
  // Setup Web Audio analyser
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  audio.onplay = () => {
    audioCtx.resume();
    dancing = true;
  };
}

function draw() {
  background(0, 0, 0, 30);
  if (!dancing) {
    fill(255);
    textSize(24);
    text('Press play to start dancing 💃', width / 2 - 140, height / 2);
    return;
  }
  
  analyser.getByteFrequencyData(dataArray);
  let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
  let beat = map(avg, 0, 255, 0.8, 2);
  
  push();
  translate(width / 2, height / 1.5);
  fill(0);
  stroke(255);
  strokeWeight(3);
  
  // Silhouette body
  line(0, 0, 0, -100);
  
  // Head
  ellipse(0, -120, 40, 40);
  
  // Arms move with beat
  let armMove = sin(frameCount * 0.1) * 30 * beat;
  line(0, -80, -60 - armMove, -60);
  line(0, -80, 60 + armMove, -60);
  
  // Legs dance
  let legMove = sin(frameCount * 0.2) * 20 * beat;
  line(0, 0, -30 - legMove, 60);
  line(0, 0, 30 + legMove, 60);
  
  pop();
}
