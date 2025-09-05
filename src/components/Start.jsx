import { useState } from "react"

export default function Start(props) {
    const [showRules, setShowRules] = useState(false)
    function showGameRules() {
        setShowRules(prev => !prev)
    }

    return (
        <div className="start-container">
            <div className="content-container">
                {!showRules &&
                    <>
                    <p className="title">Let's play UNO!</p>
                    <img
                        src="../src/images/UNO-logo.svg"
                        alt="uno logo"
                        onClick={props.onClick}></img>
                    <div className="text-wrapper">
                        <span>C</span>
                        <span>L</span>
                        <span>I</span>
                        <span>C</span>
                        <span>K</span>
                        <span> </span>
                        <span>T</span>
                        <span>O</span>
                        <span> </span>
                        <span>P</span>
                        <span>L</span>
                        <span>A</span>
                        <span>Y</span>
                        <span>!</span>
                    </div>
                </>}
                {showRules &&
                    <div className="rules-container">
                        <p>How to play</p>
                        <ol>
                            <li></li>
                        </ol>
                    </div>
                }
            </div>
        </div>
    )
}