/* Copyright (c) Eduardo Yáñez. */

// Camera/AR mode. Can also be an alternative mode for devices not supporting WebXR.

let videoElm = document.querySelector("#camera-stream");
let defaultsOpts = { audio: false, video: true };
let shouldFaceUser = true;
let stream = null;
var element = document.getElementById("camera-stream");

function capture() {
  defaultsOpts.video = { facingMode: shouldFaceUser ? "environment" : "user" };
  navigator.mediaDevices
    .getUserMedia(defaultsOpts)
    .then(function(_stream) {
      stream = _stream;
      videoElm.srcObject = stream;
      videoElm.play();
    })
    .catch(function(err) {
      console.log(err);
    });
}

// Splash

const cover = document.getElementById("cover");
const readybtn = document.getElementById("readybutton");
const splash = document.getElementById("splash");
const music = document.getElementById("music");
const logo = document.getElementById("logo");
const list = document.getElementById("List");
const indicator1 = document.getElementById("step1");
const indicator2 = document.getElementById("step2");
const indicatord = document.getElementById("dance");

const studio = document.getElementById("Studio");
const defaultlights = document.getElementById("defaultlights");
const studiolights = document.getElementById("studiolights");

function goar() {
  capture();
  wave();
  fade();
  tutorial.components.sound.playSound();
}

function govr() {
  wave();
  fade();
  studio.setAttribute("visible", "true");
  tutorial.components.sound.playSound();
  defaultlights.setAttribute("visible", "false");
  studiolights.setAttribute("visible", "true");
}

function expready() {
  cover.style.display = "none";
  music.components.sound.playSound();
}

function fade() {
  splash.style.opacity = "0";
  logo.style.opacity = "0";
  let textEl = document.querySelector('#text-object');
  textEl.setAttribute("visible", "true");
  setTimeout(showlist, 3000);
}

function showlist() {
  list.setAttribute("animation__show", "dur: 2000; property: scale; from: 0 0 0; to: 2.11 3.411 1");
  console.log("Showing Panel");
}

function hidelist() {
  list.setAttribute("animation__show", "dur: 2000; property: scale; from: 2.11 3.411 1; to: 0 0 0");
  console.log("Hiding Panel");
}

function hideindicators() {
  indicator1.style.display = "none";
  indicator2.style.display = "none";
  indicatord.style.display = "none";
}

/* Copyright (c) Facebook, Inc. and its affiliates. */

// Intiatilize an instance of SpeechRecognition from the Web-Speech-API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;
let counter = 0;

/* Copyright (c) Eduardo Yáñez. */
// This function will keep the mic active as it disconnects after a few seconds of inactivity
// Counter will prevent it from looping forever if an error occurs with the mic or service
recognition.onend = function() {
  console.log('Speech recognition service disconnected');
  if (counter < 1000) {
   recognition.start();
  }
  counter++;
}

/* Copyright (c) Facebook, Inc. and its affiliates. */
// Obtain it from your Wit.ai app's Settings page
const TOKEN = "<YOUR TOKEN HERE>";

// Set your wake word
const WAKE_WORD = "lorenzo";

// Component to set error message when the Wit.ai token has not been updated
AFRAME.registerComponent('error-message', {
  init: () => {
    if(TOKEN != "<YOUR TOKEN HERE>") {
      let textEl = document.querySelector('#text-object');
      textEl.setAttribute("text", `value: UPDATE CODE WITH YOUR WIT.AI TOKEN`);
    }
  }
});

