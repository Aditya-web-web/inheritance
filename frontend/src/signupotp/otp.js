import { useNavigate } from "react-router-dom"
import img from "../images/cross.png"
import { useState } from "react"

export default function Otp() {

    const navigate = useNavigate()
    let email = window.localStorage.getItem("email")
    let [enteredotp, setEnteredotp] = useState("")
    let [isResending, setIsResending] = useState(false)

    function handleCross() {
        window.localStorage.removeItem("username")
        window.localStorage.removeItem("email")
        navigate("/signup")
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!enteredotp.trim()) {
            alert("Please enter the OTP.")
            return
        }
        try {
            const response = await fetch("http://localhost:8080/signup/otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, enteredotp})
            })
            if (response.ok) {
                window.localStorage.setItem("isSignedin", true)
                alert("Sign-up successful!")
                navigate("/")
            }
            else {
                alert("Incorrect OTP.")
            }
        }
        catch (error) {
            console.log(error)
            alert("An error occured. Please try again.")
        }
    }

    async function handleResendOtp() {
        setIsResending(true)
        try {
            const response = await fetch("http://localhost:8080/signup/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })
            if (response.ok) {
                alert("A new OTP has been sent to your email.")
            }
            else {
                alert("Unable to resend OTP. Please try again.")
            }
        } 
        catch (error) {
            alert("An error occurred while resending OTP.")
        }
        setIsResending(false)
    }

    return (
            <div className="h-screen w-full flex justify-center items-center bg-gray-200">
                <div className="h-96 w-[420px] rounded-lg py-4 px-5 bg-white shadow-2xl hover:scale-105 transition-all duration-300 max-sm:mx-4">
                    <div className="flex justify-between">
                        <p className="font-medium text-3xl">Verify</p>
                        <img onClick={handleCross} src={img} alt="close" className="h-8 w-6 mt-1 cursor-pointer hover:scale-125 hover:mr-1 transition-all" />
                    </div>
                    <p className="my-6">Enter OTP sent on your email</p>
                    <form>
                        <input type="number" onChange={(e) => setEnteredotp(e.target.value)} className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-4" />
                        <button onClick={handleSubmit} className="h-12 w-full mt-8 hover:text-lg transition-all duration-200 rounded-full bg-blue-600 text-white font-medium" >Submit OTP</button>
                    </form>
                    <button onClick={handleResendOtp} disabled={isResending} className={`h-12 w-full mt-7 hover:text-lg transition-all duration-200 rounded-full font-medium ${ isResending ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "border-[2px] border-black" }`} >
                        {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                </div>
            </div>
        )
    }