import { useState } from "react"
import {useNavigate, useParams} from "react-router-dom"

export default function CreditScore() {

    const navigate = useNavigate()

    let { username } = useParams()

    let [data, setData] = useState({
        username: username,
        income: "",
        qualification: "",
        aadhaar: "",
        dependents: "",
        loan: "",
        insurance: "",
        assets: "",
        city: "",
        debt: ""
    })

    function setScoreData(event) {
        const { name, value, files } = event.target
        if (files) {
            setData((currData) => ({ ...currData, [name]: files[0] }))
        } else {
            setData((currData) => ({ ...currData, [name]: value }))
        }
    }
    
    function handleRefresh(){
        setData({
            income: "",
            qualification: "",
            aadhaar: "",
            dependents: "",
            loan: "",
            insurance: "",
            assets: "",
            city: "",
            debt: ""
        })
    }

    async function handleSubmit() {
        const areAllFieldsFilled = Object.values(data).every((value) => {
            if (typeof value === "string") {
                return value.trim() !== ""
            }
            if (value instanceof File) {
                return value.name.trim() !== ""
            }
            return false
        })
        if (!areAllFieldsFilled) {
          alert("Please fill out all fields before proceeding.")
          return
        }
        else {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value instanceof File) {
                    formData.append(key, value)
                } else {
                    formData.append(key, value)
                }
            });
            try {
                const response = await fetch(`http://localhost:8080/${username}/getscore`, {
                    method: "POST",
                    body: formData,
                })
                if(response.ok) {
                    let mainData = await response.json()
                    let id = mainData._id
                    alert("Data uploaded successfully")
                    navigate(`/${username}/showscore/${id}`)
                }
            } 
            catch (error) {
                alert("An error occurred during submission. Please try again.")
                handleRefresh()
            }
        }
    }

    function handleGoBack() {
        navigate("/")
    }

    return (
        <div className="w-full h-dvh px-36 text-lg font-medium pt-12 flex flex-col bg-gray-200 max-xl:px-8 max-lg:px-8 max-md:px-4 max-sm:pt-4">
            <div className="flex gap-20 max-lg:flex-col max-xl:gap-8">
                <div className="w-full h-[520px] rounded-2xl px-6 bg-gray-50 shadow-2xl hover:scale-105 transition-all duration-300 max-lg:w-full max-sm:h-[470px]">
                    <div className="relative flex mt-12 max-sm:mt-7">
                        <input type="number" id="income" name="income" value={data.income} onChange={setScoreData} placeholder="..." className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-gray-50 bg-gray-50 text-lg mt-6 font-medium peer border-black border-b-2 border-opacity-20 w-full placeholder:text-xs focus:outline-none max-sm:text-base" />
                        <label htmlFor="income" className="absolute text-sm transition-all peer-placeholder-shown:text-lg peer-focus:text-sm peer-focus:top-0 max-sm:peer-placeholder-shown:text-base">Enter your income</label>
                    </div>
                    <div className="relative flex mt-10">
                        <input type="text" id="qualification" name="qualification" value={data.qualification} onChange={setScoreData} placeholder="..." className="placeholder:text-gray-50 text-lg font-medium peer border-black border-b-2 border-opacity-20 w-full bg-gray-50 placeholder:text-xs focus:outline-none mt-6 max-sm:text-base" />
                        <label htmlFor="qualification" className="absolute text-sm transition-all peer-placeholder-shown:text-lg peer-focus:text-sm peer-focus:top-0 max-sm:peer-placeholder-shown:text-base">Enter your qualification</label>
                    </div>
                    <div className="relative flex mt-10">
                        <input type="number" id="dependents" name="dependents" value={data.dependents} onChange={setScoreData} placeholder="..." className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-gray-50 bg-gray-50 text-lg font-medium peer border-black border-b-2 border-opacity-20 w-full placeholder:text-xs focus:outline-none mt-6 max-sm:text-base" />
                        <label htmlFor="dependents" className="absolute text-sm transition-all peer-placeholder-shown:text-lg peer-focus:text-sm peer-focus:top-0 max-sm:peer-placeholder-shown:text-base">Enter the number of dependents</label>
                    </div>
                    <div className="relative flex mt-10">
                        <input type="number" id="assets" name="assets" value={data.assets} onChange={setScoreData} placeholder="..." className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-gray-50 text-lg bg-gray-50 font-medium peer border-black border-b-2 border-opacity-20 w-full placeholder:text-xs focus:outline-none mt-6 max-sm:text-base" />
                        <label htmlFor="assets" className="absolute text-sm transition-all peer-placeholder-shown:text-lg peer-focus:text-sm peer-focus:top-0 max-sm:peer-placeholder-shown:text-base">Enter your approximate assets amount</label>
                    </div>
                    <div className="relative flex mt-10">
                        <input type="number" id="debt" name="debt" value={data.debt} onChange={setScoreData} placeholder="..." className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-gray-50 text-lg bg-gray-50 font-medium peer border-black border-b-2 border-opacity-20 w-full placeholder:text-xs focus:outline-none mt-6 max-sm:text-base" />
                        <label htmlFor="debt" className="absolute text-sm transition-all peer-placeholder-shown:text-lg peer-focus:text-sm peer-focus:top-0 max-sm:peer-placeholder-shown:text-base">Enter your approximate debt amount</label>
                    </div>
                </div>
                <div className="w-full h-[520px] px-6 rounded-2xl bg-gray-50 shadow-2xl hover:scale-105 transition-all duration-300 max-lg:w-full max-lg:mt-6 max-lg:pb-8 max-sm:h-[470px]">
                    <div className="flex mt-[50px] max-sm:mt-7">
                        <select id="city" name="city" value={data.city} onChange={setScoreData} className="text-lg bg-gray-50 font-medium border-black border-b-2 border-opacity-20 w-full placeholder:text-xs focus:outline-none mt-6" >
                            <option value=""></option>
                            <option value="Tier_1" className="max-sm:text-base">Tier 1</option>
                            <option value="Tier_2" className="max-sm:text-base">Tier 2</option>
                            <option value="Tier_3" className="max-sm:text-base">Tier 3</option>
                        </select>
                        <label htmlFor="city" className="absolute text-lg max-sm:text-base">Select your city tier</label>
                    </div>

                    <div className="mt-12 flex flex-col">
                        <label htmlFor="aadhaar" className="max-sm:text-base">Upload your ID (Aadhaar Card)</label>
                        <input type="file" id="aadhaar" name="aadhaar" onChange={setScoreData} className="mt-3 text-sm" />
                    </div>

                    <div className="mt-16 flex flex-col">
                        <label htmlFor="loan" className="max-sm:text-base">Enter your Loan statement</label>
                        <input type="file" id="loan" name="loan" onChange={setScoreData} className="mt-3 text-sm" />
                    </div>
                    <div className="mt-16 flex flex-col">
                        <label htmlFor="insurance" className="max-sm:text-base">Enter your Insurance statement</label>
                        <input type="file" id="insurance" name="insurance" onChange={setScoreData} className="mt-3 text-sm" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center pb-4">
                <div className="flex justify-between text-lg font-medium mt-9 gap-6">
                    <button onClick={handleSubmit} className="bg-blue-600 text-white h-11 w-40 rounded-xl shadow-2xl shadow-gray-500 transition-all hover:scale-110 duration-300">Get Credit Score</button>
                    <button onClick={handleRefresh} className="bg-blue-600 text-white h-11 w-40 rounded-xl shadow-2xl shadow-gray-500 transition-all hover:scale-110 duration-300">Refresh</button>
                </div>
                <button onClick={handleGoBack} className="mt-6 bg-blue-600 text-white h-11 w-40 rounded-xl shadow-2xl shadow-gray-500 transition-all hover:scale-110 duration-300">Go Back</button>
            </div>
        </div>
    )
}



