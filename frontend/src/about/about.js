import { useNavigate } from "react-router-dom"
import Navbar from "../navbar/navbar"

export default function About() {

    const navigate = useNavigate()

    return (
        <div>
            <Navbar />
            <div className="bg-gray-200 px-36 py-6 text-justify w-full space-y-5 max-xl:px-20 max-lg:px-8 max-md:px-4">
                <p className="text-3xl font-semibold">About Us</p>
                <p className="text-2xl font-medium pt-4 max-lg:text-xl">Empowering Financial Decisions</p>
                <p className="text-lg max-lg:text-base max-sm:text-sm">Welcome to Scorevision, your trusted partner in navigating the world of credit and finance. We are dedicated to simplifying credit score management and providing tailored financial recommendations to help you make informed decisions.</p>
                <p className="text-2xl font-medium pt-4 max-lg:text-xl">What We Do</p>
                <p className="text-lg max-lg:text-base max-sm:text-sm">At Scorevision, we analyze your credit data to calculate an accurate credit score, enabling you to assess your financial health. Our platform goes beyond just numbers—we offer personalized loan recommendations with competitive interest rates based on your score. Whether you're planning a major purchase or simply aiming to improve your creditworthiness, we’ve got you covered.</p>
                <p className="text-2xl font-medium pt-4 max-lg:text-xl">Our Mission</p>
                <p className="text-lg max-lg:text-base max-sm:text-sm">Our mission is to empower individuals with the tools and knowledge to take control of their financial journey. We believe everyone deserves access to transparent, fair, and actionable insights to unlock better financial opportunities.</p>
                <p className="text-2xl font-medium pt-4 max-lg:text-xl">Why Choose Us?</p>
                <ul className="text-lg max-lg:text-base max-sm:text-sm max-sm:space-y-3">
                    <li>&#x2022;  User-Friendly Interface: Navigate your credit journey with ease using our intuitive dashboard.</li>
                    <li>&#x2022;  Tailored Recommendations: Access customized loan suggestions based on your unique credit profile.</li>
                    <li>&#x2022;  Educational Insights: Learn about credit scores, how they're calculated, and tips for improvement.</li>
                    <li>&#x2022;  Secure and Reliable: Your data is protected with top-tier security measures to ensure privacy and safety.</li>
                    <li>&#x2022;  Secure and Reliable: Your data is protected with top-tier security measures to ensure privacy and safety.</li>
                </ul>
                <p className="text-2xl font-medium pt-4 max-lg:text-xl">Join Us Today</p>
                <p className="text-lg max-lg:text-base max-sm:text-sm">Discover the power of informed financial choices with Scorevision. Together, let’s pave the way toward a brighter financial future.</p>
                <div className="flex justify-end -mr-8 cursor-pointer">
                    <p onClick={ () => { navigate("/") } } className="text-blue-500 px-8 py-2 hover:underline text-lg font-medium hover:scale-110 transition-all duration-200 max-sm:text-base">Return to homepage</p>
                </div>
            </div>
        </div>
    )
}