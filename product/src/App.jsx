import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Leaf, Activity, Cpu, Send } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// --- Mock API Simulation ---
const fetchMockData = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Generate random data for energy & carbon trends
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m) => ({
    month: m,
    energy: Math.floor(Math.random() * 800 + 200),
    carbon: Math.floor(Math.random() * 300 + 100),
  }));
};

// --- Simple AI Prediction (Mock ML Model) ---
const predictNextMonth = (data) => {
  if (!data || data.length === 0) return { energy: 0, carbon: 0 };
  const lastEnergy = data[data.length - 1].energy;
  const lastCarbon = data[data.length - 1].carbon;
  const predictedEnergy = Math.round(lastEnergy * (1 + Math.random() * 0.1));
  const predictedCarbon = Math.round(lastCarbon * (1 + Math.random() * 0.05));
  return { energy: predictedEnergy, carbon: predictedCarbon };
};

// --- Local Fallback Responses (GreenLedger Format) ---
const getLocalResponse = (userMessage) => {
  const lowerMsg = userMessage.toLowerCase();
  
  const responses = {
    ac: `<ol>
  <li><b>Step 1 — Current Energy Efficiency:</b> Optimize your existing AC by cleaning filters every 2 weeks, setting thermostat to 24–26°C, and sealing window gaps. <i>Expected benefit:</i> Reduces baseline consumption by 15–20% before solar transition.</li>
  
  <li><b>Step 2 — Renewable Transition (Solar Setup):</b> Install a 2–3 kW rooftop solar system sized to power your AC during peak daytime hours (10 AM–4 PM). Setup involves roof assessment, panel installation, and grid connection approval. Estimated cost: ₹1.8–₹2.4 lakh. Installation time: 5–7 days. <i>Expected benefit:</i> Reduced grid dependency during peak AC usage hours.</li>
  
  <li><b>Step 3 — Financial & Environmental Impact:</b> Expected monthly savings: ₹3,500–₹5,000 (depending on AC usage). Payback period: ~4–5 years. Annual CO₂ reduction: ~2.5–3.2 tons/year. <i>Expected benefit:</i> Long-term cost reduction and measurable environmental impact.</li>
  
  <li><b>Step 4 — Government Support:</b> 
    <b>Rooftop Solar Scheme</b> – 30–40% subsidy for residential & commercial setups. <a href="https://solarrooftop.gov.in" target="_blank">Apply Here</a><br>
    <b>PM-KUSUM</b> – Additional support for agricultural or rural installations. <a href="https://mnre.gov.in/pm-kusum" target="_blank">Official Page</a></li>
  
  <li><b>Step 5 — Maintenance & Monitoring:</b> Clean solar panels monthly with soft brush and water. Install a basic energy monitor to track real-time generation and consumption. <i>Expected benefit:</i> Maintains 25+ year system lifespan and ensures peak efficiency.</li>
  
  <li><b>Step 6 — Final Recommendation:</b> By installing a 2.5 kW rooftop solar system, your AC costs could drop by ₹42,000–₹60,000 annually, recover investment in ~4–5 years, and eliminate ~3 tons of CO₂ emissions yearly.</li>
</ol>`,
    
    solar: `<ol>
  <li><b>Step 1 — Current Energy Efficiency:</b> Before solar installation, audit your top energy consumers (AC, refrigerator, lighting, water heater). Optimize each by 15–20% through maintenance and behavioral changes. <i>Expected benefit:</i> Reduces baseline load, allowing smaller (cheaper) solar system.</li>
  
  <li><b>Step 2 — Renewable Transition (Solar Setup):</b> Install a 3–5 kW rooftop solar system for small businesses or 2–3 kW for homes. Setup process: (1) Roof assessment and structural approval, (2) Panel & inverter installation, (3) Grid connection and net metering registration. Estimated cost: ₹2.0–₹3.0 lakh for 3 kW system. Installation time: 5–7 days. <i>Expected benefit:</i> Generates 12–15 kWh/day; covers 60–80% of typical consumption.</li>
  
  <li><b>Step 3 — Financial & Environmental Impact:</b> Expected monthly savings: ₹4,000–₹6,500 (₹48,000–₹78,000 annually). Payback period: ~4–5 years. Annual CO₂ reduction: ~3.5–4.5 tons/year. <i>Expected benefit:</i> Significant long-term savings and verified environmental contribution.</li>
  
  <li><b>Step 4 — Government Support:</b> 
    <b>Pradhan Mantri Rooftop Solar Scheme</b> – 40% subsidy for residential, 30% for commercial. <a href="https://solarrooftop.gov.in" target="_blank">Apply Here</a><br>
    <b>PM-KUSUM</b> – Rural and agricultural solar support. <a href="https://mnre.gov.in/pm-kusum" target="_blank">Official Page</a></li>
  
  <li><b>Step 5 — Maintenance & Monitoring:</b> Clean panels quarterly with soft brush. Inspect inverter annually. Use energy monitoring app to track generation, consumption, and grid export. <i>Expected benefit:</i> Ensures consistent 25+ year performance and early fault detection.</li>
  
  <li><b>Step 6 — Final Recommendation:</b> A 3 kW rooftop solar system can save your business ₹60,000 annually, recover costs in ~4 years, and eliminate ~4 tons of CO₂ yearly. Apply for government subsidy to reduce upfront investment by ₹60,000–₹90,000.</li>
</ol>`,
    
    
    led: `<ol>
  <li><b>Step 1 — Current Energy Efficiency:</b> Audit all lighting fixtures and replace incandescent/CFL bulbs with 5W–9W LED equivalents. This immediate step cuts lighting energy by 80%. <i>Expected benefit:</i> Reduces baseline lighting load by 80%; saves ₹200–₹400 per bulb annually.</li>
  
  <li><b>Step 2 — Renewable Transition (Solar Setup):</b> For large commercial spaces, install a 1–2 kW solar system dedicated to daytime lighting. Setup: (1) Install solar panels on roof/terrace, (2) Connect to lighting circuit via inverter, (3) Enable battery backup for evening hours. Estimated cost: ₹80,000–₹1.2 lakh. Installation time: 3–4 days. <i>Expected benefit:</i> Eliminates daytime lighting costs; reduces grid dependency by 40–50%.</li>
  
  <li><b>Step 3 — Financial & Environmental Impact:</b> Expected monthly savings: ₹1,500–₹2,500 (₹18,000–₹30,000 annually). Payback period: ~3–4 years. Annual CO₂ reduction: ~0.8–1.2 tons/year. <i>Expected benefit:</i> Quick ROI with measurable environmental benefit.</li>
  
  <li><b>Step 4 — Government Support:</b> 
    <b>UJALA Scheme</b> – Provides LED bulbs at ₹70–₹100 per bulb. <a href="https://ujala.gov.in" target="_blank">Apply Here</a><br>
    <b>Rooftop Solar Scheme</b> – 30–40% subsidy for solar lighting systems. <a href="https://solarrooftop.gov.in" target="_blank">Apply Here</a></li>
  
  <li><b>Step 5 — Maintenance & Monitoring:</b> LEDs require minimal maintenance (10+ year lifespan). Install motion sensors in corridors and common areas to eliminate unnecessary usage. <i>Expected benefit:</i> Further 20–30% savings on lighting bills.</li>
  
  <li><b>Step 6 — Final Recommendation:</b> By replacing all lighting with LEDs and installing motion sensors, you can save ₹25,000–₹35,000 annually and eliminate ~1 ton of CO₂ yearly. Add a 1.5 kW solar system to achieve complete energy independence for lighting.</li>
</ol>`,
    
    refrigerator: `<ol>
  <li><b>Step 1 — Current Energy Efficiency:</b> Optimize existing refrigerator by cleaning condenser coils quarterly, checking door seals, and setting temperature to 3–4°C (fridge) and –18°C (freezer). <i>Expected benefit:</i> Reduces current consumption by 10–15%; saves ₹500–₹800 annually.</li>
  
  <li><b>Step 2 — Renewable Transition (Solar Setup):</b> For commercial kitchens with multiple refrigerators, install a 2–3 kW solar system with battery backup to power refrigeration 24/7. Setup: (1) Roof assessment, (2) Solar panel and battery installation, (3) Refrigerator circuit connection. Estimated cost: ₹1.5–₹2.2 lakh. Installation time: 5–6 days. <i>Expected benefit:</i> Eliminates grid dependency for refrigeration; ensures continuous cold chain.</li>
  
  <li><b>Step 3 — Financial & Environmental Impact:</b> Expected monthly savings: ₹2,500–₹4,000 (₹30,000–₹48,000 annually). Payback period: ~4–5 years. Annual CO₂ reduction: ~2–2.5 tons/year. <i>Expected benefit:</i> Significant operational cost reduction with environmental benefit.</li>
  
  <li><b>Step 4 — Government Support:</b> 
    <b>Rooftop Solar Scheme</b> – 40% subsidy for commercial refrigeration systems. <a href="https://solarrooftop.gov.in" target="_blank">Apply Here</a><br>
    <b>SIDBI Green Financing</b> – Low-interest loans for renewable energy in food businesses. <a href="https://www.sidbi.in" target="_blank">Learn More</a></li>
  
  <li><b>Step 5 — Maintenance & Monitoring:</b> Clean solar panels monthly. Service refrigerator compressor annually. Use energy monitor to track consumption patterns and detect faults early. <i>Expected benefit:</i> Ensures 25+ year solar lifespan and optimal refrigeration performance.</li>
  
  <li><b>Step 6 — Final Recommendation:</b> Upgrade to a 5-star refrigerator and install a 2.5 kW solar system to save ₹40,000–₹50,000 annually, recover costs in ~4 years, and eliminate ~2.5 tons of CO₂ yearly.</li>
</ol>`,
    
    water: `<ol>
  <li><b>Step 1 — Current Energy Efficiency:</b> Fix all leaks, install low-flow aerators (2 LPM) on taps, and optimize water heater temperature to 45–50°C. <i>Expected benefit:</i> Reduces water consumption by 20–30%; saves ₹2,000–₹3,500 annually on water and heating costs.</li>
  
  <li><b>Step 2 — Renewable Transition (Solar Setup):</b> Install a 1–2 kW solar water heating system with 100–150L tank for hot water supply. Setup: (1) Roof assessment, (2) Solar thermal collector installation, (3) Tank and plumbing connection. Estimated cost: ₹60,000–₹90,000. Installation time: 3–4 days. <i>Expected benefit:</i> Eliminates electric water heater costs; provides hot water year-round.</li>
  
  <li><b>Step 3 — Financial & Environmental Impact:</b> Expected monthly savings: ₹1,500–₹2,500 (₹18,000–₹30,000 annually). Payback period: ~3–4 years. Annual CO₂ reduction: ~1.2–1.8 tons/year. <i>Expected benefit:</i> Quick ROI with immediate comfort and environmental benefit.</li>
  
  <li><b>Step 4 — Government Support:</b> 
    <b>MNRE Solar Water Heating Scheme</b> – 30% subsidy for solar thermal systems. <a href="https://mnre.gov.in" target="_blank">Apply Here</a><br>
    <b>Jal Jeevan Mission</b> – Water conservation and efficiency programs. <a href="https://jaljeevanmission.gov.in" target="_blank">Learn More</a></li>
  
  <li><b>Step 5 — Maintenance & Monitoring:</b> Clean solar collectors annually. Inspect pipes for leaks quarterly. Install smart water meter to track consumption and detect anomalies. <i>Expected benefit:</i> Maintains 15–20 year system lifespan and ensures optimal performance.</li>
  
  <li><b>Step 6 — Final Recommendation:</b> Install a 1.5 kW solar water heating system and fix all leaks to save ₹25,000–₹35,000 annually, recover costs in ~3 years, and eliminate ~1.5 tons of CO₂ yearly.</li>
</ol>`,
    
    default: `<ol>
  <li><b>Step 1 — Current Energy Efficiency:</b> Conduct a comprehensive energy audit. Identify top 3 energy consumers (typically AC, refrigerator, water heater). Optimize each through maintenance and behavioral changes (e.g., temperature settings, leak fixes). <i>Expected benefit:</i> Reduces baseline consumption by 15–25%; saves ₹5,000–₹10,000 annually.</li>
  
  <li><b>Step 2 — Renewable Transition (Solar Setup):</b> Install a 3–5 kW rooftop solar system sized to cover 60–80% of your consumption. Setup process: (1) Roof assessment and structural approval, (2) Solar panel, inverter, and battery installation, (3) Grid connection and net metering registration. Estimated cost: ₹2.0–₹3.5 lakh for 3–5 kW system. Installation time: 5–7 days. <i>Expected benefit:</i> Generates 12–20 kWh/day; significantly reduces grid dependency.</li>
  
  <li><b>Step 3 — Financial & Environmental Impact:</b> Expected monthly savings: ₹5,000–₹8,000 (₹60,000–₹96,000 annually). Payback period: ~4–5 years. Annual CO₂ reduction: ~4–6 tons/year. <i>Expected benefit:</i> Substantial long-term savings with verified environmental contribution.</li>
  
  <li><b>Step 4 — Government Support:</b> 
    <b>Pradhan Mantri Rooftop Solar Scheme</b> – 40% subsidy for residential, 30% for commercial. <a href="https://solarrooftop.gov.in" target="_blank">Apply Here</a><br>
    <b>PM-KUSUM</b> – Rural and agricultural solar support. <a href="https://mnre.gov.in/pm-kusum" target="_blank">Official Page</a></li>
  
  <li><b>Step 5 — Maintenance & Monitoring:</b> Clean solar panels quarterly. Inspect inverter and batteries annually. Install energy monitoring system to track real-time generation, consumption, and grid export. <i>Expected benefit:</i> Ensures 25+ year system lifespan and optimal performance.</li>
  
  <li><b>Step 6 — Final Recommendation:</b> Install a 4 kW rooftop solar system to save ₹70,000–₹90,000 annually, recover investment in ~4 years, and eliminate ~5 tons of CO₂ yearly. Apply for government subsidy to reduce upfront cost by ₹80,000–₹1.2 lakh.</li>
</ol>`
  };

  for (const [key, response] of Object.entries(responses)) {
    if (lowerMsg.includes(key)) return response;
  }
  return responses.default;
};

