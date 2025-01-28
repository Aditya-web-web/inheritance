import { useNavigate } from "react-router-dom"
import img from "../images/cross.png"

export default function ForgotPassword() {

    const navigate = useNavigate()

    let email = window.localStorage.getItem("email")

    function handleCross() {
        window.localStorage.removeItem("email")
        navigate("/signin")
    }

    function handleProceed() {
        navigate("/signin/forgotpassword/verify")
        sendOtp()
    }

    async function sendOtp() {
        try {
            const response = await fetch("http://localhost:8080/signin/forgotpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email })
            })
            if (!response.ok) {
                alert("Failed to send OTP.")
                navigate("/signin")
            }
        }
        catch (error) {
            alert("An error occurred during sign-in. Please try again.")
            window.localStorage.removeItem("email")
            navigate("/")
        }

    }

    return (
        <div className="h-screen w-full flex justify-center items-center bg-gray-200">
            <div className="h-60 w-[600px] rounded-lg py-6 px-5 bg-white shadow-2xl hover:scale-105 transition-all duration-300 max-lg:mx-4">
                <div className="flex justify-between">
                    <p className="font-medium text-2xl">Forgot Password</p>
                    <img onClick={handleCross} src={img} alt="close" className="h-8 w-6 mt-1 cursor-pointer hover:scale-125 hover:mr-1 transition-all" />
                </div>
                <div>
                    <p className="my-6 pl-[2px]" >You will get a verification code on XXXXXXX{email.slice(-14)}@gmail.com</p>
                    <button onClick={handleProceed} className="h-12 w-full mt-2 hover:text-lg transition-all duration-200 rounded-full bg-blue-600 text-white font-medium">Press to proceed</button>
                </div>
            </div>
        </div>
    )
}