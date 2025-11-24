"use client";

import { motion } from "framer-motion";

const stepsData = [
  { title: "Choose Patch Style", description: "Pick embroidery, woven, or custom textures.", icon: "🎨" },
  { title: "Upload Artwork", description: "Send your design for precise reproduction.", icon: "🖌️" },
  { title: "Select Size & Quantity", description: "Define the patch dimensions and order quantity.", icon: "📏" },
  { title: "Confirm & Receive", description: "We craft and deliver your premium patch.", icon: "🚚" },
];

export default function StepsSection({ selections = [] }) {
  const steps = selections.length ? selections : stepsData;

  return (
    <section className="max-w-7xl mx-auto py-16 px-6 md:px-12 text-white">
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] via-[#FF914D] to-[#FFD54D] mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        How It Works
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.7 }}
            className="relative bg-gradient-to-br from-black/30 via-black/20 to-black/10 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-[0_0_30px_rgba(255,77,109,0.4)] transition-shadow duration-500"
          >
            <div className="text-5xl mb-4 animate-bounce">{step.icon}</div>
            <h3 className="font-semibold text-xl mb-2 text-white">{step.title}</h3>
            <p className="text-gray-300 text-sm md:text-base">{step.description}</p>

            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-tr from-[#FF4D6D]/30 via-[#FF914D]/20 to-[#FFD54D]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-tr from-[#FFD54D]/20 via-[#FF914D]/10 to-[#FF4D6D]/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
