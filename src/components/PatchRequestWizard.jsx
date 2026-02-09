// src/components/PatchRequestWizard.jsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiX, FiLoader, FiCheckCircle } from "react-icons/fi";

/* =========================
   GA4 SAFE EVENT HELPER WITH RETRY
========================= */
const gaEvent = (name, params = {}, retries = 5, delay = 500) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
    console.log("✅ GA4 event fired:", name, params);
  } else if (retries > 0) {
    setTimeout(() => gaEvent(name, params, retries - 1, delay), delay);
  }
};

/* =========================
   STEP TITLES & CONSTANTS
========================= */
const STEP_TITLES = [
  "Contact Info",
  "Patch Details & Size",
  "Shape, Backing & Options",
  "Preview & Submit"
];

const shapeThumbs = {
  custom: "/assets/shapes/custom.png",
  circle: "/assets/shapes/circle.png",
  square: "/assets/shapes/square.png",
  "h-oval": "/assets/shapes/h-oval.png",
  "h-rect": "/assets/shapes/h-rect.png",
  "v-rect": "/assets/shapes/v-rect.png",
  diamond: "/assets/shapes/diamond.png",
  "v-oval": "/assets/shapes/v-oval.png",
  "shield-a": "/assets/shapes/shield-a.png",
  "shield-b": "/assets/shapes/shield-b.png",
  "shield-c": "/assets/shapes/shield-c.png",
  "shield-d": "/assets/shapes/shield-d.png"
};

const backingThumbs = {
  none: "/assets/backings/no-backing.jpg",
  iron: "/assets/backings/iron-on.png",
  adhesive: "/assets/backings/adhesive.png",
  plastic: "/assets/backings/plastic.jpeg",
  "velcro-hook": "/assets/backings/velcro-hook.jpg",
  "velcro-loop": "/assets/backings/velcro-loop.jpg",
  "velcro-both": "/assets/backings/velcro-both.webp",
  "safety-pin": "/assets/backings/safety-pin.jpeg"
};

const leatherThumbs = {
  genuine: "/assets/leather/genuine.png",
  faux: "/assets/leather/faux.png",
  suede: "/assets/leather/suede.png",
  rustic: "/assets/leather/rustic.png"
};

const finishThumbs = {
  embossed: "/assets/finish/embossed.png",
  debossed: "/assets/finish/debossed.png",
  engraving: "/assets/finish/engraving.png",
  printed: "/assets/finish/printed.png"
};

const borderOptions = ["merrow", "heat-cut", "laser-cut"];
const threadOptions = ["normal", "gold", "silver", "glow"];
const quantityChoices = ["10", "25", "50", "75", "100", "150", "300", "500", "1000", "3000", "5000+"];
const dimensionOptions = ["2D", "3D"];
const embroideryCoverageOptions = ["50%", "75%", "100%"];

