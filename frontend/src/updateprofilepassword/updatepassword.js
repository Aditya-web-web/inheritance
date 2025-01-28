import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import img from "../images/cross.png"

export default function UpdatePassword() {

    let navigate = useNavigate()

    let { username } = useParams()
    let [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })

    async function updatePassword(e) {
        e.preventDefault()
        if(passwordData.newPassword.length < 8) {
            alert("Password must have atleast 8 digits.")
            return
        }
        if(passwordData.newPassword !== passwordData.confirmNewPassword) {
            alert("Make sure the new password match.")
            return
        }
        try {
            const response = await fetch(`http://localhost:8080/${username}/profile/updatepassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(passwordData)
            })
            if (response.status === 200) {
                alert("Password updated successfully !")
                navigate(`/${username}/profile`)
            }
            else {
                alert("Old password is incorrect.")
            }
        }
        catch (error) {
            alert("An error occured. Please try again later.")
        }
    }

    function setData(event) {
        return (setPasswordData((currData) => ({
            ...currData, [event.target.name]: event.target.value
        })))
    }

    function handleCross() {
        window.localStorage.removeItem("email")
        navigate(`/${username}/profile`)
    }

    return (
        <div className="flex justify-center items-center h-screen w-full bg-gray-200 ">
            <div className="h-[440px] w-[420px] rounded-lg py-4 px-5 bg-white shadow-2xl hover:scale-105 transition-all duration-300 max-sm:mx-4">
                <div className="flex justify-between">
                    <p className="font-medium text-3xl">Change Password</p>
                    <img onClick={handleCross} src={img} alt="close" className="h-8 w-6 mt-1 cursor-pointer hover:scale-125 hover:mr-1 transition-all" />
                </div>
                <form className="mt-6">
                    <input type="password" name="oldPassword" placeholder="Old password" value={passwordData.oldPassword} onChange={setData} className="block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-8" />
                    <input type="password" name="newPassword" placeholder="New password" value={passwordData.newPassword} onChange={setData} className="block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-8" />
                    <input type="password" name="confirmNewPassword" placeholder="Confirm new password" value={passwordData.confirmNewPassword} onChange={setData} className="block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-8" />
                    <p onClick={() => navigate(`/${username}/profile/forgotpassword`)} className="mt-4 text-blue-700 font-medium cursor-pointer w-36">Forgot password?</p>
                    <button onClick={updatePassword} className="h-12 w-full mt-6 hover:text-lg transition-all duration-200 rounded-full bg-blue-600 text-white font-medium" >Update Password</button>
                </form>
            </div>
        </div>
    )
}