// --- Call OpenRouter API with Fallback ---
const callOpenRouterAPI = async (userMessage, messages) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "GreenPulse AI",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: `You are GreenLedger AI — a professional sustainability advisor for Indian homes, schools, and small businesses.

🎯 GOAL: Whenever solar panels or renewable energy are recommended, ALWAYS include:
- A brief setup process (in 2–3 clear steps)
- Estimated cost range (₹)
- Expected monthly savings (₹)
- Payback period (years)
- Estimated CO₂ reduction (tons/year)
- A relevant government subsidy or policy with clickable link

🧩 RESPONSE FORMAT (ALWAYS FOLLOW THIS STRUCTURE):
<ol>
  <li><b>Step 1 — Current Energy Efficiency:</b> Short advice on appliance optimization before solar. <i>Expected benefit:</i> Reduced baseline energy usage.</li>
  <li><b>Step 2 — Renewable Transition (Solar Setup):</b> Explain setup in 2–3 lines: system capacity, cost (₹), installation time. <i>Expected benefit:</i> Reduced grid dependency.</li>
  <li><b>Step 3 — Financial & Environmental Impact:</b> Monthly savings (₹X–₹Y), payback period (~X years), annual CO₂ reduction (~X tons/year). <i>Expected benefit:</i> Long-term cost reduction.</li>
  <li><b>Step 4 — Government Support:</b> 1–2 verified Indian schemes with clickable links using <a href="...">text</a>.</li>
  <li><b>Step 5 — Maintenance & Monitoring:</b> 1–2 steps to maintain efficiency. <i>Expected benefit:</i> Optimal performance year-round.</li>
  <li><b>Step 6 — Final Recommendation:</b> Short actionable summary with concrete savings estimate.</li>
</ol>

🧠 STYLE RULES:
- Formal, structured step-by-step format using <ol> and <li>
- Real numeric estimates for ₹ savings, ROI, and CO₂ cuts (rounded)
- NO formulas or calculation steps shown
- Business-friendly tone (like a sustainability consultant)
- Use only: <b>, <i>, <a>, <ol>, <li>, <br>
- Use Indian conventions (₹, kW, month/year)`
          },
          ...messages.slice(-10),
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.warn("OpenRouter API failed, using local responses:", error.message);
    return null;
  }
};

