import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

import sound1 from "./assets/note1.mp3";
import sound2 from "./assets/note4.mp3";
import sound3 from "./assets/note9.mp3";
import sound4 from "./assets/note12.mp3";

const MOCK_API = "https://634e908e4af5fdff3a6070f9.mockapi.io/bestScore";
const MOCK_API_PUT = "https://634e908e4af5fdff3a6070f9.mockapi.io/bestScore/1";

function App() {
  const sounds = [
    document.getElementById("sound1"),
    document.getElementById("sound2"),
    document.getElementById("sound3"),
    document.getElementById("sound4"),
  ];
  const [stateScore, setScore] = useState(0);
  const [stateSequence, setSequence] = useState([]);
  const [stateGuesses, setGuesses] = useState([]);
  const [stateCss, setCss] = useState([]);
  const [stateSound, setSound] = useState(true);
  const [stateOn, setOn] = useState(false);
  const [stateTitle, setTitle] = useState("");
  const [bestScore, setBestScore] = useState(0);

  function sound(panel) {
    if (stateSound && sounds[panel] != null) {
      sounds[panel].play();
    } else {
      window.location.reload();
    }
  }

  function onStart() {
    if (stateSequence.length <= 0) {
      onReset();
      playSequence();
    }
  }

  function onReset() {
    setScore(0);
    setSequence([]);
    setGuesses([]);
    setCss([]);
    setOn(true);
    setTitle("");
  }

  function onSound() {
    setSound(!stateSound);
  }

  function nextSequence() {
    return Math.floor(Math.random() * 4);
  }

  function getClassArray(panel) {
    let css = [];
    for (let i = 0; i < panel; i++) {
      css.push("");
    }
    css.push("active");
    return css;
  }

  function playSequence() {
    let i = 0;
    const sequence = [...stateSequence, nextSequence()];
    // console.log(sequence);
    setSequence(sequence);
    setGuesses([]);
    const id = setInterval(() => {
      blinkPanel(sequence[i++]);
      if (i === sequence.length) clearInterval(id);
    }, 1000);
    // console.log(sequence);
    console.log(sequence);
    // console.log(stateCss);
  }

  function blinkPanel(panel) {
    const css = getClassArray(panel);
    setTimeout(() => {
      setCss(css);
      sound(panel);
    }, 500);
    setTimeout(() => setCss([]), 1000);
  }

  async function updateBestScore() {
    const updateScore = await axios({
      method: "put",
      url: MOCK_API_PUT,
      data: { bestScore: stateScore },
    });
  }

  function panelClick(guess) {
    if (!stateOn) return;
    sound(guess);
    let correct = true;
    const guesses = [...stateGuesses, guess];

    guesses.forEach((g, i) => {
      if (g !== stateSequence[i]) {
        setTitle("Game Over");
        return;
      }
    });

    setGuesses(guesses);

    if (guesses.length === stateSequence.length) {
      stateSequence.forEach((s, i) => {
        if (s !== guesses[i]) correct = false;
      });
      if (correct) {
        setScore((stateScore) => stateScore + 1);
        playSequence();
      }
    }
  }

  function renderTasters() {
    const pans = ["green", "red", "yellow", "blue"];
    return pans.map((panel, i) => {
      const css = `taster ${panel} ${stateCss[i]}`;
      return <div key={i} className={css} onClick={() => panelClick(i)}></div>;
    });
  }

  useEffect(() => {
    (async () => {
      const response = await axios.get(MOCK_API);
      setBestScore(response.data[0].bestScore);
    })();

    if (stateScore > bestScore) {
      updateBestScore();
    }
  }, [stateScore]);

  return (
    <div className="App">
      <div className="bestScore">BEST SCORE: {bestScore}</div>
      <div className="simon">
        <div className="wrapper">{renderTasters()}</div>
      </div>
      <div className="score">{stateTitle || `SCORE: ${stateScore}`}</div>
      <div className="controls">
        {/* <button className="btn-yellow" onClick={() => onSound()}>
          SOUND
        </button> */}
        <button className="btn-red" onClick={() => onReset()}>
          RESET
        </button>
        <button className="btn-blue" onClick={() => onStart()}>
          START
        </button>
      </div>
      <audio id="sound1" src={sound1} preload="auto"></audio>
      <audio id="sound2" src={sound2} preload="auto"></audio>
      <audio id="sound3" src={sound3} preload="auto"></audio>
      <audio id="sound4" src={sound4} preload="auto"></audio>
    </div>
  );
}

export default App;
