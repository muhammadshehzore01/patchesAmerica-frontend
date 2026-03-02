"use client";

import { useState } from "react";

export default function FAQSection({ faqs = [] }) {
  if (!faqs.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 drop-shadow-sm mb-12">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <FAQItem key={idx} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800 p-4 cursor-pointer">
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center"
      >
        <h3 className="text-lg font-semibold">{question}</h3>
        <span className="text-cyan-400">{open ? "-" : "+"}</span>
      </div>
      {open && <p className="mt-2 text-gray-300">{answer}</p>}
    </div>
  );
}