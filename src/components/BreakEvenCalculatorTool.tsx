import React, { useState } from 'react';
import { calculateBreakEvenPoint, BreakEvenResult, CalculationError } from '../utils/FinancialMath';

const InputField = ({ id, label, value, onChange, placeholder, icon, colorClass }) => (
    <div className="relative">
        <label htmlFor={id} className={`block text-sm font-medium ${colorClass} mb-2`}>{label}</label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-7">
            {icon}
        </div>
        <input 
            type="number" 
            id={id} 
            value={value}
            onChange={onChange}
            placeholder={placeholder} 
            className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 pl-10 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            aria-label={label}
        />
    </div>
);


const BreakEvenCalculatorTool: React.FC = () => {
    const [fixedCosts, setFixedCosts] = useState<string>('');
    const [sellingPrice, setSellingPrice] = useState<string>('');
    const [variableCosts, setVariableCosts] = useState<string>('');
    const [result, setResult] = useState<BreakEvenResult | CalculationError | null>(null);
    const [key, setKey] = useState(0);

    const handleCalculate = () => {
        const fc = parseFloat(fixedCosts);
        const sp = parseFloat(sellingPrice);
        const vc = parseFloat(variableCosts);

        const calculationResult = calculateBreakEvenPoint(fc, sp, vc);
        setResult(calculationResult);
        setKey(prevKey => prevKey + 1); // Remount result component for animation
    };
    
    const isError = (res: BreakEvenResult | CalculationError | null): res is CalculationError => {
        return res !== null && 'error' in res;
    };
    
    const isSuccess = (res: BreakEvenResult | CalculationError | null): res is BreakEvenResult => {
        return res !== null && 'breakEvenUnits' in res;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };
    
    return (
        <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-sky-500/20 p-6 md:p-10">
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Break-Even Point Analysis</h2>
                <p className="text-slate-400 mt-2 max-w-2xl mx-auto">Enter your business costs to find the point where revenue equals total costs.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <InputField 
                    id="fixed-costs"
                    label="Total Fixed Costs"
                    value={fixedCosts}
                    onChange={(e) => setFixedCosts(e.target.value)}
                    placeholder="e.g., 50000"
                    colorClass="text-sky-300"
                    icon={<span className="text-slate-400">$</span>}
                />
                <InputField 
                    id="selling-price"
                    label="Selling Price / Unit"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="e.g., 100"
                    colorClass="text-purple-300"
                    icon={<span className="text-slate-400">$</span>}
                />
                <InputField 
                    id="variable-costs"
                    label="Variable Costs / Unit"
                    value={variableCosts}
                    onChange={(e) => setVariableCosts(e.target.value)}
                    placeholder="e.g., 40"
                    colorClass="text-indigo-300"
                    icon={<span className="text-slate-400">$</span>}
                />
            </div>

            <div className="text-center mb-8">
                <button 
                    onClick={handleCalculate}
                    className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-sky-500/30"
                >
                    Calculate Break-Even Point
                </button>
            </div>
            
            {result && (
                <div key={key} className="mt-6 animate-fade-in-up">
                    {isError(result) && (
                        <div className="text-center text-red-400 font-semibold bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                            <p>{result.error}</p>
                        </div>
                    )}
                    {isSuccess(result) && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                           <h3 className="text-2xl font-bold text-center text-white mb-6">Your Results</h3>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
                                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                    <p className="text-sm text-slate-400 mb-1">BEP (Units)</p>
                                    <p className="text-3xl font-extrabold text-sky-400">{result.breakEvenUnits.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500 mt-1">units to sell</p>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                    <p className="text-sm text-slate-400 mb-1">BEP (Revenue)</p>
                                    <p className="text-3xl font-extrabold text-purple-400">{formatCurrency(result.breakEvenRevenue)}</p>
                                    <p className="text-xs text-slate-500 mt-1">in total sales</p>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                    <p className="text-sm text-slate-400 mb-1">Contribution Margin</p>
                                    <p className="text-3xl font-extrabold text-indigo-400">{formatCurrency(result.contributionMarginPerUnit)}</p>
                                    <p className="text-xs text-slate-500 mt-1">profit per unit</p>
                                </div>
                           </div>
                        </div>
                    )}
                </div>
            )}
             <style jsx global>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default BreakEvenCalculatorTool;