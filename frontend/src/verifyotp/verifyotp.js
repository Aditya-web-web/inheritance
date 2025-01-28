import { useState } from "react"
import { useNavigate } from "react-router-dom"
import img from "../images/cross.png"

export default function VerifyOtp() {

    const navigate = useNavigate()

    let email = window.localStorage.getItem("email")

    let [enteredotp, setEnteredotp] = useState("")

    function handleCross() {
        window.localStorage.removeItem("email")
        navigate("/signin")
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!enteredotp.trim()) {
            alert("Please enter the OTP.")
            return
        }
        try {
            const response = await fetch("http://localhost:8080/signin/forgotpassword/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, enteredotp })
            })
            if (response.ok) {
                alert("Otp verified.")
                navigate("/signin/updatepassword")
            }
            else {
                alert("Incorrect OTP.")
            }
        }
        catch (error) {
            alert("An error occured. Please try again.")
        }
    }

    return (
        <div className="h-screen w-full flex justify-center items-center bg-gray-200">
            <div className="h-72 w-[420px] rounded-lg py-4 px-5 bg-white shadow-2xl hover:scale-105 transition-all duration-300 max-sm:mx-4">
                <div className="flex justify-between">
                    <p className="font-medium text-3xl">Verify</p>
                    <img onClick={handleCross} src={img} alt="close" className="h-8 w-6 mt-1 cursor-pointer hover:scale-125 hover:mr-1 transition-all" />
                </div>
                <p className="my-6">Enter OTP sent on your email</p>
                <form>
                    <input type="number" onChange={(e) => setEnteredotp(e.target.value)} className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-4" />
                    <button onClick={handleSubmit} className="h-12 w-full mt-8 hover:text-lg transition-all duration-200 rounded-full bg-blue-600 text-white font-medium" >Submit OTP</button>
                </form>
            </div>
        </div>
    )
}