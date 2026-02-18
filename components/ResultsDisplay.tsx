import React from 'react';
import { Diagnosis } from '../types';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { CheckCircle2, AlertCircle, AlertTriangle, Activity, Stethoscope } from 'lucide-react';

interface ResultsDisplayProps {
  result: Diagnosis;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result.isPlant) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center max-w-2xl mx-auto">
        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-orange-800 mb-2">Not a Plant Detected</h3>
        <p className="text-orange-700">
          The AI analyzed the image but could not identify a plant leaf. 
          Please ensure the image is clear and contains plant foliage.
        </p>
      </div>
    );
  }

  const chartData = [
    {
      name: 'Confidence',
      value: result.confidence,
      fill: result.isHealthy ? '#10b981' : '#ef4444',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-slate-100">
        <div className={`p-6 ${result.isHealthy ? 'bg-emerald-600' : 'bg-red-600'} text-white flex items-start justify-between`}>
          <div>
            <div className="flex items-center space-x-2 mb-1 opacity-90">
               <Activity className="w-4 h-4" />
               <span className="text-sm font-semibold uppercase tracking-wider">Analysis Result</span>
            </div>
            <h2 className="text-3xl font-bold mb-1">{result.plantName}</h2>
            <p className="text-lg opacity-90 font-medium">{result.diseaseName}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
             {result.isHealthy ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Confidence Chart */}
          <div className="col-span-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100">
             <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">AI Confidence</h4>
             <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="80%" 
                    barSize={10} 
                    data={chartData} 
                    startAngle={90} 
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={30 / 2}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`text-2xl font-bold ${result.isHealthy ? 'text-emerald-600' : 'text-red-600'}`}>
                        {result.confidence}%
                    </span>
                </div>
             </div>
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-emerald-600" />
                Diagnosis Overview
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {result.description}
            </p>
          </div>
        </div>
      </div>

      {/* Treatments Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">
                {result.isHealthy ? "Care Tips" : "Recommended Treatments"}
            </h3>
        </div>
        <div className="p-6">
           <ul className="space-y-4">
              {result.treatments.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5 mr-3 text-sm font-bold">
                        {index + 1}
                    </div>
                    <span className="text-slate-700">{step}</span>
                  </li>
              ))}
           </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;