export default function PatchRequestWizard({
  apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    patch_type: "embroidered",
    embroidery_coverage: "50%",
    dimension: "2D",
    leather_type: "genuine",
    finish_effect: "embossed",
    unit: "inches",
    width: "",
    height: "",
    shape: "custom",
    backing: "none",
    border: "merrow",
    thread: "normal",
    quantity: "",
    custom_qty: "",
    message: ""
  });

  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const fileRef = useRef();

  // Memoized previews to avoid re-creating URLs unnecessarily
  const previews = useMemo(() => files.map(f => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    setFilePreviews(previews);
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const copy = { ...prev }; delete copy[key]; return copy; });
  };

  const handleFiles = e => {
    const chosen = Array.from(e.target.files || [])
      .filter(f => f.type.startsWith("image/") || f.type === "application/pdf")
      .slice(0, 5); // UX limit
    setFiles(prev => [...prev, ...chosen]);
  };

  const removeFile = index => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* =========================
     STEP VALIDATION
  ========================= */
  const validateStep = s => {
    const newErrors = {};

    if (s === 0) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "Valid email is required";
      }
    }

    if (s === 1) {
      if (!form.width || isNaN(Number(form.width)) || Number(form.width) <= 0) {
        newErrors.width = "Valid width required";
      }
      if (!form.height || isNaN(Number(form.height)) || Number(form.height) <= 0) {
        newErrors.height = "Valid height required";
      }
    }

    if (s === 2) {
      if (!form.quantity && !form.custom_qty) {
        newErrors.quantity = "Select or enter quantity";
      }
      if (form.custom_qty && (isNaN(Number(form.custom_qty)) || Number(form.custom_qty) < 1)) {
        newErrors.custom_qty = "Valid number required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, STEP_TITLES.length - 1));
      gaEvent("wizard_step_advance", { step: step + 1 });
    }
  };

  const prev = () => {
    setStep(s => Math.max(s - 1, 0));
    gaEvent("wizard_step_back", { step: step });
  };

  /* =========================
     FINAL SUBMIT + GA4 CONVERSION
  ========================= */
  const submit = async () => {
    if (!validateStep(2)) return;

    setSubmitting(true);
    setResult(null);

    try {
      const formData = new FormData();

      // Append text fields
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "" && v !== null && k !== "artworks") {
          formData.append(k, v);
        }
      });

      // Ensure numeric values
      if (form.width) formData.set("width", Number(form.width));
      if (form.height) formData.set("height", Number(form.height));
      if (form.custom_qty) {
        formData.set("custom_qty", Number(form.custom_qty));
        formData.delete("quantity");
      }

      // Append files
      files.forEach(f => formData.append("artworks", f));

      const res = await axios.post(`${apiBase}/patch-requests/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Fire GA4 conversion event
      gaEvent("generate_lead", {
        event_category: "Conversion",
        event_label: "Patch Request Submitted",
        patch_type: form.patch_type,
        quantity: form.custom_qty || form.quantity,
        has_artwork: files.length > 0 ? "yes" : "no",
        value: 1 // optional: assign estimated lead value
      });

      setResult({
        ok: true,
        message: "Your patch request has been submitted successfully!"
      });

      // Reset form after success
      setForm({
        name: "", email: "", phone: "",
        patch_type: "embroidered", embroidery_coverage: "50%",
        dimension: "2D", leather_type: "genuine", finish_effect: "embossed",
        unit: "inches", width: "", height: "",
        shape: "custom", backing: "none", border: "merrow",
        thread: "normal", quantity: "", custom_qty: "", message: ""
      });
      setFiles([]);
      setStep(0);

    } catch (err) {
      console.error(err);
      setResult({
        error: err.response?.data?.errors || err.message || "Submission failed. Please try again."
      });
      gaEvent("form_error", {
        event_category: "Form",
        event_label: "Patch Request Failed",
        error: err.message?.slice(0, 100)
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     UI CLASSES (consistent & reusable)
  ========================= */
  const inputClass = "p-3 rounded-2xl bg-gradient-to-r from-[#00113F] to-[#0B1ACD] border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 outline-none w-full transition";
  const selectClass = "p-3 rounded-2xl bg-blue-900 text-white border border-white/10 focus:ring-2 focus:ring-cyan-400 outline-none w-full appearance-none transition";
  const buttonClass = "px-6 py-2 rounded-full text-white border border-white/10 bg-cyan-500/30 hover:bg-cyan-600 transition shadow-[0_0_12px_cyan] disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="px-3 py-4 sm:p-4">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div>
            <div className="text-xs text-white/60">Step {step + 1} of {STEP_TITLES.length}</div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-cyan-400 tracking-tight">{STEP_TITLES[step]}</h3>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {STEP_TITLES.map((_, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                  i <= step ? "bg-cyan-600 text-white shadow-[0_0_8px_cyan]" : "bg-white/10 text-white/60"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <form
          onKeyDown={e => { if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") e.preventDefault(); }}
          onSubmit={e => e.preventDefault()}
          className="space-y-5 pb-28 sm:pb-6"
        >
          <AnimatePresence mode="wait">
            {/* STEP 0: Contact Info */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <input
                    className={`${inputClass} ${errors.name ? "border-rose-500" : ""}`}
                    placeholder="Full name *"
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" className="text-rose-400 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    className={`${inputClass} ${errors.email ? "border-rose-500" : ""}`}
                    placeholder="Email *"
                    type="email"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <p id="email-error" className="text-rose-400 text-sm mt-1">{errors.email}</p>}
                </div>
                <input
                  className={inputClass}
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                />
                <textarea
                  className={`${inputClass} min-h-[110px]`}
                  placeholder="Order comments or special instructions (optional)"
                  value={form.message}
                  onChange={e => update("message", e.target.value)}
                />
              </motion.div>
            )}

            {/* STEP 1: Patch Details & Size */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div>
                  <label className="text-sm text-white/70 block mb-1">Patch type *</label>
                  <select
                    className={selectClass}
                    value={form.patch_type}
                    onChange={e => update("patch_type", e.target.value)}
                  >
                    <option value="embroidered">Embroidered</option>
                    <option value="leather">Leather</option>
                    <option value="chenille">Chenille</option>
                    <option value="printed">Printed</option>
                    <option value="pvc">PVC</option>
                    <option value="woven">Woven</option>
                    <option value="custom">Custom / Stickers</option>
                  </select>
                </div>

                {form.patch_type === "embroidered" && (
                  <div>
                    <label className="text-sm text-white/70 block mb-1">Embroidery coverage</label>
                    <select
                      className={selectClass}
                      value={form.embroidery_coverage}
                      onChange={e => update("embroidery_coverage", e.target.value)}
                    >
                      {embroideryCoverageOptions.map(v => (
                        <option key={v} value={v}>{v} Embroidered</option>
                      ))}
                    </select>
                  </div>
                )}

                {form.patch_type === "leather" && (
                  <>
                    <div>
                      <label className="text-sm text-white/70 block mb-1">Leather Type</label>
                      <select
                        className={selectClass}
                        value={form.leather_type}
                        onChange={e => update("leather_type", e.target.value)}
                      >
                        {Object.keys(leatherThumbs).map(l => (
                          <option key={l} value={l}>
                            {l.charAt(0).toUpperCase() + l.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-white/70 block mb-1">Finish Effect</label>
                      <select
                        className={selectClass}
                        value={form.finish_effect}
                        onChange={e => update("finish_effect", e.target.value)}
                      >
                        {Object.keys(finishThumbs).map(f => (
                          <option key={f} value={f}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-sm text-white/70 block mb-1">Dimensions *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      className={selectClass}
                      value={form.unit}
                      onChange={e => update("unit", e.target.value)}
                    >
                      <option value="inches">Inches</option>
                      <option value="mm">Millimeters</option>
                      <option value="cm">Centimeters</option>
                    </select>
                    <div>
                      <input
                        className={`${inputClass} ${errors.width ? "border-rose-500" : ""}`}
                        placeholder="Width *"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={form.width}
                        onChange={e => update("width", e.target.value)}
                        aria-invalid={!!errors.width}
                        aria-describedby={errors.width ? "width-error" : undefined}
                      />
                      {errors.width && <p id="width-error" className="text-rose-400 text-sm mt-1">{errors.width}</p>}
                    </div>
                    <div>
                      <input
                        className={`${inputClass} ${errors.height ? "border-rose-500" : ""}`}
                        placeholder="Height *"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={form.height}
                        onChange={e => update("height", e.target.value)}
                        aria-invalid={!!errors.height}
                        aria-describedby={errors.height ? "height-error" : undefined}
                      />
                      {errors.height && <p id="height-error" className="text-rose-400 text-sm mt-1">{errors.height}</p>}
                    </div>
                  </div>
                </div>

                {form.patch_type === "pvc" && (
                  <div>
                    <label className="text-sm text-white/70 block mb-1">Dimension Type</label>
                    <select
                      className={selectClass}
                      value={form.dimension}
                      onChange={e => update("dimension", e.target.value)}
                    >
                      {dimensionOptions.map(d => (
                        <option key={d} value={d}>{d} Mold</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Artwork Upload */}
                <div>
                  <label className="text-sm text-white/70 block mb-1">Upload artwork (optional, max 5 files)</label>
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-4 text-center">
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFiles}
                      className="hidden"
                      id="patch-files"
                    />
                    <label
                      htmlFor="patch-files"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white hover:bg-cyan-600 transition"
                    >
                      <FiUploadCloud size={20} />
                      Choose files
                    </label>
                    <p className="text-xs text-white/60 mt-2">PNG, JPG, PDF • Max 5 files</p>

                    {files.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {files.map((file, i) => (
                          <div key={i} className="relative group">
                            <div className="bg-white/5 rounded-lg p-2 text-center text-xs truncate">
                              {file.name}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Shape, Backing & Options */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                {/* Shape Selection */}
                <div>
                  <label className="text-sm text-white/70 block mb-2">Shape</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {Object.entries(shapeThumbs).map(([key, thumb]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => update("shape", key)}
                        className={`p-2 rounded-xl border transition text-center ${
                          form.shape === key
                            ? "border-cyan-400 bg-cyan-900/30 shadow-[0_0_10px_cyan]"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img src={thumb} alt={key} className="w-full h-16 object-contain mx-auto" />
                        <div className="text-xs mt-1 capitalize text-white/80">{key.replace("-", " ")}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Backing Selection */}
                <div>
                  <label className="text-sm text-white/70 block mb-2">Backing</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {Object.entries(backingThumbs).map(([key, thumb]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => update("backing", key)}
                        className={`p-2 rounded-xl border transition text-center ${
                          form.backing === key
                            ? "border-cyan-400 bg-cyan-900/30 shadow-[0_0_10px_cyan]"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img src={thumb} alt={key} className="w-full h-16 object-contain mx-auto" />
                        <div className="text-xs mt-1 capitalize text-white/80">{key.replace("-", " ")}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm text-white/70 block mb-1">Quantity *</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      className={`${selectClass} ${errors.quantity ? "border-rose-500" : ""}`}
                      value={form.quantity}
                      onChange={e => update("quantity", e.target.value)}
                    >
                      <option value="">Select quantity</option>
                      {quantityChoices.map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                    <input
                      className={`${inputClass} ${errors.custom_qty ? "border-rose-500" : ""}`}
                      type="number"
                      placeholder="Custom quantity"
                      min={1}
                      value={form.custom_qty}
                      onChange={e => update("custom_qty", e.target.value)}
                    />
                  </div>
                  {(errors.quantity || errors.custom_qty) && (
                    <p className="text-rose-400 text-sm mt-1">
                      {errors.quantity || errors.custom_qty}
                    </p>
                  )}
                </div>

                {/* Border & Thread */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-white/70 block mb-1">Border</label>
                    <div className="flex flex-wrap gap-2">
                      {borderOptions.map(b => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => update("border", b)}
                          className={`px-4 py-2 rounded-full text-sm ${
                            form.border === b ? "bg-cyan-600 text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
                          } transition`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/70 block mb-1">Thread</label>
                    <div className="flex flex-wrap gap-2">
                      {threadOptions.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => update("thread", t)}
                          className={`px-4 py-2 rounded-full text-sm ${
                            form.thread === t ? "bg-cyan-600 text-white" : "bg-white/10 text-white/80 hover:bg-white/20"
                          } transition`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Preview & Submit */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <h4 className="text-lg font-semibold text-cyan-300">Review Your Patch Request</h4>

                <div className="p-5 bg-gradient-to-br from-blue-950/50 to-indigo-950/50 rounded-2xl border border-white/10 space-y-3 text-sm">
                  <div><strong>Name:</strong> {form.name || "—"}</div>
                  <div><strong>Email:</strong> {form.email || "—"}</div>
                  <div><strong>Phone:</strong> {form.phone || "—"}</div>
                  <div><strong>Patch Type:</strong> {form.patch_type}</div>
                  {form.patch_type === "embroidered" && <div><strong>Coverage:</strong> {form.embroidery_coverage}</div>}
                  {form.patch_type === "leather" && (
                    <>
                      <div><strong>Leather Type:</strong> {form.leather_type}</div>
                      <div><strong>Finish:</strong> {form.finish_effect}</div>
                    </>
                  )}
                  <div><strong>Dimensions:</strong> {form.width} × {form.height} {form.unit}</div>
                  <div><strong>Shape:</strong> {form.shape.replace("-", " ")}</div>
                  <div><strong>Backing:</strong> {form.backing.replace("-", " ")}</div>
                  <div><strong>Quantity:</strong> {form.custom_qty || form.quantity}</div>
                  <div><strong>Border:</strong> {form.border}</div>
                  <div><strong>Thread:</strong> {form.thread}</div>
                  {form.message && <div><strong>Comments:</strong> {form.message}</div>}

                  <div className="pt-3 border-t border-white/10">
                    <strong>Artwork ({files.length}):</strong>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                      {previews.map((url, i) => (
                        <img key={i} src={url} alt={`preview-${i}`} className="w-full h-20 object-cover rounded-lg" />
                      ))}
                    </div>
                  </div>
                </div>

                {result && result.error && (
                  <div className="p-4 bg-rose-900/30 border border-rose-500 rounded-xl text-rose-300">
                    {result.error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 sticky bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-6 pb-4 -mx-4 px-4">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className={`${buttonClass} disabled:opacity-40`}
            >
              Back
            </button>

            {step < STEP_TITLES.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className={buttonClass}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting || Object.keys(errors).length > 0}
                className={`${buttonClass} flex items-center gap-2 disabled:opacity-50`}
              >
                {submitting ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            )}
          </div>
        </form>

        {result?.ok && (
          <div className="text-center py-8 text-green-400 font-semibold text-xl">
            <FiCheckCircle className="inline-block mr-2 text-3xl" />
            Thank you! Your patch request has been submitted successfully.
            <p className="text-base mt-2 text-white/70">
              We will get back to you soon.
            </p>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          {step > 0 && (
            <button onClick={prev} className="px-6 py-3 bg-white/10 rounded-full text-white">
              Back
            </button>
          )}
          {step < STEP_TITLES.length - 1 ? (
            <button onClick={next} className="px-8 py-3 bg-cyan-600 rounded-full text-white shadow-lg shadow-cyan-500/30 flex-1 ml-auto">
              Next
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="px-8 py-3 bg-cyan-600 rounded-full text-white shadow-lg shadow-cyan-500/30 flex-1 ml-auto flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <FiLoader className="animate-spin" /> : null}
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}