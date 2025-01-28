import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../navbar/navbar"
import { FaUserCircle } from "react-icons/fa"

export default function Profile() {

    let navigate = useNavigate()

    let { username } = useParams()
    let [profileData, setProfileData] = useState({
        username: username,
        email: ""
    })

    useEffect(() => {
        let fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/${username}/profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (response.ok) {
                    let data = await response.json()
                    setProfileData({
                        username: username,
                        email: data.email
                    })
                }
                else {
                    alert("Failed to fetch account details.")
                }
            }
            catch (error) {
                alert("An error occurred while fetching account details.")
            }
        }
        if (username) {
            fetchData()
        }
    }, [username])

    return (
        <div>
            <Navbar />
            <div className="px-36 pt-6 bg-gray-200 pb-6">
                <FaUserCircle className="h-40 w-40 opacity-60 mt-12 p-1 bg-white rounded-full shadow-2xl shadow-gray-700"/>
                <div className="mt-6 text-lg font-medium space-y-1">
                    <p>{profileData.username}</p>
                    <p>{profileData.email}</p>
                    <p onClick={ () => { navigate(`/${username}/profile/updatepassword`); window.localStorage.setItem("email", profileData.email) } } className="w-40 hover:underline hover:scale-110 transition-all duration-200 cursor-pointer">Change password</p>
                </div>
                <div className="flex justify-end -mr-8 cursor-pointer">
                    <p onClick={ () => { navigate("/") } } className="text-blue-500 px-8 py-2 hover:underline text-lg font-medium hover:scale-110 transition-all duration-200">Return to homepage</p>
                </div>
            </div>
        </div>
    )
}