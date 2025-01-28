export default function DetailedCS({creditScores}) {
    console.log(creditScores)
    return (
        <div className="w-full mt-24 px-6 py-5 bg-white mx-52 shadow-lg h-96 rounded-xl space-y-2">
            <p className="text-xl font-semibold">Individual Credit Score</p>
            <p>Age Level: {creditScores.age_lvl}</p>
            <p>Assets Level: {creditScores.assets_lvl}</p>
            <p>City Level: {creditScores.city_lvl}</p>
            <p>Debts Level: {creditScores.debts_lvl}</p>
            <p>Dependents Level: {creditScores.dep_lvl}</p>
            <p>Education Level: {creditScores.education_lvl}</p>
            <p>Income Level: {creditScores.income_lvl}</p>
            <p>Installment Level: {creditScores.installments_lvl}</p>
            <p>Late Level: {creditScores.late_lvl}</p>
        </div>
    )
}