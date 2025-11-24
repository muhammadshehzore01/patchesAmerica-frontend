"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";

const STEP_TITLES = [
  "Contact Info",
  "Patch Details",
  "Size & Artwork",
  "Shape & Backing",
  "Quantity & Review"
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

const borderOptions = ["merrow", "heat-cut", "laser-cut"];
const threadOptions = ["normal", "gold", "silver", "glow"];
const quantityChoices = ["10","25","50","75","100","150","300","500","1000","3000","5000+"];

export default function PatchRequestWizard({
  apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", patch_type: "embroidered",
    embroidery_coverage: "50%", unit: "inches", width: "", height: "",
    shape: "custom", backing: "none", border: "merrow", thread: "normal",
    quantity: "", custom_qty: "", message: ""
  });
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]); // preview URLs
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  // Create & cleanup object URLs for previews
  useEffect(() => {
    // revoke old previews
    return () => {
      filePreviews.forEach(url => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // generate previews when files change
    // clean previous previews
    filePreviews.forEach(url => URL.revokeObjectURL(url));
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setFilePreviews(newPreviews);
    // cleanup on unmount handled above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleFiles = e => {
    const chosen = Array.from(e.target.files || []).slice(0, 10);
    setFiles(chosen);
  };

  const clearFiles = () => {
    filePreviews.forEach(url => URL.revokeObjectURL(url));
    setFilePreviews([]);
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onFormKeyDown = e => { if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") e.preventDefault(); };

  const validateStep = currentStep => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!form.name?.trim()) newErrors.name = "Name is required";
      if (!form.email?.trim()) newErrors.email = "Email is required";
      else { const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!re.test(form.email)) newErrors.email = "Invalid email"; }
    }
    if (currentStep === 2) {
      if (!form.width?.toString().trim()) newErrors.width = "Width is required";
      if (!form.height?.toString().trim()) newErrors.height = "Height is required";
    }
    if (currentStep === 4) {
      if (!form.quantity && !form.custom_qty) newErrors.quantity = "Select or enter quantity";
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, STEP_TITLES.length - 1)); };
  const prev = () => step > 0 && setStep(s => s - 1);

  const validateAll = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = "Name is required";
    if (!form.email?.trim()) newErrors.email = "Email is required";
    else { const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!re.test(form.email)) newErrors.email = "Invalid email"; }
    if (!form.width?.toString().trim()) newErrors.width = "Width is required";
    if (!form.height?.toString().trim()) newErrors.height = "Height is required";
    if (!form.quantity && !form.custom_qty) newErrors.quantity = "Select or enter quantity";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    setResult(null);
    if (!validateAll()) return;
    try {
      setSubmitting(true);
      const formData = new FormData();
      for (let key of ["name","email","phone","patch_type","embroidery_coverage","unit","width","height","shape","backing","border","thread","message"]) {
        formData.append(key, form[key] || "");
      }
      if (form.custom_qty) formData.append("custom_qty", form.custom_qty);
      else formData.append("quantity", form.quantity);
      files.forEach(f => formData.append("artworks", f));
      const response = await axios.post(`${apiBase}/patch-requests/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      // success: reset
      setForm({
        name: "", email: "", phone: "", patch_type: "embroidered", embroidery_coverage: "50%",
        unit: "inches", width: "", height: "", shape: "custom", backing: "none",
        border: "merrow", thread: "normal", quantity: "", custom_qty: "", message: ""
      });
      clearFiles();
      setErrors({});
      setResult({ ok: true, data: response.data });
      setStep(0);
    } catch (err) {
      const errData = err.response?.data || {};
      if (errData.errors) setErrors(prev => ({ ...prev, ...errData.errors }));
      setResult({ error: errData.detail || err.message || "Unknown error" });
    } finally { setSubmitting(false); }
  };

  // Tailwind-ready classes with improved mobile sizing
  const inputClass =
    "p-3 rounded-xl bg-gradient-to-r from-[#00113F] to-[#0B1ACD] border border-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400 outline-none w-full text-sm sm:text-base transition";
  const selectClass =
    "p-3 rounded-xl bg-blue-700 text-white border border-white/10 focus:ring-2 focus:ring-cyan-400 outline-none w-full text-sm sm:text-base appearance-none";
  const buttonClass =
    "px-5 py-2 rounded-full text-white border border-white/10 bg-cyan-500/20 hover:bg-cyan-600 hover:scale-105 transition-all duration-200";

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 max-h-[84vh]">
      {/* FORM */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
          <div>
            <div className="text-xs text-white/60">Step {step+1} of {STEP_TITLES.length}</div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-cyan-400 tracking-tight">{STEP_TITLES[step]}</h3>
          </div>

          {/* Desktop step circles */}
          <div className="hidden sm:flex items-center gap-3">
            {STEP_TITLES.map((_, i) => (
              <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${i<=step ? "bg-cyan-600 text-white shadow-[0_0_8px_cyan]" : "bg-white/10 text-white/60"} transition`}>{i+1}</div>
            ))}
          </div>
        </div>

        {/* Mobile horizontal step bar */}
        <div className="flex sm:hidden overflow-x-auto gap-2 pb-2">
          {STEP_TITLES.map((_, i) => (
            <div
              key={i}
              className={`min-w-[36px] h-9 rounded-full flex items-center justify-center text-xs font-semibold
                ${i <= step ? "bg-cyan-600 text-white shadow-[0_0_8px_cyan]" : "bg-white/10 text-white/60"}`}>
              {i + 1}
            </div>
          ))}
        </div>

        <form onKeyDown={onFormKeyDown} onSubmit={e=>e.preventDefault()} className="space-y-5 pb-28 sm:pb-6">
          <AnimatePresence mode="wait">
            {/* STEP 0 */}
            {step===0 && (
              <motion.div key="step-0" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} className="space-y-4">
                <input className={inputClass} placeholder="Full name *" value={form.name} onChange={e=>update("name", e.target.value)} />
                {errors.name && <div className="text-rose-400 text-sm">{errors.name}</div>}

                <input className={inputClass} placeholder="Email *" type="email" value={form.email} onChange={e=>update("email", e.target.value)} />
                {errors.email && <div className="text-rose-400 text-sm">{errors.email}</div>}

                <input className={inputClass} placeholder="Phone" value={form.phone} onChange={e=>update("phone", e.target.value)} />

                <textarea className={`${inputClass} min-h-[110px]`} placeholder="Order comments (optional)" value={form.message} onChange={e=>update("message", e.target.value)} />
              </motion.div>
            )}

            {/* STEP 1 */}
            {step===1 && (
              <motion.div key="step-1" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} className="space-y-4">
                <label className="text-sm text-white/70">Patch type</label>
                <select className={selectClass} value={form.patch_type} onChange={e=>update("patch_type", e.target.value)}>
                  <option value="embroidered">Embroidered</option>
                  <option value="leather">Leather</option>
                  <option value="chenille">Chenille</option>
                  <option value="printed">Printed</option>
                  <option value="pvc">PVC</option>
                  <option value="woven">Woven</option>
                  <option value="custom">Custom / Stickers</option>
                </select>

                <label className="text-sm text-white/70">Embroidery coverage</label>
                <select className={selectClass} value={form.embroidery_coverage} onChange={e=>update("embroidery_coverage", e.target.value)}>
                  <option value="50%">50% Embroidered</option>
                  <option value="75%">75% Embroidered</option>
                  <option value="100%">100% Embroidered</option>
                </select>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step===2 && (
              <motion.div key="step-2" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <select className={`${selectClass} w-full`} value={form.unit} onChange={e=>update("unit", e.target.value)}>
                    <option value="inches">Inches</option>
                    <option value="mm">Millimeters</option>
                    <option value="cm">Centimeters</option>
                  </select>
                  <input className={inputClass} placeholder="Width *" value={form.width} onChange={e=>update("width", e.target.value)} />
                  <input className={inputClass} placeholder="Height *" value={form.height} onChange={e=>update("height", e.target.value)} />
                </div>
                { (errors.width || errors.height) && <div className="text-rose-400 text-sm">{errors.width || errors.height}</div> }

                <div>
                  <label className="text-sm text-white/70 mb-1 block">Upload artwork (optional)</label>
                  <div className="flex flex-col sm:flex-row gap-3 border border-dashed border-white/10 rounded-xl p-3">
                    <div className="p-3 rounded-lg bg-white/4 flex items-center justify-center min-w-[60px]">
                      <FiUploadCloud className="text-cyan-400 text-2xl" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <input id="patch-files" ref={fileRef} type="file" multiple accept=".png,.jpg,.jpeg,.svg,.pdf" onChange={handleFiles} className="hidden" />
                      <div className="flex items-center gap-2">
                        <label htmlFor="patch-files" className="px-3 py-2 rounded-full bg-white/10 text-white cursor-pointer hover:bg-cyan-600 transition text-sm">Choose files</label>
                        {files.length > 0 && (
                          <button type="button" onClick={clearFiles} className="text-sm px-2 py-1 rounded-md bg-white/6 hover:bg-white/10 transition">Clear</button>
                        )}
                        <div className="text-xs text-white/60 ml-auto">{files.length} selected</div>
                      </div>

                      {/* Previews */}
                      <div className="flex gap-2 overflow-x-auto pt-2">
                        {filePreviews.map((u, i) => (
                          <div key={i} className="w-16 h-16 bg-white/4 rounded-md flex items-center justify-center overflow-hidden">
                            {/* PDFs/svg will show blank thumbnail sometimes; it's okay */}
                            <img src={u} alt={`preview-${i}`} className="w-full h-full object-contain" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step===3 && (
              <motion.div key="step-3" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} className="space-y-4">
                <label className="text-sm text-white/70 mb-1 block">Shape</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.keys(shapeThumbs).map(k => (
                    <button key={k} type="button" onClick={()=>update("shape",k)} className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${form.shape===k ? "border-cyan-400 bg-white/4 shadow-[0_0_8px_cyan]" : "border-white/10"} transition`}>
                      <img src={shapeThumbs[k]} alt={k} className="w-16 h-12 object-contain" />
                      <div className="text-xs text-white/60 capitalize">{k.replace("-"," ")}</div>
                    </button>
                  ))}
                </div>

                <label className="text-sm text-white/70 mb-1 block">Backing</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.keys(backingThumbs).map(k => (
                    <button key={k} type="button" onClick={()=>update("backing",k)} className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${form.backing===k ? "border-cyan-400 bg-white/4 shadow-[0_0_8px_cyan]" : "border-white/10"} transition`}>
                      <img src={backingThumbs[k]} alt={k} className="w-16 h-12 object-contain" />
                      <div className="text-xs text-white/60 capitalize">{k.replace("-"," ")}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4 */}
            {step===4 && (
              <motion.div key="step-4" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} className="space-y-4">
                <label className="text-sm text-white/70">Quantity</label>
                <div className="flex gap-2 items-center">
                  <select className={selectClass} value={form.quantity} onChange={e=>update("quantity", e.target.value)}>
                    <option value="">Select quantity</option>
                    {quantityChoices.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <input className={inputClass+" flex-1"} type="number" placeholder="Custom quantity" min={1} value={form.custom_qty} onChange={e=>update("custom_qty", e.target.value)} />
                </div>
                {errors.quantity && <div className="text-rose-400 text-sm mt-1">{errors.quantity}</div>}

                <label className="text-sm text-white/70">Border</label>
                <div className="flex gap-2 flex-wrap">
                  {borderOptions.map(b => (
                    <button key={b} type="button" onClick={()=>update("border",b)} className={`px-3 py-1 rounded-lg border ${form.border===b?"border-cyan-400 bg-white/4 shadow-[0_0_8px_cyan]":"border-white/20"}`}>{b}</button>
                  ))}
                </div>

                <label className="text-sm text-white/70">Thread</label>
                <div className="flex gap-2 flex-wrap">
                  {threadOptions.map(t => (
                    <button key={t} type="button" onClick={()=>update("thread",t)} className={`px-3 py-1 rounded-lg border ${form.thread===t?"border-cyan-400 bg-white/4 shadow-[0_0_8px_cyan]":"border-white/20"}`}>{t}</button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Navigation Buttons */}
          <div className="hidden sm:flex justify-between mt-4 sticky bottom-0 bg-black/6 p-3 rounded-b-2xl">
            <button type="button" className={buttonClass} onClick={prev} disabled={step===0}>Back</button>
            {step < STEP_TITLES.length-1 ? (
              <button type="button" className={buttonClass} onClick={next}>Next</button>
            ) : (
              <button type="button" className={buttonClass} onClick={submit} disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</button>
            )}
          </div>

          {result && result.ok && <div className="mt-3 text-green-400 font-semibold">✅ Your patch request was submitted!</div>}
          {result && result.error && <div className="mt-3 text-rose-400 font-semibold">❌ {result.error}</div>}
        </form>
      </div>

      {/* LIVE PREVIEW / SIDEBAR */}
      <div className="flex-1 bg-black/10 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-start overflow-hidden min-h-[260px]">
        <div className="relative w-full h-full max-h-[420px] bg-white/4 rounded-xl flex items-center justify-center p-4">
          {/* Backing visual */}
          {form.backing !== "none" && (
            <img src={backingThumbs[form.backing]} alt="backing" className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-xl" />
          )}

          {/* Patch outline */}
          <div
            className={`relative flex items-center justify-center ${form.shape === 'circle' ? 'rounded-full' : form.shape === 'square' ? 'rounded-none' : 'rounded-lg'}`}
            style={{
              width: form.width ? (isNaN(Number(form.width)) ? 100 : Number(form.width)) : 100,
              height: form.height ? (isNaN(Number(form.height)) ? 100 : Number(form.height)) : 100,
              minWidth: 48,
              minHeight: 48,
              maxWidth: "70%",
              maxHeight: "70%"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-[inherit] opacity-95" />
            {/* artwork previews */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 p-2">
              {filePreviews.slice(0,4).map((u,i) => <img key={i} src={u} alt={`art-${i}`} className="w-12 h-12 object-contain" />)}
            </div>
          </div>
        </div>

        <div className="mt-3 text-white text-sm text-center">
          Live Preview: <strong>{form.width || '0'}</strong> x <strong>{form.height || '0'}</strong> {form.unit} • Shape: <strong>{form.shape}</strong> • Backing: <strong>{form.backing}</strong>
        </div>
      </div>

      {/* Mobile sticky nav (fixed bottom) */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-[999]">
        <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between gap-3">
          {step > 0 ? (
            <button onClick={prev} className="px-4 py-2 rounded-full bg-white/6 text-white">Back</button>
          ) : <div className="w-14" />}

          {step < STEP_TITLES.length - 1 ? (
            <button onClick={next} className="px-4 py-2 rounded-full bg-cyan-600 text-white shadow-[0_0_10px_cyan]">Next</button>
          ) : (
            <button onClick={submit} disabled={submitting} className="px-4 py-2 rounded-full bg-cyan-600 text-white shadow-[0_0_10px_cyan]">
              {submitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
