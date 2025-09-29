import { useState, useEffect } from 'react'
import { cards } from "./cards"
import { shuffleDeck } from "./functions"
import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import UnoCardBack from "./images/UnoCardBack.png"
import BluePlain from "./images/Blue.png"
import GreenPlain from "./images/Green.png"
import RedPlain from "./images/Red.png"
import YellowPlain from "./images/Yellow.png"
import Card from "./components/Card"
import Header from './components/Header'
import Start from './components/Start'
import GameOver from "./components/GameOver"

function App() {
    const shuffledCards = shuffleDeck(cards)
    const validCard = false;

    // Variable used to determine whether Opponent or Player begins the game
    const randomChoice = Math.floor(Math.random() * 2)

    // State variables for the cards
    const [currentPlayerCards, setCurrentPlayerCards] = useState(() => initialPlayerCards())
    const [currentOpponentCards, setCurrentOpponentCards] = useState(() => initialOpponentCards())
    const [remainingDeck, setRemainingDeck] = useState(() => initialRemainingDeck())
    const [usedDeck, setUsedDeck] = useState([])

    const [startGame, setStartGame] = useState(false)
    const [messageNeeded, setMessageNeeded] = useState(false)
    const [playerTurn, setPlayerTurn] = useState(randomChoice === 0 ? true : false)
    const [count, setCount] = useState(0)
    const [score, setScore] = useState(0)
    const [draw2Helper, setDraw2Helper] = useState(true)
    const [opponentSpecialCard, setOpponentSpecialCard] = useState(0)
    const [playerPlacedWildCard, setPlayerPlacedWildCard] = useState(false)
    const [playerPickedColor, setPlayerPickedColor] = useState(false)
    const [opponentJustDrew2, setOpponentJustDrew2] = useState(false)

    // State variables for animation
    const [isFlipped, setIsFlipped] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [pendingDrawCard, setPendingDrawCard] = useState(null)
    const [flipPhase, setFlipPhase] = useState("idle")

    // State variables for when the game begins and ends
    const [initTurn, setInitTurn] = useState(null)
    const [showMessageBoxInit, setShowMessageBoxInit] = useState(true)
    const [quit, setQuit] = useState(false)
    const [isSaveScore, setIsSaveScore] = useState(false)

    const opponentWon = currentOpponentCards.length === 0
    const playerWon = currentPlayerCards.length === 0
    const gameOver = opponentWon || playerWon

    function resetWildCards() {
        shuffledCards.forEach(card => {
            if (card.value === "wild") {
                card.color = "multiple"
                card.src = "./src/images/Wild.png"
            }
        });
    }
    
    function initialPlayerCards() {
        resetWildCards()
        return shuffledCards.slice(0,7)
    }

    function initialOpponentCards() {
        resetWildCards()
        return shuffledCards.slice(7,14)
    }

    function initialRemainingDeck() {
        resetWildCards()
        return shuffledCards.slice(14)
    }

    // Play card function for player
    function playCard(card) {
        console.log(card)
        setPlayerPlacedWildCard(false)
        setPlayerPickedColor(false)
        setDraw2Helper(true)

        // Only allow plays when player's turn 
        if (playerTurn) {
            if (usedDeck.length === 0 || card.value === "wild" || card.color === usedDeck[usedDeck.length - 1].color || card.value === usedDeck[usedDeck.length - 1].value) {
                setMessageNeeded(false)
                setCurrentPlayerCards(prevCards => {
                    return (
                        prevCards.filter(item => item.id !== card.id)
                    )
                })
                setUsedDeck(prevUsed => {
                    return (
                        [...prevUsed, card]
                    )
                })
                if (card.value === "skip") {
                    skipCard()
                }
                else if (card.value === "reverse") {
                    reverseCard()
                }
                else if (card.value === "wild") {
                    setPlayerPlacedWildCard(true)
                }
                else if (card.value === "draw 2") {
                    console.log("opponent draw 2!")
                    setDraw2Helper(true)
                    setTimeout(() => setPlayerTurn(false), 500)
                    setOpponentJustDrew2(false)
                }
                else {
                    setTimeout(() => setPlayerTurn(false), 500)
                }
            }
            else {
                setMessageNeeded(true)
            }
            setCount(prev => prev + 1)
        }
    }

    // Draw card function for player
    function drawCard(card) {
        // Only allow draws when it is player's turn
        if (playerTurn) {
            // Update before deck runs out!
            if (remainingDeck.length === 2) {
                setRemainingDeck(prevDeck => {
                    const bottomOfUsedDeck = usedDeck.filter(item => item !== usedDeck[usedDeck.length - 1])
                    const bottomShuffled = shuffleDeck(bottomOfUsedDeck)
                    bottomShuffled.forEach(card => {
                        if (card.value === "wild") {
                            card.color = "multiple"
                            card.src = "./src/images/Wild.png"
                        }
                    })
                    return (
                        [...prevDeck, ...bottomShuffled]
                    )
                })
                setUsedDeck([usedDeck[usedDeck.length - 1]])
            }

            if (remainingDeck.length > 0) {
                if (!isAnimating) {
                    setIsFlipped(!isFlipped)
                    setIsAnimating(true)
                }
                setCurrentPlayerCards(prevCards => {
                    return (
                        [...prevCards, card]
                    )
                })
                setRemainingDeck(prevDeck => {
                    return (
                        prevDeck.filter(item => item.id !== card.id)
                    )
                })             
                setTimeout(() => setPlayerTurn(false), 500)
            }
            setCount(prev => prev + 1)
            setPlayerPlacedWildCard(false)
            setPlayerPickedColor(false)
            setTimeout(() => setPlayerTurn(false), 500)
        }
    }

    function opponentPlayCard() {
        setPlayerPlacedWildCard(false)
        setPlayerPickedColor(false)

        // If player places draw 2 card, then this executes for the opponent
        if (usedDeck.length > 0 && draw2Helper && !opponentJustDrew2 && usedDeck[usedDeck.length - 1].value === "draw 2") {
            // Updates remaining deck before it runs out
            if (remainingDeck.length === 2) {
                setRemainingDeck(prevDeck => {
                    const bottomOfUsedDeck = usedDeck.filter(item => item !== usedDeck[usedDeck.length - 1])
                    const bottomShuffled = shuffleDeck(bottomOfUsedDeck)
                    bottomShuffled.forEach(card => {
                        if (card.value === "wild") {
                            card.color = "multiple"
                            card.src = "./src/images/Wild.png"
                        }
                    })
                    return (
                        [...prevDeck, ...bottomShuffled]
                    )
                })
                setUsedDeck([usedDeck[usedDeck.length - 1]])
            }

            if (remainingDeck.length > 0) {
                setCurrentOpponentCards(prevCards => {
                    return (
                        [...prevCards, remainingDeck[0], remainingDeck[1]]
                    )
                })
                setRemainingDeck(prevDeck => {
                    console.log(remainingDeck[0] + " " + remainingDeck[1])
                    return (
                        prevDeck.filter(item => item.id !== remainingDeck[0].id && item.id !== remainingDeck[1].id)
                    )
                })
                setTimeout(() => setPlayerTurn(true), 500)
            }
            setOpponentJustDrew2(true)
        }

        else {
            for (let i = 0; i < currentOpponentCards.length; i++) {
              setDraw2Helper(false)
            if (usedDeck.length === 0 ||
                currentOpponentCards[i].value === "wild" ||
                currentOpponentCards[i].value === usedDeck[usedDeck.length - 1].value ||
                currentOpponentCards[i].color === usedDeck[usedDeck.length - 1].color) {
                setCurrentOpponentCards(prevCards => {
                    return (
                        prevCards.filter(item => item.id !== currentOpponentCards[i].id)
                    )
                })
                setUsedDeck(prevUsed => {
                    return (
                        [...prevUsed, currentOpponentCards[i]]
                    )
                })
                if (currentOpponentCards[i].value === "skip") {
                    console.log("opponent placed skip")
                    setOpponentSpecialCard(prev => prev + 1)
                    skipCard()
                }
                else if (currentOpponentCards[i].value === "reverse") {
                    console.log("opponent placed reverse")
                    setOpponentSpecialCard(prev => prev + 1)
                    reverseCard()
                }
                else if (currentOpponentCards[i].value === "wild") {
                    console.log("opponent placed wild")
                    const wild = currentOpponentCards[i]
                    const timerForFunc = setTimeout(() => opponentWild(wild), 2000);
                    //return () => clearTimeout(timerForFunc)
                    setTimeout(() => setPlayerTurn(true), 500)
                }
                else if (currentOpponentCards[i].value === "draw 2") {
                    console.log("opponent places draw 2")
                    setTimeout(() => playerDraw2(), 1000);
                }
                else {
                    setTimeout(() => setPlayerTurn(true), 500)
                }
        
                break;
            }
            else if (i === currentOpponentCards.length - 1) {
                opponentDrawCard()
            }
        }}   
    }

    function opponentDrawCard() {
        setPlayerPlacedWildCard(false)
        setPlayerPickedColor(false)

        // Update before deck runs out!
        if (remainingDeck.length === 2) {
            setRemainingDeck(prevDeck => {
                const bottomOfUsedDeck = usedDeck.filter(item => item !== usedDeck[usedDeck.length - 1])
                const bottomShuffled = shuffleDeck(bottomOfUsedDeck)
                bottomShuffled.forEach(card => {
                    if (card.value === "wild") {
                        card.color = "multiple"
                        card.src = "./src/images/Wild.png"
                    }
                })
                return (
                    [...prevDeck, ...bottomShuffled]
                )
            })
            setUsedDeck([usedDeck[usedDeck.length - 1]])
        }

        if (remainingDeck.length > 0) {
            setCurrentOpponentCards(prevCards => {
                return (
                    [...prevCards, remainingDeck[0]]
                )
            })
            setRemainingDeck(prevDeck => {
                return (
                    prevDeck.filter(item => item.id !== remainingDeck[0].id)
                )
            })
            setTimeout(() => setPlayerTurn(true), 500)
        }
        setDraw2Helper(true)
    }

    /**
     * Special card functions
     */
    function skipCard() {
        if (!playerTurn) {
            setPlayerTurn(false)
        }
        else {
            setPlayerTurn(true)
        }
    }
    function reverseCard() {
        if (playerTurn) {
            setPlayerTurn(true)
        }
        else {
            setPlayerTurn(false)
        }
    }

    // Player draws two, computer automatically gives player the top two cards from the deck
    function playerDraw2() {
        if (remainingDeck.length === 2) {
            setRemainingDeck(prevDeck => {
                prevDeck.forEach(card => {
                    if (card.value === "wild") {
                        card.color = "multiple"
                        card.src = "./src/images/Wild.png"
                    }
                })
                const bottomOfUsedDeck = usedDeck.filter(item => item !== usedDeck[usedDeck.length - 1])
                const bottomShuffled = shuffleDeck(bottomOfUsedDeck)
                bottomShuffled.forEach(card => {
                    if (card.value === "wild") {
                        card.color = "multiple"
                        card.src = "./src/images/Wild.png"
                    }
                })
                return (
                    [...prevDeck, ...bottomShuffled]
                )
            })
            setUsedDeck([usedDeck[usedDeck.length - 1]])
        }

        if (remainingDeck.length > 0) {
            setCurrentPlayerCards(prevCards => {
                return (
                    [...prevCards, remainingDeck[0], remainingDeck[1]]
                )
            })
            setRemainingDeck(prevDeck => {
                console.log(remainingDeck[0] + " " + remainingDeck[1])
                return (
                    prevDeck.filter(item => item.id !== remainingDeck[0].id && item.id !== remainingDeck[1].id)
                )
            })
            setTimeout(() => setPlayerTurn(false), 500)
        }
    }

    // Function for when the player picks the color they want the deck to be after placing a wild card
    function changeColor(id) {
        const wild = usedDeck[usedDeck.length - 1]
        setUsedDeck(prevUsed => {
            return (
                prevUsed.filter(card => card !== wild)
            )
        })
        if (id === 1) { // BLUE
            wild.src = BluePlain
            wild.color = "blue"
            setUsedDeck(prevUsed => {
                return (
                    [...prevUsed, wild]
                )
            })
            setTimeout(() => setPlayerTurn(false), 500)
            setPlayerPickedColor(true)
            setPlayerPlacedWildCard(false)
        }
        else if (id === 2) { // GREEN
            wild.src = GreenPlain
            wild.color = "green"
            setUsedDeck(prevUsed => {
                return (
                    [...prevUsed, wild]
                )
            })
            setTimeout(() => setPlayerTurn(false), 500)
            setPlayerPickedColor(true)
            setPlayerPlacedWildCard(false)
        }
        else if (id === 3) { // RED
            wild.src = RedPlain
            wild.color = "red"
            setUsedDeck(prevUsed => {
                return (
                    [...prevUsed, wild]
                )
            })
            setTimeout(() => setPlayerTurn(false), 500)
            setPlayerPickedColor(true)
            setPlayerPlacedWildCard(false)
        }
        else if (id === 4) { // YELLOW
            wild.src = YellowPlain
            wild.color = "yellow"
            setUsedDeck(prevUsed => {
                return (
                    [...prevUsed, wild]
                )
            })
            setTimeout(() => setPlayerTurn(false), 500)
            setPlayerPickedColor(true)
            setPlayerPlacedWildCard(false)
        }

    }

    // Function which determines which color the opponent chooses to make the deck after placing a wild card
    function opponentWild(wild) {
        const colors = ["blue", "green", "red", "yellow"]
        const randomColor = Math.floor(Math.random() * 4)

        console.log(wild)
        setUsedDeck(prevUsed => {
            return (
                prevUsed.filter(card => card !== wild)
            )
        })
        if (colors[randomColor] === "blue") {
            
            wild.src = BluePlain
            wild.color = "blue"
            setUsedDeck(prevUsed => {
                return (
                    [...prevUsed, wild]
                )
            })
        }
        else if (colors[randomColor] === "green") {
            wild.src = GreenPlain
            wild.color = "green"
            setUsedDeck(prevUsed => {
                return (
                    [...prevUsed, wild]
                )
            })
        }
        else if (colors[randomColor] === "red") {
            wild.src = RedPlain
            wild.color = "red"
            setUsedDeck(prevUsed => {
                return (
                    [...prevUsed, wild]
                )
            })
        }
        else if (colors[randomColor] === "yellow") {
            wild.src = YellowPlain
            wild.color = "yellow"
            setUsedDeck(prevUsed => {
                return (
                    [...prevUsed, wild]
                )
            })
        }
    }
    
    /**
     * React elements for player, opponent, remaining deck, used deck, wild card color picker elements, and the initial turn display box
     */
    const playerCardElements = currentPlayerCards.map(card => {
        return (
            <Card
                class="player-card"
                src={card.src}
                alt={card.alt}
                value={card.value}
                color={card.color}
                key={card.id}
                onCardClick={playCard}
                id={card.id}
                card={card}
            />
        )
    })
    const opponentCardElements = currentOpponentCards.map(card => {
        return (
            <Card
                class="opponent-card"
                src={UnoCardBack}
                alt="opponent card"
                value={card.value}
                color={card.color}
                key={card.id}
            />
        )
    })

    function updateRemainingDeck() {
        const card = remainingDeck[0]
        const showFront = flipPhase === "reveal"
        const showBack = flipPhase !== "reveal"

        const backStyles = {
            backfaceVisibility: "hidden", position: "absolute"
        }

        const frontStyles = {
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            position: "absolute",
        }

        return (
            <div className="for-flip">
                <motion.div
                    className="flip-card-inner"
                    animate={{ rotateY: flipPhase === "reveal" ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: "easeIn" }}
                    
                    onClick={() => {
                        if (!isAnimating && playerTurn) {
                            setPendingDrawCard(remainingDeck[0])
                            setFlipPhase("reveal")
                            //setIsFlipped(true);
                            setIsAnimating(true);
                            //setTimeout(() => drawCard(remainingDeck[0]), 1000); // slight delay to sync with flip
                                }
                    }}
                    onAnimationComplete={() => {
                        if (flipPhase === "reveal") {
                            setTimeout(() => setFlipPhase("hide"), 300); // fade out after reveal
                        } else if (flipPhase === "hide") {
                            drawCard(pendingDrawCard);  // update state
                            setPendingDrawCard(null);
                            setFlipPhase("idle");
                            setIsAnimating(false);
                        } // reset for next animation
                    }}
                            >
                    {flipPhase !== "reveal" && <Card
                        class="remaining-deck"
                        src={UnoCardBack}
                        alt="remaining deck back"
                        value={remainingDeck[0].value}
                        color={remainingDeck[0].color}
                        card={remainingDeck[0]}
                        styles={backStyles}
                    />}
                    {flipPhase === "reveal" && pendingDrawCard && <Card
                        class="remaining-deck-front"
                        src={remainingDeck[0].src}
                        alt="remaining deck back"
                        value={remainingDeck[0].value}
                        color={remainingDeck[0].color}
                        card={remainingDeck[0]}
                        styles={frontStyles}
                        />}
                </motion.div>
            </div>
            /**
             * <Card
                class="remaining-deck"
                src={UnoCardBack}
                alt="remaining deck"
                value={remainingDeck[0].value}
                color={remainingDeck[0].color}
                card={remainingDeck[0]}
                onClick={drawCard}
            />
             */
        )
    }
    const deck = updateRemainingDeck()

    function updateUsedDeck() {
        if (usedDeck.length > 0) {
            return (
                <Card
                    class="used-deck"
                    src={usedDeck[usedDeck.length - 1].src}
                    alt={usedDeck[usedDeck.length - 1].color + " " + usedDeck[usedDeck.length - 1].value}
                    value={usedDeck[usedDeck.length - 1].value}
                    color={usedDeck[usedDeck.length - 1].color}
                />
            )
        }
    }
    const used = updateUsedDeck()

    function wildCardColorPicker() {
        return (
            <div className="wild-card-info">
                <p>Choose a color:</p>
                <div
                    style={{ opacity: 1 }}
                    className="color-picker-container">
                    <button

                        className="color-picker-button"
                        style={{ backgroundColor: "#0849A3" }}
                        onClick={() => changeColor(1)}></button>
                    <button

                        className="color-picker-button"
                        style={{ backgroundColor: "#328A0F" }}
                        onClick={() => changeColor(2)}></button>
                    <button

                        className="color-picker-button"
                        style={{ backgroundColor: "#C40B00" }}
                        onClick={() => changeColor(3)}></button>
                    <button

                        className="color-picker-button"
                        style={{ backgroundColor: "#E8D005" }}
                        onClick={() => changeColor(4)}></button>
                </div>
            </div>
        )
    }
    const wildCardColorPickerElements = wildCardColorPicker()

    function determineInitialTurn() {
        return (
            <motion.div
                className="init-turn-container"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0, }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <p>Determining turn</p>
                <p>{!initTurn ? "..." : `${initTurn}` + "'s turn!"}</p>
            </motion.div>
        )
    }
    const initTurnElement = determineInitialTurn()

    /**
     * Functions for the buttons in the game
     */
    function beginGameButton() {
        setStartGame(prev => !prev)
    }

    // Player decides to click "Exit Game"
    function quitGame() {
        setQuit(true)
    }

    // Player decides to click "Play Again"
    function playAgain() {
        setCurrentOpponentCards(initialOpponentCards())
        setCurrentPlayerCards(initialPlayerCards())
        setRemainingDeck(initialRemainingDeck())
        setUsedDeck([])
        setCount(0)
        setShowMessageBoxInit(true)
        setInitTurn(null)
    }

    // Player decides to click "Yes" to save their score
    function saveScore() {
        setIsSaveScore(true)
    }

    // Player decides to click "No" to decline saving their score, and simply exits the game
    function noSaveScore() {
        setIsSaveScore(false)
        setStartGame(false)
        setCurrentOpponentCards(initialOpponentCards())
        setCurrentPlayerCards(initialPlayerCards())
        setRemainingDeck(initialRemainingDeck())
        setUsedDeck([])
        setCount(0)
        setScore(0)
        setShowMessageBoxInit(true)
        setInitTurn(null)
        setQuit(false)
    }

    /**
     * useEffect functions
     */
    useEffect(() => {
        if (!startGame || gameOver || showMessageBoxInit) return
        console.log("in use Effect")
        if (!playerTurn && count === 0) {
            const timerForFunc = setTimeout(opponentPlayCard, 5000);
            return () => clearTimeout(timerForFunc)
        }
        else if (!playerTurn && !gameOver) {
            const timerForFunc = setTimeout(opponentPlayCard, 3000);
            return () => clearTimeout(timerForFunc)
        }
    }, [currentPlayerCards, opponentSpecialCard, playerPickedColor, playerTurn, startGame, gameOver, showMessageBoxInit])

    useEffect(() => {
        if (startGame && !gameOver) {
            const firstTimer = setTimeout(() => {
                setInitTurn(playerTurn ? "Player" : "Opponent")
            }, 4000)

            const secondTimer = setTimeout(() => {
                setShowMessageBoxInit(false)
            }, 6000)

            return () => {
                clearTimeout(firstTimer)
                clearTimeout(secondTimer)
            }
        }
    }, [startGame, gameOver, playerTurn])

    useEffect(() => {
        if (gameOver && playerWon) {
            setScore(prev => prev + 1)
        }
    }, [startGame, playerWon, opponentWon, gameOver])

    console.log(currentPlayerCards)
    console.log(currentOpponentCards)
    console.log(usedDeck)
    console.log(remainingDeck)

    return (
        <>
            {!startGame && !gameOver && <Start
                onClick={beginGameButton}
            />}
            {startGame && !gameOver &&
                <>
                <Header />
                <div className="main-main">
                    <main
                        style={{ opacity: playerPlacedWildCard || showMessageBoxInit ? 0.3 : 1 }}
                        className="main-container">
                        <div title="Opponent's cards"
                            style={{
                                backgroundColor: !playerTurn ? "rgba(255, 255, 255, 0.2)" : "rgba(0,0,0, 0.1)",
                                boxShadow: !playerTurn ? "box-shadow : rgba(255, 255, 255, 0.2) 0px 5px 15px" : "box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)"   }}
                            className="opponent-container">
                            {opponentCardElements}
                        </div>
                        <div className="deck-container">
                            <div className="remaining-container">
                                {deck}
                            </div>
                            <div className="used-container">
                                {used}
                            </div>
                        </div>
                        {messageNeeded &&
                            <div className="message-box">
                                {!validCard &&
                                    <>
                                        <img src="./src/images/caution.svg"></img>
                                        <p>Choose a different card!</p>
                                    </>}
                            </div>}
                        <div title="Your cards"
                            style={{
                                backgroundColor: playerTurn ? "rgba(255, 255, 255, 0.2)" : "rgba(0,0,0, 0.1)",
                                boxShadow: playerTurn ? "box-shadow : rgba(255, 255, 255, 0.2) 0px 5px 15px" : "box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)"
                            }}
                            className="player-container">
                            {playerCardElements}
                        </div>

                    </main>
                    {playerPlacedWildCard && wildCardColorPickerElements}
                    <AnimatePresence>
                        {startGame && !gameOver && showMessageBoxInit && initTurnElement}
                    </AnimatePresence>
                </div>
                </>}
            {gameOver && <GameOver
                isWinner={playerWon}
                score={score}
                restart={playAgain}
                quit={quitGame}
                isQuit={quit}
                saveScore={saveScore}
                noSaveScore={noSaveScore}
                isSave={isSaveScore}
            />}
        </>
    )
}

export default App
