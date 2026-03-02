// app/custom-patches/[state]/[city]/CityContentClient.jsx
"use client";

import { motion } from "framer-motion";

export default function CityContentClient({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}