// Component to for voice commands
AFRAME.registerComponent('voice-command', {
  init: () => {
    recognition.start();
    recognition.onresult = (event) => {
      console.log(event.results)
      let utteranceList = event.results;
      let latestUtterance = utteranceList[utteranceList.length-1];
      let speechRecognition = latestUtterance[latestUtterance.length-1];
  
      // Update text object with speech recognition transcription
      let transcript  = speechRecognition.transcript.toLowerCase();
      let textEl = document.querySelector('#text-object');
      textEl.setAttribute("text", `value:${transcript}`);
      
/* Copyright (c) Eduardo Yáñez. */
      if(latestUtterance.isFinal) {
        // Exit the function if the wake word was not triggered to respect user privacy
        if(!transcript.includes(`${WAKE_WORD}`)) {
          // Provide the user with a suggestion on voice commands they can say
          if (currentStep === 2 && slow === false) {
            textEl.setAttribute("text", `value:Try saying: 'Lorenzo, dance with me!'`);
          return;
          }
          if (currentStep === 2 && slow === true) {
            textEl.setAttribute("text", `value:Try saying: 'Lorenzo, lets speed up!'`);
            return;
          }
          if (currentStep === 3) {
            textEl.setAttribute("text", `value:Try saying: 'Lorenzo, lets do step 1.'`);
            return;
          }
          if (currentStep === 1 && slow === true) {
            textEl.setAttribute("text", `value:Try saying: 'Lorenzo, lets do normal speed!'`);
            return;
          }
          if (currentStep === 1 && slow === false) {
            textEl.setAttribute("text", `value:Try saying: 'Lorenzo, slow down!'`);
            return;
          }
          return;
        }
        
        // Extract the utterance from the wake word
        let utterance = transcript.split(`${WAKE_WORD}`)[1];

        // Send the user's utterance to Wit.ai API for NLU inferencing
        fetch(`https://api.wit.ai/message?v=20210414&q=${utterance}`, {
          headers: {Authorization: `Bearer ${TOKEN}`}
        })
        .then(response => response.json())
        .then(json => {
          // Add a 3D object to the scene based on the NLU inferencing result
          let scene = document.querySelector('a-scene');
          let command = json["entities"]["object:command"][0].value;
          if (command === "recenter") {
            recenter();
            return;
          }
          
          if (command === "step one") {
            if (slow === false) {
              stoptimeouts();
              tutorial.components.sound.stopSound();
              panel.components.sound.stopSound();
              start1.components.sound.playSound();
              salsa01();
            }
            if (slow === true) {
              stoptimeouts();
              tutorial.components.sound.stopSound();
              panel.components.sound.stopSound();
              start1.components.sound.playSound();
              choose01 = setTimeout(salsa01s, 3800);
            }
            currentStep = 1;
            return;
          }
          
          if (command === "step 2") {
            if (slow === false) {
              stoptimeouts();
              tutorial.components.sound.stopSound();
              panel.components.sound.stopSound();
              start2.components.sound.playSound();
              salsa02();
            }
            if (slow === true) {
              stoptimeouts();
              tutorial.components.sound.stopSound();
              panel.components.sound.stopSound();
              start2.components.sound.playSound();
              choose02 = setTimeout(salsa02s, 3500);
            }
            currentStep = 2;
            return;
          }
          
          if (command === "dance") {
            stoptimeouts();
            tutorial.components.sound.stopSound();
            panel.components.sound.stopSound();
            letsgo.components.sound.playSound();
            salsa03();
            cheer = setInterval(randomcheer, 4000);
            currentStep = 3;
            return;
          }
          
          if (command === "0") {
            console.log("Empty");
            return;
          }
          
          if (command === "slow") {
            slow = true;
            playanim();
          }
          
          if (command === "speed") {
            slow = false;
            playanim();
          }
          
          if (command === "tutorial") {
            if (tutorialflag = true) {
              tutorialflag = false;
              tutorial.components.sound.stopSound();
              panel.components.sound.stopSound();
              start1.components.sound.playSound();
              console.log("Skip tutorial");
              choose01 = setTimeout(salsa01s, 3500);
            }
            return;
          }
          
          if (command === "begin") {
            if (tutorialflag = true) {
              tutorialflag = false;
              tutorial.components.sound.stopSound();
              panel.components.sound.stopSound();
              start1.components.sound.playSound();
              console.log("Skip tutorial");
              choose01 = setTimeout(salsa01s, 3500);
            }
            return;
          }
          
          if (command === "hide info") {
            hidelist();
            return;
          }
          if (command === "show info") {
            showlist();
            return;
          }
          
          if (command === "stuff") {
            showlist();
            stoptimeouts();
            tutorial.components.sound.stopSound();
            panel.components.sound.stopSound();
            idle();
            panel.components.sound.playSound();
            return;
          }
          
          if (command === "help") {
            showlist();
            stoptimeouts();
            tutorial.components.sound.stopSound();
            panel.components.sound.stopSound();
            idle();
            panel.components.sound.playSound();
            return;
          }
          return;
        });
      }
    };
  }
});

// Sound

const tutorial = document.getElementById("tutorial");
const panel = document.getElementById("stuff");
const one = document.getElementById("one");
const two = document.getElementById("two");
const three = document.getElementById("three");
const four = document.getElementById("four");
const five = document.getElementById("five");
const six = document.getElementById("six");
const seven = document.getElementById("seven");
const eight = document.getElementById("eight");
const start1 = document.getElementById("start1");
const start2 = document.getElementById("start2");
const letsgo = document.getElementById("letsgo");
const random1 = document.getElementById("random1");
const random2= document.getElementById("random2");
const random3 = document.getElementById("random3");
const random4 = document.getElementById("random4");
const random5 = document.getElementById("random5");
const random6 = document.getElementById("random6");
const random7 = document.getElementById("random7");
const random8 = document.getElementById("random8");

