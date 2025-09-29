import { useState } from "react"
import { motion } from "framer-motion"

export default function Card(props) {
    return (
        <div className={props.class}
            style={props.styles}>
            {props.src && <img
                src={props.src}
                alt={props.alt}
                onClick={() => props.onCardClick(props.card)} disabled={props.disabled}></img>}
        </div>
    )
}