import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "../navbar/navbar"
import DetailedCS from "../detailedCS/detailedcreditscore"

export default function History() {

    let navigate = useNavigate()

    let { username } = useParams()
    let [creditScores, setCreditScores] = useState([])
    let [allScores, setAllScores] = useState(null)
    let [isClicked, setIsClicked] = useState(false)

    useEffect(() => {
        let fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/${username}/history`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (response.ok) {
                    const data = await response.json()
                    setCreditScores(data.allcreditscores)
                }
                else {
                    alert("Failed to fetch credit scores.")
                }
            }
            catch (error) {
                alert("An error occurred while fetching credit scores.")
            }
        }
        if (username) {
            fetchData()
        }
    }, [username])

    async function handleClick(record) {
        if(record === allScores){
            setIsClicked(prev => !prev)
        }
        else {
            setAllScores(record);
            setIsClicked(true);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='px-36 bg-gray-200 py-5 max-xl:px-20 max-lg:px-8 max-md:px-4'>
                <p className="text-3xl font-semibold">History</p>
                <div className="flex">
                    <div className="mt-10 mr-20">
                        <div>
                            <p className="text-2xl font-medium">Past Credit Score Retrievals</p>
                            <ol className="text-lg w-80 mt-6">
                                {creditScores.length > 0 ?
                                    (creditScores.slice().reverse().map((record) => (
                                        <li key={record._id} onClick={() => handleClick(record)} className="flex flex-col bg-white px-4 py-4 rounded-lg mb-5 cursor-pointer hover:scale-110 transition-all duration-200">
                                            Credit Score: {record.creditscore}
                                            <p className="self-end text-sm -mt-3">{record.date.slice(0, 16)}</p>
                                        </li>
                                    )))
                                    :
                                    <li>No credit score history found</li>
                                }
                            </ol>
                        </div>
                    </div>
                    {isClicked ? <DetailedCS creditScores={allScores} /> : null}
                </div>
                <div className="mt-10">
                        <p className="text-2xl font-medium">Saved loan recommendations</p>
                        <p className="text-lg mt-6">No saved loan recommendations</p>
                    </div>
                <div>
                    <button onClick={() => navigate("/")} className="bg-blue-700 rounded-md h-10 mt-12 w-52 text-white font-medium hover:scale-110 transition-all duration-200">Get your Credit Score</button>
                </div>
                <div className="flex justify-end -mr-8 cursor-pointer">
                    <p onClick={() => { navigate("/") }} className="text-blue-500 px-8 py-2 hover:underline text-lg font-medium hover:scale-110 transition-all duration-200 max-sm:text-base max-sm:mt-3">Return to homepage</p>
                </div>
            </div>
        </div>
    )
}