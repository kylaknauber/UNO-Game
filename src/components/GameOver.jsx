import { useState } from "react"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"
import UserInfo from "./UserInfo"

export default function GameOver(props) {
    
    const { width, height } = useWindowSize()

    return (
        <div className="gameover-main">
            {props.isWinner && <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={1000}
            />}
            <div
                style={{ opacity: props.isQuit ? 0.3 : 1 }}
                className="gameover-container">
                <div>
                    <div className="score">
                        <h5>Your Score</h5>
                        <p className="score-value">{props.score === 1 ? `${props.score} game won` : `${props.score} games won`}</p>
                    </div>
                    <div className="info">
                        <p className="title">Game Over!</p>
                        <p>{props.isWinner ? "You win!" : "You lose. Better luck next time."}</p>
                        <div className="button-container">
                            <button onClick={props.restart}>Play Again</button>
                            <button onClick={props.quit}>Exit Game</button>
                        </div>
                    </div>
                    
                </div>
            </div>
            {props.isQuit &&
                <UserInfo
                    score={props.score}
                    saveScore={props.saveScore}
                    noSaveScore={props.noSaveScore}
                    isSave={props.isSave}
                />}
        </div>
    )
}