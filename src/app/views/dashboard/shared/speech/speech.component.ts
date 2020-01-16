import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.css']
})
export class SpeechComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  talkBack(message) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  }

  listen() {

    // const speechRecognition = window.SpeechRecognition;
    // const recognition = new SpeechRecognition();
    // recognition.onstart = () => {
    //   console.log('voice activated');
    // };

    // recognition.onresult = (event) => {
    //   console.log(event);
    // };
    // this._supportRecognition = true;
    // console.log(window['SpeechRecognition']);
    // if (window['SpeechRecognition']) {
    //   this._speech = new SpeechRecognition();
    // } else if (window['webkitSpeechRecognition']) {
    //   this._speech = new webkitSpeechRecognition();
    // } else if (window['msSpeechRecognition']) {
    //   this._speech = new msSpeechRecognition();
    // } else {
    //   this._supportRecognition = false;
    // }
    // console.log(`Speech supported: ${this._supportRecognition}`);
  }
}
