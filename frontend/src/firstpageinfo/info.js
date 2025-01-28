import { useState } from "react"
import {useNavigate} from "react-router-dom"
import img from "../images/refresh.png"

export default function Info() {

    const navigate = useNavigate();
    const isSignedin = window.localStorage.getItem("isSignedin")
    let username = window.localStorage.getItem("username")

    let [formData, setFormData] = useState({
        username: username,
        gender: "",
        fullName: "",
        email: "",
        mobNo: ""
    })

    function setData(event) {
        const { name, value } = event.target
        if (name === "mobNo" && !/^\d*$/.test(value)) {
            return
        }
        setFormData((currData) => ({
            ...currData,
            [name]: value
        }))
    }

    function refresh(){
        setFormData({
            gender: "",
            fullName: "",
            email: "",
            mobNo: ""
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!isSignedin) {
            alert("Please sign in first to proceed.")
            navigate("/signup")
            return
        }
        let areAllFieldsFilled = Object.values(formData).every((value) => value.trim() !== "")
        if (!areAllFieldsFilled) {
            if (!formData.gender) {
                alert("Please select your gender before proceeding.")
                return
            }
          alert("Please fill out all fields before proceeding.")
          return
        }
        if (!formData.email.endsWith("@gmail.com")) {
            alert("Email must be a valid Gmail address (e.g., example@gmail.com).")
            return
        }
        if (formData.mobNo.length !== 10 || isNaN(formData.mobNo)) {
            alert("Mobile number must be exactly 10 digits and does not include any special characters.")
            return
        }
        else {
            try {
                const response = await fetch("http://localhost:8080/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                })
                if(response.ok){
                    navigate(`/${username}/getscore`)
                }
                else if(response.status === 500) {
                    alert("Internal server error, try again.")
                }
                else {
                    alert(`Unexpected error: ${response.status}`)
                }
            } 
            catch (error) {
                alert("An error occurred during submission. Please check your connection and try again.")
                refresh()
            }
        }
    }

    return (
        <div className="h-[470px] mt-6 w-[462px] rounded-lg px-8 py-6 text-lg bg-white shadow-xl hover:scale-105 transition-all duration-300 2xl:ml-[302px] 2xl:mr-36 max-2xl:mr-[145px] max-2xl:w-[490px] max-xl:mr-20 max-lg:mr-7 max-lg:h-[430px] max-lg:w-[420px] max-lg:px-5 max-lg:py-4 max-md:w-full max-md:h-[420px] max-sm:mb-4">
            <div className="flex justify-between">
                <p className="mb-2">Gender</p>
                <img src={img} className="h-10 w-10 -m-2 cursor-pointer hover:scale-125 transition-all" onClick={refresh} alt="refresh" />
            </div>
            <form method="post" action="/">
                <input type="radio" id="Male" className="size-4 cursor-pointer hover:scale-125 transition-all" value="male" onChange={setData} name="gender" checked={formData.gender === "male"} />
                <label htmlFor="Male" className="ml-2 font-light">Male</label>
                <input type="radio" id="Female" className="size-4 ml-10 cursor-pointer hover:scale-125 transition-all" value="female" onChange={setData} name="gender" checked={formData.gender === "female"} />
                <label htmlFor="Female" className="ml-2 font-light">Female</label>
                <div className="mt-8 space-y-8">
                    <div className="relative flex">
                        <input id="fullname" placeholder="As per your bank records" value={formData.fullName} onChange={setData} name="fullName" className="peer mt-5 border-black border-b-2 border-opacity-20 w-full placeholder:text-xs focus:outline-none" />
                        <label htmlFor="fullname" className="absolute text-sm transition-all peer-placeholder-shown:text-lg peer-focus:text-sm peer-focus:top-0">Full Name</label>
                    </div>
                    <div className="relative flex">
                        <input id="email" placeholder="As per your bank records" value={formData.email} onChange={setData} type="email" name="email" className="peer mt-5 border-black border-b-2 border-opacity-20 w-full placeholder:text-xs focus:outline-none" />
                        <label htmlFor="email" className="absolute text-sm transition-all peer-placeholder-shown:text-lg peer-focus:text-sm peer-focus:top-0">Email Address</label>
                    </div>
                    <div className="relative flex">
                        <input id="mobile" placeholder="As per your bank records" value={formData.mobNo} onChange={setData} type="tel" name="mobNo" className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none peer mt-5 border-black border-b-2 border-opacity-20 w-full placeholder:text-xs focus:outline-none" />
                        <label htmlFor="mobile" className="absolute text-sm transition-all peer-placeholder-shown:text-lg peer-focus:text-sm peer-focus:top-0">Mobile Number</label>
                    </div>
                    <button onClick={handleSubmit} className="bg-blue-700 rounded-md h-10 mt-8 w-52 text-white font-medium ">Get Free Credit Report</button>
                </div>
            </form>
        </div>
    )
}