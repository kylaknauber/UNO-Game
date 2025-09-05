import { useState } from "react"
import { db } from "../firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function UserInfo(props) {
    const [userName, setUserName] = useState("")
    const currentDate = new Date()
    function handleChange(e) {
        setUserName(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        console.log(userName + " after submitting")
        addNewData(userName, props.score)
        props.noSaveScore()
    }

    async function addNewData(userName, score) {
        try {
            const docRef = await addDoc(collection(db, "scores"), {
                name: userName,
                score: score,
                date: serverTimestamp()
            })
            console.log("Document: " + docRef.id)
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="user-info-container">
            {!props.isSave &&
                <div className="question">
                <p>Save Score?</p>
                <div>
                    <button onClick={props.saveScore}>Yes</button>
                    <button onClick={props.noSaveScore}>No</button>
                </div>
            </div>}
            {props.isSave && <div className="form-container">
                <p>Submit Your Score</p>
                <form onSubmit={handleSubmit}>
                    <label>Name: 
                        <input type="text"
                            name="userName"
                            value={userName}
                            onChange={handleChange}
                            placeholder="e.g. 'John'"></input>
                    </label>
                    <p>Score: {props.score}</p>
                    <p>Date: {currentDate.toLocaleDateString()}</p>
                    <button type="submit">Submit</button>
                </form>
            </div>}
        </div>
    )
}