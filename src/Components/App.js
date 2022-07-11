import React from "react";
import { useState } from "react";
import { POSSIBLE_ANSWERS, ROWS_ON_BOARD } from "../Config";
import Board from "./Board";
import Keyboard from "./Keyboard";

const SELECTED_ANSWER = POSSIBLE_ANSWERS[Math.floor(Math.random() * POSSIBLE_ANSWERS.length)].toUpperCase();

const App = () => {
    const [guesses, setGuesses] = useState(Array(ROWS_ON_BOARD).fill(""));
    const [checkedGuesses, setCheckedGuesses] = useState(Array(ROWS_ON_BOARD).fill([]));

    return (
        <div>
            <h1 className="title">RUNESCRDLE</h1>
            <Board guesses={guesses} setGuesses={setGuesses} checkedGuesses={checkedGuesses} setCheckedGuesses={setCheckedGuesses} answer={SELECTED_ANSWER} />
            <Keyboard guesses={guesses} checkedGuesses={checkedGuesses} answer={SELECTED_ANSWER}/>
        </div>
    );
}

export default App;