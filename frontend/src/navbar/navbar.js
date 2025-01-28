import { useState, useEffect, useRef} from "react"
import { Link, useNavigate } from "react-router-dom"
import img from "../images/logo.png"
import { FaUserCircle } from "react-icons/fa"
import { CgProfile } from "react-icons/cg"
import { RiHistoryFill } from "react-icons/ri"
import { IoMdHelpCircleOutline } from "react-icons/io"
import { MdOutlineInfo } from "react-icons/md"
import { MdLogout } from "react-icons/md"

export default function Navbar() {

    let [userName, setUserName] = useState("")
    let [isProfile, setIsProfile] = useState(false)
    const navigate = useNavigate()
    const isSignedin = window.localStorage.getItem("isSignedin")
    const profileDropdownRef = useRef(null)
    const profileDivRef = useRef(null)

    useEffect(() => {
        const storedUserName = localStorage.getItem("username")
        if (storedUserName) {
            setUserName(storedUserName)
        }
        const handleClickOutside = (event) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target) &&
                profileDivRef.current &&
                !profileDivRef.current.contains(event.target)
              ) {
                setIsProfile(false)
              }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    function setprofile() {
        setIsProfile((prev) => !prev)
    }

    function handleSignUp() {
        navigate("/signup")
    }

    function handleLogOut() {
        window.localStorage.removeItem("isSignedin")
        window.localStorage.removeItem("username")
        window.localStorage.removeItem("email")
        navigate("/")
    }    

    return (
        <div className="w-full flex justify-between px-36 py-3 relative max-xl:px-20 max-lg:px-8 max-md:px-4 max-sm:h-12 max-sm:py-2">
            <Link to="/" className="outline-none">
                <img src={img} alt="logo" className="h-10 w-40 -ml-2 hover:scale-110 transition-all duration-200 max-sm:h-8 max-sm:w-28" />
            </Link>
    
            {isSignedin ? (
                <div>
                    <div ref={profileDivRef} onClick={setprofile} className="px-2 -mr-2 flex items-center hover:scale-110 transition-all duration-200 cursor-pointer max-sm:h-8 max-sm:w-40">
                        <span className="text-lg font-medium mr-3 max-sm:h-8 max-sm:w-36 max-sm:text-sm max-sm:mt-3 max-sm:pl-2 text-end">{userName}</span>
                        <FaUserCircle className="h-10 w-10 opacity-60 rounded-full" />
                    </div>
                    {isProfile && (
                        <div ref={profileDropdownRef} className="h-64 w-60 absolute top-[68px] right-32 hover:scale-105 transition-all duration-200 shadow-xl z-10 text-lg font-medium bg-gray-50 rounded-lg px-4 py-3 flex flex-col justify-between max-xl:right-20 max-2xl:w-52 max-xl:h-56 max-2xl:py-2 max-lg:right-7 max-md:right-4 max-sm:top-[56px]">
                            <div onClick={ () => navigate(`/${userName}/profile`) } className="h-10 w-full cursor-pointer px-2 flex items-center space-x-6 rounded-lg hover:scale-110 transition-all duration-200 hover:bg-gray-200 max-2xl:space-x-3">
                                <CgProfile className="size-8 mt-[3px]" />
                                <p className="h-10 w-full flex items-center">Profile</p>
                            </div>
                            <div onClick={ () => navigate(`/${userName}/history`) } className="h-10 w-full cursor-pointer px-2 flex items-center space-x-6 rounded-lg hover:scale-110 transition-all duration-200 hover:bg-gray-200 max-2xl:space-x-3">
                                <RiHistoryFill className="size-8 mt-[3px]" />
                                <p className="h-10 w-full flex items-center">History</p>
                            </div>
                            <div onClick={ () => navigate("/help") } className="h-10 w-full cursor-pointer px-2 flex items-center space-x-6 rounded-lg hover:scale-110 transition-all duration-200 hover:bg-gray-200 max-2xl:space-x-3">
                                <IoMdHelpCircleOutline className="size-8 mt-[3px]" />
                                <p className="h-10 w-full flex items-center">Help</p>
                            </div>
                            <div onClick={ () => navigate("/about") } className="h-10 w-full cursor-pointer px-2 flex items-center space-x-6 rounded-lg hover:scale-110 transition-all duration-200 hover:bg-gray-200 max-2xl:space-x-3">
                                <MdOutlineInfo className="size-8 mt-[2px]" />
                                <p className="h-10 w-full flex items-center">About</p>
                            </div>
                            <div onClick={handleLogOut} className="h-10 w-full cursor-pointer px-2 flex items-center space-x-[21px] rounded-lg hover:scale-110 transition-all duration-200 hover:bg-gray-200 max-2xl:space-x-3">
                                <MdLogout className="size-8 mt-[2px] ml-[2px]" />
                                <p className="h-10 w-full flex items-center">Sign out</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-80 font-medium flex justify-between max-sm:w-48">
                    <p onClick={ () => navigate("/about") } className="h-10 w-16 cursor-pointer flex items-center justify-center hover:scale-125 transition-all duration-300 max-sm:h-8 max-sm:w-12 max-sm:text-sm">About</p>
                    <p onClick={ () => navigate("/help") } className="h-10 w-16 cursor-pointer flex items-center justify-center hover:scale-125 transition-all duration-300 max-sm:h-8 max-sm:w-12 max-sm:text-sm">Help</p>
                    <button onClick={handleSignUp} className="h-10 w-24 bg-gray-200 rounded-md hover:scale-110 transition-all duration-300 max-sm:h-8 max-sm:w-20 max-sm:text-sm">Sign up</button>
                </div>
            )}
        </div>
    )    
}