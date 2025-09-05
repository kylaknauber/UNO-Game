//import { cards } from "./cards"

export function shuffleDeck(cards) {
    for (let i = 0; i < cards.length - 1; i++) {
        const j = Math.floor(Math.random() * (cards.length - 1))
        const temp = cards[i]
        cards[i] = cards[j]
        cards[j] = temp
    }
    return cards
}


export function drawCard(deck) {
    return deck.shift()
}


//export function playCard(card) { }