var cheer;
var result;

function randomcheer() {
  result = Math.floor(Math.random() * 20);
  if (result === 0) {
    random1.components.sound.playSound();
    console.log("Cheer 1")
    return;
  }
  if (result === 1) {
    random2.components.sound.playSound();
    console.log("Cheer 2")
    return;
  }
  if (result === 2) {
    random3.components.sound.playSound();
    console.log("Cheer 3")
    return;
  }
  if (result === 3) {
    random4.components.sound.playSound();
    console.log("Cheer 4")
    return;
  }
  if (result === 4) {
    random5.components.sound.playSound();
    console.log("Cheer 5")
    return;
  }
  if (result === 5) {
    random6.components.sound.playSound();
    console.log("Cheer 6")
    return;
  }
  if (result === 6) {
    random7.components.sound.playSound();
    console.log("Cheer 7")
    return;
  }
  if (result === 7) {
    random8.components.sound.playSound();
    console.log("Cheer 8")
    return;
  }
  else return;
}

// Animations

const model = document.querySelector('#model');
const scene = document.querySelector('a-scene');

var waving;
var choose01;
var plays1p1;
var plays1p2;
var plays1p3;
var plays1p4;

var choose02;
var plays2p1;
var plays2p2;
var plays2p3;
var plays2p4;

var slow = true;
var currentStep = 0;
var tutorialflag = true;

function skiptutorial() {
  idle();
  console.log("skipped");
  tutorialflag = false;
}

// Logic

function playanim() {
  if (slow === true) {
    if (currentStep === 1) {
      stoptimeouts();
      start1.components.sound.playSound();
      choose01 = setTimeout(salsa01s, 2000);
      console.log("Slowing");
      return;
    }
    if (currentStep === 2) {
      stoptimeouts();
      start2.components.sound.playSound();
      choose02 = setTimeout(salsa02s, 2000);
      console.log("Slowing");
      return;
    }
    if (currentStep === 3) {
      salsa03();
      console.log("Cant stop");
      return;
    }
    else
    console.log("Already going slow");
    return;
  }
  
  if (slow === false) {
    if (currentStep === 1) {
      stoptimeouts();
      random1.components.sound.playSound();
      salsa01();
      console.log("Normal speed");
      return;
    }
    if (currentStep === 2) {
      stoptimeouts();
      random3.components.sound.playSound();
      salsa02();
      console.log("Normal speed");
      return;
    }
    if (currentStep === 3) {
      salsa03();
      console.log("Already going normal speed");
      return;
    }
    else
    console.log("Normal speed");
    return;
  }
}

if (scene.hasLoaded) {
  run();
} else {
  scene.addEventListener('loaded', run);
}

function run () {
  readybtn.style.opacity = "1";
} 

// Step 1

function salsa01() {
  model.setAttribute("animation-mixer", "clip: SalsaP1; crossFadeDuration: 1; loop: repeat; repetitions: infinity; timeScale: .8");
  model.setAttribute("rotation", "0 -5 0");
  console.log("Step01");
  hideindicators();
  indicator1.style.display = "block";
}

function transition01() {
  model.setAttribute("animation-mixer", "clip: S1P1; loop: once; clampWhenFinished: true; timeScale: .5; crossFadeDuration: 1;");
  model.setAttribute("rotation", "0 -5 0");
  one.components.sound.playSound();
  console.log("Part1");
}

function one01part1() {
  model.setAttribute("animation-mixer", "clip: S1P1; loop: once; clampWhenFinished: true; timeScale: .5; crossFadeDuration: 0;");
  one.components.sound.playSound();
}

function one01part2() {
  model.setAttribute("animation-mixer", "clip: S1P2; loop: once; clampWhenFinished: true; timeScale: .5; crossFadeDuration: 0;");
  two.components.sound.playSound();
  console.log("Part2");
}

function one01part3() {
  model.setAttribute("animation-mixer", "clip: S1P3; loop: once; clampWhenFinished: true; timeScale: .5; crossFadeDuration: 0;");
  three.components.sound.playSound();
  console.log("Part3");
}

function one01part4() {
  model.setAttribute("animation-mixer", "clip: S1P4; loop: once; clampWhenFinished: true; timeScale: .5; crossFadeDuration: 0;");
  four.components.sound.playSound();
  console.log("Part4");
}

