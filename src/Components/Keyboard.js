import React from "react";
import { useEffect } from "react";
import { LETTER_NOT_PRESENT, LETTER_PRESENT_NOT_HERE, LETTER_CORRECT, CHAR_CODES } from "../Config";

function keyPressSimulate(key) {
    if(key === " "){
        key = "space";
    }
    console.log(key);
    const element = document.getElementById(`key_${key}`);
    if(!element.classList.contains("key_pressed")){
        element.classList.add("key_pressed");
        setTimeout(() => {
            element.classList.remove("key_pressed");
        }, 50);
    }
    
    window.dispatchEvent(new KeyboardEvent('keyup', {
        'key': key,
        'keyCode': CHAR_CODES[key]
    }));
}

const Keyboard = ({ guesses, checkedGuesses, answer }) => {

    useEffect(() => {
        const keyUpFn = (ev) => {

        };

        window.addEventListener("keyup", keyUpFn);

        return () => window.removeEventListener("keyup", keyUpFn);
    }, [])


    var keyString = "1234567890() QWERTYUIOP ASDFGHJKL ZXCVBNM <_>";
    var keys = keyString.split("");
    var keybreaks = 0;

    var keysOnBoard = keys.map(key => {
        if (key === " ") {
            return (
                <div className="keyBreak" key={`keybreaks-${keybreaks++}`}></div>
            );
        }

        if(key === "_"){
            key = " "
        }

        if(key === "<"){
            key = "ENTER"
        }

        if(key === ">"){
            key = "BACKSPACE"
        }

        let cssclass = "";

        if(guesses && guesses.length > 0){
            for (let i = 0; i < answer.length; i++) {
                for (var j = 0; j < answer.length; j++) {
                    if (guesses[i] && guesses[i].length === answer.length && checkedGuesses[i].length === answer.length) {
                        if (guesses[i][j] === key) {
                            cssclass = checkedGuesses[i][j] === LETTER_CORRECT ? " correct" : checkedGuesses[i][j] === LETTER_PRESENT_NOT_HERE ? " present" : checkedGuesses[i][j] === LETTER_NOT_PRESENT ? " wrong" : ""
                        }
                    }
                }
            }
        }

        if(key === " "){
            return(
                <div className={`key${cssclass}`} key={`key_space`} id={`key_space`} onClick={() => { keyPressSimulate(" ") }}>SPACE</div>
            );
        }

        if(key === "ENTER"){
            return(
                <div className={`key`} key={`key_enter`} id={`key_enter`} onClick={() => { keyPressSimulate("enter") }}>ENTER</div>
            );
        }

        if(key === "BACKSPACE"){
            return(
                <div className={`key`} key={`key_backspace`} id={`key_backspace`} onClick={() => { keyPressSimulate("backspace") }}>←</div>
            );
        }

        return (
            <div className={`key${cssclass}`} key={`key_${key}`} id={`key_${key}`} onClick={() => { keyPressSimulate(key) }}>{key}</div>
        );
    });
    return (
        <div className="keyboard">
            {keysOnBoard}
        </div>
    );
};

export default Keyboard;