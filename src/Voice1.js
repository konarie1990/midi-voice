import React, { Component } from 'react';
import WebMidi from 'webmidi';

// WebMidi.enable(function(err) {
//   if (err) {
//     console.log('WebMidi could not be enabled.', err);
//   } else {
//     console.log('WebMidi enabled!');
//   }
//   console.log(WebMidi.inputs);
//   console.log(WebMidi.outputs);

//   // Retrieve an input by name, id or index
//   var input = WebMidi.getInputByName('microKEY KEYBOARD"');
//   input = WebMidi.getInputById('1809568182');
//   input = WebMidi.inputs[7];

//   // Listen for a 'note on' message on all channels
//   input.addListener('noteon', 'all', function(e) {
//     Voice.handleSpeak();
//     console.log(
//       "Received 'noteon' message (" + e.note.name + e.note.octave + ').'
//     );
//   });
// });

class Voice1 extends Component {
  speech = window.speechSynthesis;
  m = new SpeechSynthesisUtterance();
  noOptionSelected = {
    'en-US': 'select a voice'
  };
  state = {
    language: 'en-US',
    message: 'hey hello world',
    selectedVoice: 0,
    pitch: 1,
    speed: 1,
    formIsValid: false,
    buttonText: 'Speak'
  };

  componentDidMount() {
    const handleSpeak = e => {
      // e.preventDefault();
      console.log(this.state);
      this.m.voice = this.speech.getVoices()[this.state.selectedVoice];
      this.m.rate = this.state.speed;
      this.m.pitch = this.state.pitch;
      this.m.text = this.state.message;
      this.speech.speak(this.m);
    };
    const cancelSpeak = e => {
      // e.preventDefault();
      this.speech.cancel();
    };
    WebMidi.enable(function(err) {
      if (err) {
        console.log('WebMidi could not be enabled.', err);
      } else {
        console.log('WebMidi enabled!');
      }
      console.log(WebMidi.inputs);
      console.log(WebMidi.outputs);

      // Retrieve an input by name, id or index
      let input = WebMidi.inputs[5];

      // Listen for a 'note on' message on all channels
      input.addListener('noteon', 1, function(e) {
        console.log(
          "Received 'noteon' message (" + e.note.name + e.note.octave + ').'
        );
        if (e.note.name + e.note.octave === 'C0') {
          handleSpeak();
        }
        if (e.note.name + e.note.octave === 'C#0') {
          cancelSpeak();
        }
      });
    });
  }

  changeLanguage = language => {
    this.setState({
      language: language
    });
  };

  changeMessage = e => {
    this.setState({ message: e.target.value });
  };

  changeSelectedVoice = e => {
    this.setState({
      selectedVoice: parseInt(e.target.value)
    });
  };

  changePitch = e => {
    this.setState({
      pitch: parseFloat(e.target.value)
    });
  };

  changeSpeed = e => {
    this.setState({
      speed: parseFloat(e.target.value)
    });
  };

  handleSpeak = e => {
    // e.preventDefault();
    console.log(this.state);
    this.m.voice = this.speech.getVoices()[this.state.selectedVoice];
    this.m.rate = this.state.speed;
    this.m.pitch = this.state.pitch;
    this.m.text = this.state.message;
    this.speech.speak(this.m);
  };

  cancelSpeak = e => {
    e.preventDefault();
    this.speech.cancel();
  };

  render() {
    return (
      <div>
        <Instance
          noOptionSelected={this.noOptionSelected[this.state.language]}
          changeMessage={this.changeMessage}
          changeSpeed={this.changeSpeed}
          changePitch={this.changePitch}
          changeSelectedVoice={this.changeSelectedVoice}
          speech={this.speech}
          handleSpeak={this.handleSpeak}
          cancelSpeak={this.cancelSpeak}
          state={this.state}
        />
      </div>
    );
  }
}

//

const Instance = props => {
  const getVoiceOption = (voice, i) => {
    let selected = props.state.selectedVoice === i ? 'selected' : '';
    return (
      <option key={i} value={i} defaultValue={selected}>
        {' '}
        {voice.name} - {voice.lang}
      </option>
    );
  };

  return (
    <form action='#'>
      <h2>Voice 1</h2>
      <div>
        <select onChange={props.changeSelectedVoice.bind(this)}>
          <option value='null' disabled>
            {' '}
            {props.noOptionSelected}
          </option>
          {window.speechSynthesis
            .getVoices()
            .map((voice, i) => getVoiceOption(voice, i))}
        </select>
        <br />
        <label>Select a voice</label>
        <br />
      </div>
      <div>
        <textarea
          onKeyUp={props.changeMessage.bind(this)}
          defaultValue={props.state.message}
          type='text'
        />
        <br />
        <label>Text to be spoken</label>
      </div>

      <div>
        <label htmlFor='pitchChange'>Pitch {props.state.pitch}</label>
        <input
          id='pitchChange'
          min='0'
          max='2'
          step='0.01'
          defaultValue={props.state.pitch}
          tabIndex='0'
          onChange={props.changePitch.bind(this)}
          type='range'
        />
      </div>
      <div>
        <label>Speed {props.state.speed}</label>
        <input
          id='speedChange'
          type='range'
          min='0'
          max='3.6'
          step='0.01'
          defaultValue={props.state.speed}
          tabIndex='0'
          onChange={props.changeSpeed.bind(this)}
        />
      </div>
      <button
        onClick={props.handleSpeak.bind(this)}
        disabled={props.state.formIsValid}
      >
        Speak
      </button>
      <button
        onClick={props.cancelSpeak.bind(this)}
        disabled={props.state.formIsValid}
      >
        Stop
      </button>
    </form>
  );
};

export default Voice1;
