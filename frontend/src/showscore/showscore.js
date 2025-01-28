import { useParams} from "react-router-dom"
import { useEffect, useState } from "react"
import img from "../gauge.png"
import Navbar from "../navbar/navbar"

export default function ShowScore() {

    let { username, id } = useParams()
    let [creditScoreData, setCreditScoreData] = useState(null)
    
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:8080/${username}/showscore/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json()
            console.log(data)
            setCreditScoreData(data)
        }
        fetchData()
    },[username, id])

    return (
        <div>
            <Navbar/>
            <div className="bg-gray-200 px-36">
                <div className="pt-20">
                    <img src={img} alt="credit-score chart" className="h-[600px] w-[600px]"/>
                </div>
            </div>
        </div>
    )
}