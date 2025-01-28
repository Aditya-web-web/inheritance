import { useNavigate } from "react-router-dom"
import Navbar from "../navbar/navbar"

export default function Help() {

    const navigate = useNavigate()

    return (
        <div>
            <Navbar/>
            <div className="px-36 py-6 w-full space-y-8 text-justify bg-gray-200 max-xl:px-20 max-lg:px-8 max-md:px-4">
                <div className="space-y-4">
                    <p className="text-3xl font-semibold">Help & Support</p>
                    <p className="text-lg max-lg:text-base max-sm:text-sm">Welcome to the Scorevision Help Center. We're here to guide you through understanding and managing your credit score, as well as how to navigate the features on our website. If you have any questions or need assistance, you'll find helpful information below.</p>
                </div>
                <div className="space-y-4">
                    <p className="text-2xl font-medium max-lg:text-xl">How to Check Your Credit Score</p>
                    <p className="text-lg max-lg:text-base max-sm:text-sm">To check your credit score, simply follow these steps:</p>
                    <ol className="text-lg max-lg:text-base max-sm:text-sm space-y-2">
                        <li>1. Sign In to Your Account: If you don’t have one, create an account on our website.</li>
                        <li>2. Go to the Dashboard: Once logged in, navigate to the small form on the dashboard and fill some basic details.</li>
                        <li>3. Click "Check Credit Score": You’ll be prompted to enter basic details and to upload some files (aadhaar card, insurance statement, loan statement and bank statement) to pull your credit score.</li>
                        <li>4. Review Your Score: Your current score will be displayed, along with an explanation of how it’s calculated.</li>
                    </ol>
                </div>
                <div className="space-y-4">
                    <p className="text-2xl font-medium max-lg:text-xl">How to Use Loan Recommendations</p>
                    <p className="text-lg max-lg:text-base max-sm:text-sm">Here’s how you can get personalized loan suggestions:</p>
                    <ol className="text-lg max-lg:text-base max-sm:text-sm space-y-2">
                        <li>1. Enter Your Credit Score: Go to the “Loan Recommendation” section and input your current credit score.</li>
                        <li>2. Review Suggested Loans: Our system will generate a list of loan options suited to your credit profile.</li>
                        <li>3. Compare Terms: Look at the interest rates, repayment terms, and loan amounts.</li>
                        <li>4. Apply Directly: Once you find the right loan, you can click on that to get redirected to the lender's website.</li>
                    </ol>
                </div>
                <div className="space-y-4">
                    <p className="text-2xl font-medium max-lg:text-xl">How to Contact Support</p>
                    <p className="text-lg max-lg:text-base max-sm:text-sm">If you need assistance, use these options:</p>
                    <ol className="text-lg max-lg:text-base max-sm:text-sm space-y-2">
                        <li>1. Email Support: Send us an email at support@scorevision.com for detailed inquiries.</li>
                        <li>2. Phone Support: Call our customer service at +123-XXX-XXXX during business hours for direct assistance.</li>
                        <li>3. FAQ: Browse our FAQ section for quick answers to common questions.</li>
                    </ol>
                </div>
                <div className="space-y-5 mt-7 pt-2">
                    <p className="text-2xl font-medium max-lg:text-xl">Frequently Asked Questions (FAQs)</p>
                    <div className="space-y-1">
                        <p className="text-xl font-medium max-lg:text-lg">How often is my credit score updated?</p>
                        <p className="text-lg max-lg:text-base max-sm:text-sm">Your credit score is updated every month based on the most recent financial data available.</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xl font-medium max-lg:text-lg">Why is my credit score different from the one shown by my bank?</p>
                        <p className="text-lg max-lg:text-base max-sm:text-sm">Different institutions may use different credit scoring models, which can explain variations in the score. We use widely recognized models to ensure accuracy.</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xl font-medium max-lg:text-lg">What should I do if I find an error in my credit report?</p>
                        <p className="text-lg max-lg:text-base max-sm:text-sm">If you spot any errors, immediately report them to the credit bureau or lender. You can also contact our support team for guidance on disputing the error.</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-2xl font-medium max-lg:text-xl">Privacy & Security</p>
                    <p className="text-lg max-lg:text-base max-sm:text-sm">Your privacy and security are our top priorities. We use encryption and other security measures to protect your personal information. Read our Privacy Policy for more details.</p>
                </div>
                <div className="flex justify-end -mr-8 cursor-pointer">
                    <p onClick={ () => { navigate("/") } } className="text-blue-500 px-8 py-2 hover:underline text-lg font-medium hover:scale-110 transition-all duration-200 max-sm:text-base">Return to homepage</p>
                </div>
            </div>
        </div>
    )
}