function onebyone01() {
  one01part1();
  plays1p2 = setTimeout(one01part2, 4000);
  plays1p3 = setTimeout(one01part3, 8000);
  plays1p4 = setTimeout(one01part4, 12000);
}

function activate01() {
  transition01();
  plays1p2 = setTimeout(one01part2, 4000);
  plays1p3 = setTimeout(one01part3, 8000);
  plays1p4 = setTimeout(one01part4, 12000);
}

function salsa01s() {
  hideindicators();
  indicator1.style.display = "block";
  model.setAttribute("rotation", "0 0 0");
  activate01();
  plays1p1 = setInterval(onebyone01, 16000);
  console.log("Step 1 Slow");
}

// Step 2

function salsa02() {
  hideindicators();
  indicator2.style.display = "block";
  model.setAttribute("animation-mixer", "clip: SalsaS2; crossFadeDuration: 2; loop: repeat; repetitions: infinity; timeScale: .8");
  model.setAttribute("rotation", "0 0 0");
  console.log("Step 2");
}

function transition02() {
  model.setAttribute("animation-mixer", "clip: S2P1; loop: once; clampWhenFinished: true; timeScale: .5; crossFadeDuration: 1;");
  model.setAttribute("rotation", "0 0 0");
  one.components.sound.playSound();
  console.log("Part1");
}

function one02part1() {
  model.setAttribute("animation-mixer", "clip: S2P1; loop: once; clampWhenFinished: true; timeScale: .5; crossFadeDuration: 0;");
  one.components.sound.playSound();
  console.log("Part1");
}

function one02part2() {
  model.setAttribute("animation-mixer", "clip: S2P2; loop: once; clampWhenFinished: true; timeScale: .5; crossFadeDuration: 0;");
  two.components.sound.playSound();
  console.log("Part2");
}

function one02part3() {
  model.setAttribute("animation-mixer", "clip: S2P3; loop: once; clampWhenFinished: true; timeScale: .5; crossFadeDuration: 0;");
  three.components.sound.playSound();
  console.log("Part3");
}

function one02part4() {
  model.setAttribute("animation-mixer", "clip: S2P4; loop: once; clampWhenFinished: true; timeScale: .5; crossFadeDuration: 0;");
  four.components.sound.playSound();
  console.log("Part4");
}

function onebyone02() {
  one02part1();
  plays2p2 = setTimeout(one02part2, 4000);
  plays2p3 = setTimeout(one02part3, 8000);
  plays2p4 = setTimeout(one02part4, 12000);
}

function activate02() {
  transition02();
  plays2p2 = setTimeout(one02part2, 4000);
  plays2p3 = setTimeout(one02part3, 8000);
  plays2p4 = setTimeout(one02part4, 12000);
}

function salsa02s() {
  hideindicators();
  indicator2.style.display = "block";
  model.setAttribute("rotation", "0 0 0");
  activate02();
  plays2p1 = setInterval(onebyone02, 16000);
  console.log("Step 2 Slow");
}

// Step 3

function salsa03() {
  hideindicators();
  indicatord.style.display = "block";
  model.setAttribute("animation-mixer", "clip: SalsaP3; crossFadeDuration: .5; loop: repeat; repetitions: infinity; timeScale: .8");
  model.setAttribute("rotation", "0 -3.5 0");
  console.log("Step 3");
}

function salsa04() {
  model.setAttribute("animation-mixer", "clip: SalsaP4; crossFadeDuration: .5; loop: repeat; repetitions: infinity; timeScale: .6");
  model.setAttribute("rotation", "0 0 0");
  console.log("Step 4");
}

function idle() {
  model.setAttribute("animation-mixer", "clip: Idle; crossFadeDuration: .8; loop: repeat; repetitions: infinity");
  model.setAttribute("rotation", "0 3 0");
  console.log("Idle");
}

function wave() {
  model.setAttribute("animation-mixer", "clip: Greeting; crossFadeDuration: 1.2; loop: repeat; repetitions: 5; timeScale: .8");
  console.log("Wave");
  waving = setTimeout(idle, 4000);
}

function stoptimeouts() {
  clearTimeout(waving);
  clearTimeout(plays1p1);
  clearTimeout(plays1p2);
  clearTimeout(plays1p3);
  clearTimeout(plays1p4);
  clearTimeout(plays2p1);
  clearTimeout(plays2p2);
  clearTimeout(plays2p3);
  clearTimeout(plays2p4);
  clearTimeout(choose01);
  clearTimeout(choose02);
  clearInterval(cheer);
  console.log("stopped");
}

// Recenter
const camera = document.getElementById("camera");
function recenter() {
  camera.setAttribute('position', '0 1.2 0');
}