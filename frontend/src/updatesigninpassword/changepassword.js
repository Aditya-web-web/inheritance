import { useState } from "react"
import { useNavigate } from "react-router-dom"
import img from "../images/cross.png"

export default function ChangePassword() {

    let navigate = useNavigate()

    let email = window.localStorage.getItem("email")

    let [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmNewPassword: ""
    })

    function setData(event) {
        return (setPasswordData((currData) => ({
            ...currData, [event.target.name]: event.target.value
        })))
    }

    function handleCross() {
        window.localStorage.removeItem("email")
        navigate(`/signin`)
        alert("Password not changed.")
    }

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
            const response = await fetch(`http://localhost:8080/signin/updatepassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({newPassword: passwordData.newPassword, email: email})
            })
            if (response.status === 200) {
                alert("Password updated successfully !  Now you can signin using new password.")
                navigate(`/signin`)
            }
            else {
                alert("Internal server error.")
            }
        }
        catch (error) {
            alert("An error occured. Please try again later.")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen w-full bg-gray-200">
            <div className="h-80 w-[420px] rounded-lg py-4 px-5 bg-white shadow-2xl hover:scale-105 transition-all duration-300 max-sm:mx-4">
                <div className="flex justify-between">
                    <p className="font-medium text-3xl">Change Password</p>
                    <img onClick={handleCross} src={img} alt="close" className="h-8 w-6 mt-1 cursor-pointer hover:scale-125 hover:mr-1 transition-all" />
                </div>
                <form className="mt-6">
                    <input type="password" name="newPassword" placeholder="New password" value={passwordData.newPassword} onChange={setData} className="block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-8" />
                    <input type="password" name="confirmNewPassword" placeholder="Confirm new password" value={passwordData.confirmNewPassword} onChange={setData} className="block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-8" />
                    <button onClick={updatePassword} className="h-12 w-full mt-7 hover:text-lg transition-all duration-200 rounded-full bg-blue-600 text-white font-medium" >Update Password</button>
                </form>
            </div>
        </div>
    )
}