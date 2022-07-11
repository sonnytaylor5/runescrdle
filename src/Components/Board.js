import React from "react";
import { useState, useEffect } from "react";
import { LETTER_NOT_PRESENT, LETTER_PRESENT_NOT_HERE, LETTER_CORRECT, CHAR_CODES } from "../Config";

const Board = ({ guesses, setGuesses, checkedGuesses, setCheckedGuesses, answer }) => {
    const [currentGuess, setCurrentGuess] = useState([]);
    const [currentGuessCount, setCurrentGuessCount] = useState(0);

    function getOccurrence(value, array) {
        let count = 0;
        array.forEach((v) => (v === value && count++));
        return count;
    }

    useEffect(() => {
        function compareWords(word, answer) {
            const wordArray = word.split("");
            const answerArray = answer.split("");
            const response = Array(answerArray.length).fill(LETTER_NOT_PRESENT);

            for (let i = 0; i < wordArray.length; i++) {
                // First check to see if guessed letter is present at same index as answer letter
                if (wordArray[i] === answerArray[i]) {
                    response[i] = LETTER_CORRECT;
                }
            }

            for (let i = 0; i < wordArray.length; i++) {
                // First check to see if guessed letter is present at same index as answer letter - skip if so
                if (wordArray[i] === answerArray[i]) {
                    continue;
                }

                // Check to see if guessed letter is present in the whole word at least once
                if (getOccurrence(wordArray[i], answerArray) >= 1) {
                    // Check to see if letter appears in word more than once
                    if (getOccurrence(wordArray[i], answerArray) >= 2) {
                        // Check to see if all other instances of the letter in the word are green
                        for (let j = 0; j < wordArray.length; j++) {

                            // We have found an instance where the currently checked letter is present in the answer but not in the correct space
                            if (answer[j] === wordArray[i] && response[i] === LETTER_NOT_PRESENT) {
                                response[i] = LETTER_PRESENT_NOT_HERE;
                            }
                        }
                    } else {
                        response[i] = LETTER_PRESENT_NOT_HERE;
                    }
                }
            }
            return response;
        }

        function addClassToKeyboardKey(key){
            console.log(key);
            const element = document.getElementById(`key_${key}`);
            if(!element.classList.contains("key_pressed")){
                element.classList.add("key_pressed");
                setTimeout(() => {
                    element.classList.remove("key_pressed");
                }, 50);
            }
        }

        const keyboardPressedKeyUp = (e) => {

            if (e.key === "Enter") {
                if (currentGuess.length === answer.length) {
                    // Get current array of guesses and add the current guess to the array
                    const updatedGuesses = [...guesses];
                    updatedGuesses[currentGuessCount] = currentGuess.join("");
                    setGuesses(updatedGuesses);
                    setCurrentGuess([]);

                    // Get most recent guess and compare it to the answer, update the checked answers array with the enumeration information (whether the letter is in the correct place or not)
                    const updatedCheckedGuesses = [...checkedGuesses];
                    updatedCheckedGuesses[currentGuessCount] = compareWords(guesses[currentGuessCount], answer);
                    setCheckedGuesses(updatedCheckedGuesses);

                    // Increment the currentGuessCount so the next guess is on the row below on the board.
                    setCurrentGuessCount(currentGuessCount => currentGuessCount + 1);
                    addClassToKeyboardKey("enter");
                } else {
                    // Alert that the whole row must be filled in
                    return;
                }

            }

            if (e.key === "Backspace") {
                let updatedCurrentGuess = currentGuess.slice(0, currentGuess.length - 1);
                setCurrentGuess(updatedCurrentGuess);
                setGuesses(guesses => {
                    guesses[currentGuessCount] = updatedCurrentGuess;
                    return guesses;
                });
                addClassToKeyboardKey("backspace");
                return;
            }

            if (CHAR_CODES[e.key.toUpperCase()] !== undefined) {
                if(currentGuess.length === answer.length){
                    return;
                }
                let updatedCurrentGuess = [...currentGuess, e.key.toUpperCase()];
                setCurrentGuess(updatedCurrentGuess);
                setGuesses(guesses => {
                    guesses[currentGuessCount] = updatedCurrentGuess.join("");
                    return guesses;
                });
                addClassToKeyboardKey(e.key.toUpperCase() === " " ? "space" : e.key.toUpperCase());
            } else {
                // Some other key entered that we do not care about
                return;
            }
        };
        window.addEventListener("keyup", keyboardPressedKeyUp);
        return () => {
            window.removeEventListener("keyup", keyboardPressedKeyUp);
        }
    }, [answer, checkedGuesses, currentGuess, currentGuessCount, guesses, setCheckedGuesses, setGuesses]);

    const rowsOfTiles = guesses.map((guess, index) => {
        const tiles = [];

        // Create a tile for each letter in the answer
        for (let i = 0; i < answer.length; i++) {
            // These are added if we have a checked guess at the current index
            let tileCssClass = "";
            switch (checkedGuesses[index][i]) {
                case 0:
                    tileCssClass = "wrong";
                    break;
                case 1:
                    tileCssClass = "present";
                    break;
                case 2:
                    tileCssClass = "correct";
                    break;
                default:
                    break;
            };
            // If there is a letter present, include the css class 'added' 
            const added = guess[i] ? "added" : "";
            tiles.push(
                <div key={`tile${i}`} className={`tile ${tileCssClass} ${added}`}>
                    {guess[i] === " " ? "_" : guess[i]}
                </div>
            );
        }

        return (
            <div className="line" key={`guess_${index}`}>
                {tiles}
            </div>
        );
    });

    return (
        <div className="board">
            {rowsOfTiles}
        </div>
    );
};

export default Board;