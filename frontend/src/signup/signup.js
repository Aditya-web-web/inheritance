import { useState } from "react"
import {useNavigate} from "react-router-dom"
import img from "../images/cross.png"

export default function SignUp() {

    const navigate = useNavigate()

    let [signUpData, setSignUpData] = useState({
        username: "",
        email: "",
        password: ""
    })

    function setData(event) {
        return (setSignUpData((currData) => ({
            ...currData, [event.target.name]: event.target.value
        })))
    }

    function handleCross() {
        window.localStorage.removeItem("username")
        window.localStorage.removeItem("email")
        navigate("/")
    }

    async function handleProceed(e) {
        e.preventDefault()
        let areAllFieldsFilled = Object.values(signUpData).every((value) => value.trim() === "")
        if (areAllFieldsFilled) {
            alert("Please fill out all fields before proceeding.")
            return
        }
        if (!signUpData.email.endsWith("@gmail.com")) {
            alert("Email must be a valid Gmail address (e.g., example@gmail.com).")
            return
        }
        if (signUpData.password.length < 8) {
            alert("Password must contain atleast 8 characters.")
            return
        }
        try {
            const response = await sendOtp()
            if (response.ok) {
                window.localStorage.setItem("username", signUpData.username)
                window.localStorage.setItem("email", signUpData.email)
                navigate("/signup/otp")
            }
            else if(response.status === 408) {
                alert("Email already in use. You can signin using this email.")
            }
            else if(response.status === 409) {
                alert("Username already exists.")
            }
            else {
                alert(`Unexpected error: ${response.status}`)
            }
        }
        catch (error) {
            alert("An error occurred. Please check your connection and try again.")
            navigate("/signup")
        }
    }

    async function sendOtp() {
        const response = await fetch("http://localhost:8080/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signUpData)
        })
        return response
    }
    
    return (
        <div className="h-screen w-full flex justify-center items-center bg-gray-200">
            <div className="h-[500px] w-[420px] rounded-lg py-4 px-5 bg-white shadow-2xl hover:scale-105 transition-all duration-300 max-sm:mx-4">
                <div className="flex justify-between">
                    <p className="font-medium text-3xl">Sign up</p>
                    <img onClick={handleCross} src={img} alt="close" className="h-8 w-6 mt-1 cursor-pointer hover:scale-125 hover:mr-1 transition-all" />
                </div>
                <form method="post" action="/signup" className="mt-5">
                    <input type="text" name="username" placeholder="Username" value={signUpData.username} onChange={setData} className="block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-4" />
                    <input type="text" name="email" placeholder="Email" value={signUpData.email} onChange={setData} className="block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-4" />
                    <input type="password" name="password" placeholder="Password" value={signUpData.password} onChange={setData} className="block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-4" />
                    <p className="text-blue-700 mt-4 font-medium cursor-pointer" onClick={() => navigate("/signin")}>Already a user? Sign in</p>
                    <button onClick={handleProceed} className="h-12 w-full mt-5 hover:text-lg transition-all duration-200 rounded-full bg-blue-600 text-white font-medium" >Sign up</button>
                </form>
                <div className="flex items-center mt-5">
                    <hr className="flex-grow border-gray-400" />
                    <p className="px-3 text-gray-500 font-medium -mt-1">or</p>
                    <hr className="flex-grow border-gray-400" />
                </div>
                <button className="h-12 w-full mt-5 hover:text-lg transition-all duration-200 rounded-full font-medium border-[2px] border-black">Sign in with Google</button>
            </div>
        </div>
    )
}