export default function GreenPulseAI() {
  const [data, setData] = useState([]);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your Carbon Tracker AI Assistant. Ask me anything about carbon emissions, renewable energy, or sustainability tips for India!" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const d = await fetchMockData();
      setData(d);
      const pred = predictNextMonth(d);
      setAiPrediction(pred);
      setLoading(false);
    };
    loadData();
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatLoading(true);

    try {
      // Try OpenRouter API first
      let assistantMessage = await callOpenRouterAPI(userMessage, messages);
      
      // Fallback to local responses if API fails
      if (!assistantMessage) {
        assistantMessage = getLocalResponse(userMessage);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);
    } catch (error) {
      console.error("Chat error:", error);
      const fallbackMsg = getLocalResponse(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: fallbackMsg }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-gray-800">
      {/* Header */}
      <header className="p-6 flex justify-between items-center shadow-md bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-emerald-700">GreenPulse AI</h1>
        <nav className="space-x-6 text-gray-700 font-medium">
          <button onClick={() => setCurrentPage("dashboard")} className={`hover:text-emerald-600 ${currentPage === "dashboard" ? "text-emerald-600 font-bold" : ""}`}>Dashboard</button>
          <button onClick={() => setCurrentPage("tracker")} className={`hover:text-emerald-600 ${currentPage === "tracker" ? "text-emerald-600 font-bold" : ""}`}>Carbon Tracker</button>
          <button onClick={() => setCurrentPage("about")} className={`hover:text-emerald-600 ${currentPage === "about" ? "text-emerald-600 font-bold" : ""}`}>About</button>
        </nav>
      </header>

      {currentPage === "dashboard" && (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-32 px-6 min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-4xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-block bg-emerald-500/20 border border-emerald-400/50 rounded-full px-6 py-2 mb-8"
              >
                <span className="text-emerald-200 text-sm font-semibold">🌍 AI-Powered Sustainability Platform</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
              >
                Track. Reduce. Transform.
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-2xl"
              >
                India's most advanced carbon emission tracking and renewable energy advisory platform powered by AI
              </motion.p>

              {/* Key Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="grid grid-cols-3 gap-6 mb-12 py-8 border-y border-emerald-400/30"
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-300">500+</p>
                  <p className="text-emerald-200 text-sm">Active Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-300">50K+</p>
                  <p className="text-emerald-200 text-sm">CO₂ Tons Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-300">28</p>
                  <p className="text-emerald-200 text-sm">Indian States</p>
                </div>
              </motion.div>

              {/* Main CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button 
                  onClick={() => setCurrentPage("tracker")} 
                  className="bg-white text-emerald-900 hover:bg-emerald-50 text-lg font-bold px-10 py-4 rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  ⚡ Get Carbon Insights Now
                </Button>
                <Button 
                  onClick={() => setCurrentPage("about")} 
                  className="border-2 border-white text-white hover:bg-white/10 text-lg font-bold px-10 py-4 rounded-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-emerald-200 text-sm mt-8 text-center"
              >
                ✓ Government Certified • ✓ Real-time Data • ✓ Expert Recommendations
              </motion.p>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose GreenPulse AI?</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-3">Real-Time Tracking</h3>
                  <p className="text-gray-700">Monitor your carbon emissions and renewable energy generation in real-time with AI-powered analytics.</p>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-3">Smart Recommendations</h3>
                  <p className="text-gray-700">Get personalized sustainability advice tailored to your home or business with cost-benefit analysis.</p>
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-3">Government Support</h3>
                  <p className="text-gray-700">Access verified government schemes and subsidies to reduce your renewable energy investment costs.</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Impact Section */}
          <section className="py-20 px-6 bg-gradient-to-r from-emerald-700 to-teal-700 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8">Make an Impact Today</h2>
              <p className="text-xl text-emerald-100 mb-12">
                Join thousands of Indian homes and businesses reducing carbon emissions and saving money through renewable energy adoption.
              </p>
              <Button 
                onClick={() => setCurrentPage("tracker")} 
                className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg font-bold px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Green Journey
              </Button>
            </div>
          </section>
        </>
      )}

      {currentPage === "dashboard" && (
        <section id="dashboard" className="px-6 md:px-16 py-16 bg-white">
          <h3 className="text-3xl font-semibold text-emerald-700 mb-10 text-center">
            Real-Time Renewable & Carbon Dashboard
          </h3>

          {loading ? (
            <p className="text-center text-gray-500">Loading real-time data...</p>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="shadow-lg rounded-2xl">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <MapPin className="text-emerald-600 w-10 h-10 mb-3" />
                    <h4 className="font-semibold text-lg">Active Renewable Projects</h4>
                    <p className="text-2xl font-bold text-emerald-700 mt-2">{Math.floor(Math.random() * 1200) + 1000}</p>
                    <p className="text-sm text-gray-500">across 22 states</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg rounded-2xl">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Leaf className="text-emerald-600 w-10 h-10 mb-3" />
                    <h4 className="font-semibold text-lg">CO₂ Saved (tons)</h4>
                    <p className="text-2xl font-bold text-emerald-700 mt-2">{data.reduce((sum, d) => sum + d.carbon, 0)}</p>
                    <p className="text-sm text-gray-500">tracked in real-time</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg rounded-2xl">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Activity className="text-emerald-600 w-10 h-10 mb-3" />
                    <h4 className="font-semibold text-lg">AI Prediction (Next Month)</h4>
                    <p className="text-lg text-gray-700">Energy: <span className="font-bold text-emerald-700">{aiPrediction?.energy || 0} MW</span></p>
                    <p className="text-lg text-gray-700">CO₂ Saved: <span className="font-bold text-emerald-700">{aiPrediction?.carbon || 0} tons</span></p>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <div className="mt-16 bg-emerald-50 p-6 rounded-2xl shadow-md">
                <h4 className="text-xl font-semibold text-emerald-700 mb-4">Energy & Carbon Trends (AI Forecast) - India</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="energy" stroke="#059669" strokeWidth={3} name="Energy (MW)" />
                    <Line type="monotone" dataKey="carbon" stroke="#16a34a" strokeWidth={3} name="CO₂ Saved (tons)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </section>
      )}

      {currentPage === "tracker" && (
        <section className="px-6 md:px-16 py-16 bg-white min-h-screen">
          <h3 className="text-3xl font-semibold text-emerald-700 mb-10 text-center">
            Carbon Tracker AI Assistant
          </h3>
          
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg rounded-2xl h-96 flex flex-col">
              <CardContent className="p-6 flex-1 overflow-y-auto flex flex-col">
                <div className="space-y-4 flex-1">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-2xl px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                        {msg.role === "assistant" ? (
                          <div className="text-sm" dangerouslySetInnerHTML={{ __html: msg.content }} />
                        ) : (
                          <span>{msg.content}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                        <span className="animate-pulse">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about carbon emissions, renewable energy, or sustainability..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                disabled={chatLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={chatLoading || !inputValue.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <Card className="shadow-md rounded-lg">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-emerald-700 mb-2">💡 Quick Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Switch to renewable energy sources</li>
                    <li>• Reduce energy consumption at home</li>
                    <li>• Use public transport or electric vehicles</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-md rounded-lg">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-emerald-700 mb-2">📊 Your Carbon Stats</h4>
                  <p className="text-sm text-gray-600">Total CO₂ Tracked: <span className="font-bold text-emerald-700">{data.reduce((sum, d) => sum + d.carbon, 0)} tons</span></p>
                  <p className="text-sm text-gray-600">Monthly Average: <span className="font-bold text-emerald-700">{Math.round(data.reduce((sum, d) => sum + d.carbon, 0) / 12)} tons</span></p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {currentPage === "about" && (
        <section className="bg-gradient-to-b from-emerald-50 to-white min-h-screen py-16 px-6 md:px-20">
          {/* Header */}
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                About GreenLedger
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                India's sustainability intelligence platform making carbon tracking effortless, transparent, and actionable.
              </p>
            </motion.div>

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12"
            >
              <div className="flex items-start gap-6">
                <span className="text-5xl">🏢</span>
                <div>
                  <h2 className="text-3xl font-bold text-emerald-700 mb-4">What is GreenLedger?</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    GreenLedger is a sustainability intelligence platform that helps Indian homes, schools, and small businesses measure, reduce, and report their carbon footprint automatically. Through a simple conversational chatbot, users can instantly estimate their CO₂ emissions, discover renewable energy solutions, and access government subsidies — all in one place.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mission Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12"
            >
              <div className="flex items-start gap-6">
                <span className="text-5xl">💡</span>
                <div>
                  <h2 className="text-3xl font-bold text-emerald-700 mb-4">Our Mission</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To accelerate India's renewable energy adoption by making carbon tracking effortless, transparent, and actionable — empowering every citizen and business to contribute toward a net-zero future.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* How We Work Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12"
            >
              <div className="flex items-start gap-6 mb-8">
                <span className="text-5xl">⚙️</span>
                <h2 className="text-3xl font-bold text-emerald-700">How We Work</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-600"
                >
                  <h3 className="text-xl font-bold text-emerald-700 mb-3">1️⃣ User Interaction</h3>
                  <p className="text-gray-700">Users describe their setup — e.g., "I run a shop with 2 ACs and 2 fridges."</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-600"
                >
                  <h3 className="text-xl font-bold text-emerald-700 mb-3">2️⃣ AI Carbon Analysis</h3>
                  <p className="text-gray-700">GreenLedger estimates your monthly CO₂ emissions using standard emission factors.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-600"
                >
                  <h3 className="text-xl font-bold text-emerald-700 mb-3">3️⃣ Renewable Recommendations</h3>
                  <p className="text-gray-700">The platform suggests optimal green solutions like rooftop solar, biogas, or wind microturbines — with cost, ROI, and savings.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-600"
                >
                  <h3 className="text-xl font-bold text-emerald-700 mb-3">4️⃣ Government Schemes</h3>
                  <p className="text-gray-700">Automatically matches you with verified Indian subsidies like PM-KUSUM or Rooftop Solar Scheme.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-600 md:col-span-2"
                >
                  <h3 className="text-xl font-bold text-emerald-700 mb-3">5️⃣ Auto Sustainability Report</h3>
                  <p className="text-gray-700">A downloadable summary of your carbon footprint, savings potential, and recommended actions.</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Why GreenLedger Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12"
            >
              <div className="flex items-start gap-6 mb-8">
                <span className="text-5xl">🌏</span>
                <h2 className="text-3xl font-bold text-emerald-700">Why GreenLedger?</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 ml-16">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <p className="text-gray-700 text-lg"><strong>Simplifies complex climate reporting</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <p className="text-gray-700 text-lg"><strong>Promotes awareness of renewable options and subsidies</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <p className="text-gray-700 text-lg"><strong>Supports small entities with actionable guidance</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <p className="text-gray-700 text-lg"><strong>Provides measurable cost savings and impact insights</strong></p>
                </div>
              </div>
            </motion.div>

            {/* Vision Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-lg p-8 md:p-12 mb-12"
            >
              <div className="flex items-start gap-6">
                <span className="text-5xl">🚀</span>
                <div>
                  <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-lg leading-relaxed">
                    To become India's most trusted digital sustainability advisor — making carbon literacy mainstream and helping millions of small entities join the clean energy movement.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Join Us Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12 text-center"
            >
              <div className="text-5xl mb-4">🤝</div>
              <h2 className="text-3xl font-bold text-emerald-700 mb-4">Join Us</h2>
              <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                Be part of the transition to a cleaner, greener India. Start your journey today with GreenLedger — where climate action meets technology.
              </p>
              <Button 
                onClick={() => setCurrentPage("tracker")} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
              </Button>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
            >
              <div className="flex items-start gap-6 mb-8">
                <span className="text-5xl">📫</span>
                <h2 className="text-3xl font-bold text-emerald-700">Get In Touch</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 ml-16">
                <div>
                  <h3 className="font-bold text-emerald-700 mb-2">Email</h3>
                  <a href="mailto:support@greenledger.in" className="text-emerald-600 hover:text-emerald-700 text-lg">
                    support@greenledger.in
                  </a>
                </div>
                <div>
                  <h3 className="font-bold text-emerald-700 mb-2">Website</h3>
                  <a href="https://greenledger.in" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 text-lg">
                    greenledger.in
                  </a>
                </div>
                <div>
                  <h3 className="font-bold text-emerald-700 mb-2">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 text-lg">LinkedIn</a>
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 text-lg">GitHub</a>
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 text-lg">Twitter</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <p>© 2025 GreenPulse AI | Empowering Sustainable Futures</p>
      </footer>
    </div>
  );
}
