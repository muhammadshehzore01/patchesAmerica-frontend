"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";

// Step titles
const STEP_TITLES = [
  "Contact Info",
  "Patch Details & Size",
  "Shape, Backing & Options",
  "Preview & Submit"
];

// Shape thumbnails
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

// Backing thumbnails
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

// Leather type thumbnails
const leatherThumbs = {
  genuine: "/assets/leather/genuine.png",
  faux: "/assets/leather/faux.png",
  suede: "/assets/leather/suede.png",
  rustic: "/assets/leather/rustic.png"
};

// Finish effect thumbnails
const finishThumbs = {
  embossed: "/assets/finish/embossed.png",
  debossed: "/assets/finish/debossed.png",
  engraving: "/assets/finish/engraving.png",
  printed: "/assets/finish/printed.png"
};

// Options
const borderOptions = ["merrow", "heat-cut", "laser-cut"];
const threadOptions = ["normal", "gold", "silver", "glow"];
const quantityChoices = ["10","25","50","75","100","150","300","500","1000","3000","5000+"];
const dimensionOptions = ["2D", "3D"];
const embroideryCoverageOptions = ["50%", "75%", "100%"];
const leatherTypes = Object.keys(leatherThumbs);
const finishEffects = Object.keys(finishThumbs);

export default function PatchRequestWizard({ apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000" }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    patch_type: "embroidered", embroidery_coverage: "50%",
    dimension: "2D", leather_type: "genuine", finish_effect: "embossed",
    unit: "inches", width: "", height: "",
    shape: "custom", backing: "none", border: "merrow",
    thread: "normal", quantity: "", custom_qty: "", message: ""
  });
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  // File previews
  useEffect(() => {
    filePreviews.forEach(url => URL.revokeObjectURL(url));
    const previews = files.map(f => URL.createObjectURL(f));
    setFilePreviews(previews);
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [files]);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const copy = { ...prev }; delete copy[key]; return copy; });
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

  const validateStep = s => {
    const newErrors = {};
    if (s === 0) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      else { const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!re.test(form.email)) newErrors.email = "Invalid email"; }
    }
    if (s === 1) {
      if ((form.patch_type === "leather" || form.patch_type === "pvc") && !form.width.trim()) newErrors.width = "Width is required";
      if ((form.patch_type === "leather" || form.patch_type === "pvc") && !form.height.trim()) newErrors.height = "Height is required";
      if (form.patch_type === "embroidered" && !form.embroidery_coverage) newErrors.embroidery_coverage = "Select coverage";
      if (form.patch_type === "leather") {
        if (!form.leather_type) newErrors.leather_type = "Select leather type";
        if (!form.finish_effect) newErrors.finish_effect = "Select finish effect";
      }
      if (form.patch_type === "pvc" && !form.dimension) newErrors.dimension = "Select dimension";
    }
    if (s === 2) {
      if (!form.quantity && !form.custom_qty) newErrors.quantity = "Select or enter quantity";
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(s => Math.min(s+1, STEP_TITLES.length-1)); };
  const prev = () => setStep(s => Math.max(s-1, 0));

  const validateAll = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else { const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!re.test(form.email)) newErrors.email = "Invalid email"; }
    if ((form.patch_type === "leather" || form.patch_type === "pvc") && !form.width.trim()) newErrors.width = "Width is required";
    if ((form.patch_type === "leather" || form.patch_type === "pvc") && !form.height.trim()) newErrors.height = "Height is required";
    if (form.patch_type === "embroidered" && !form.embroidery_coverage) newErrors.embroidery_coverage = "Select coverage";
    if (form.patch_type === "leather") {
      if (!form.leather_type) newErrors.leather_type = "Select leather type";
      if (!form.finish_effect) newErrors.finish_effect = "Select finish effect";
    }
    if (form.patch_type === "pvc" && !form.dimension) newErrors.dimension = "Select dimension";
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
      for (let key of ["name","email","phone","patch_type","embroidery_coverage","dimension","leather_type","finish_effect","unit","width","height","shape","backing","border","thread","message"]) {
        formData.append(key, form[key] || "");
      }
      if (form.custom_qty) formData.append("custom_qty", form.custom_qty);
      else formData.append("quantity", form.quantity);
      files.forEach(f => formData.append("artworks", f));
      const response = await axios.post(`${apiBase}/patch-requests/`, formData, { headers: { "Content-Type": "multipart/form-data" } });

      setForm({
        name: "", email: "", phone: "",
        patch_type: "embroidered", embroidery_coverage: "50%",
        dimension: "2D", leather_type: "genuine", finish_effect: "embossed",
        unit: "inches", width: "", height: "",
        shape: "custom", backing: "none", border: "merrow",
        thread: "normal", quantity: "", custom_qty: "", message: ""
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

  // === YOUR THEME CSS CLASSES ===
  const inputClass = "p-3 rounded-2xl bg-gradient-to-r from-[#00113F] to-[#0B1ACD] border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 outline-none w-full text-sm sm:text-base transition shadow-neon";
  const selectClass = "p-3 rounded-2xl bg-blue-900 text-white border border-white/10 focus:ring-2 focus:ring-cyan-400 outline-none w-full text-sm sm:text-base appearance-none shadow-neon";
  const buttonClass = "px-6 py-2 rounded-full text-white border border-white/10 bg-cyan-500/30 hover:bg-cyan-600 hover:scale-105 transition-all duration-200 shadow-neon";

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="px-3 py-4 sm:p-4">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
          <div>
            <div className="text-xs text-white/60">Step {step+1} of {STEP_TITLES.length}</div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-cyan-400 tracking-tight">{STEP_TITLES[step]}</h3>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {STEP_TITLES.map((_, i) => (
              <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${i<=step ? "bg-cyan-600 text-white shadow-[0_0_8px_cyan]" : "bg-white/10 text-white/60"} transition`}>{i+1}</div>
            ))}
          </div>
        </div>

        <form onKeyDown={e=>{ if(e.key==="Enter" && e.target.tagName!=="TEXTAREA") e.preventDefault(); }} onSubmit={e=>e.preventDefault()} className="space-y-5 pb-28 sm:pb-6">
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

                {/* Embroidery coverage */}
                {form.patch_type === "embroidered" && (
                  <>
                    <label className="text-sm text-white/70 mt-2">Embroidery coverage</label>
                    <select className={selectClass} value={form.embroidery_coverage} onChange={e=>update("embroidery_coverage", e.target.value)}>
                      {embroideryCoverageOptions.map(v => <option key={v} value={v}>{v} Embroidered</option>)}
                    </select>
                  </>
                )}

                {/* Leather specific */}
                {form.patch_type === "leather" && (
                  <>
                    <label className="text-sm text-white/70 mt-2">Leather Type</label>
                    <select className={selectClass} value={form.leather_type} onChange={e=>update("leather_type", e.target.value)}>
                      {leatherTypes.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                    </select>

                    <label className="text-sm text-white/70 mt-2">Finish Effect</label>
                    <select className={selectClass} value={form.finish_effect} onChange={e=>update("finish_effect", e.target.value)}>
                      {finishEffects.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                    </select>
                  </>
                )}

                {/* Width/Height/Unit */}
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center mt-2">
                  <select className={`${selectClass} w-full`} value={form.unit} onChange={e=>update("unit", e.target.value)}>
                    <option value="inches">Inches</option>
                    <option value="mm">Millimeters</option>
                    <option value="cm">Centimeters</option>
                  </select>
                  <input className={inputClass} placeholder="Width *" value={form.width} onChange={e=>update("width", e.target.value)} />
                  <input className={inputClass} placeholder="Height *" value={form.height} onChange={e=>update("height", e.target.value)} />
                </div>
                

                {/* PVC dimension select */}
                {form.patch_type === "pvc" && (
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 items-center mt-2">
                    <label className="text-sm text-white/70">Dimension</label>
                    <select className={selectClass} value={form.dimension} onChange={e=>update("dimension", e.target.value)}>
                      {dimensionOptions.map(d => <option key={d} value={d}>{d} Mold</option>)}
                    </select>
                  </div>
                )}

                {/* Artwork upload */}
                <div className="mt-2">
                  <label className="text-sm text-white/70 mb-1 block">Upload artwork (optional)</label>
                  <div className="flex flex-col sm:flex-row gap-3 border border-dashed border-white/10 rounded-2xl p-3">
                    <div className="p-3 rounded-lg bg-white/4 flex items-center justify-center min-w-[60px]">
                      <FiUploadCloud className="text-cyan-400 text-2xl" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <input id="patch-files" ref={fileRef} type="file" multiple accept=".png,.jpg,.jpeg,.svg,.pdf" onChange={handleFiles} className="hidden" />
                      <div className="flex items-center gap-2">
                        <label htmlFor="patch-files" className="px-3 py-2 rounded-full bg-white/10 text-white cursor-pointer hover:bg-cyan-600 transition text-sm">Choose files</label>
                        {files.length>0 && <button type="button" onClick={clearFiles} className="text-sm px-2 py-1 rounded-md bg-white/6 hover:bg-white/10 transition">Clear</button>}
                        <div className="text-xs text-white/60 ml-auto">{files.length} selected</div>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pt-2">
                        {filePreviews.map((u,i)=>(
                          <div key={i} className="w-16 h-16 bg-white/10 rounded-md flex-shrink-0">
                            <img src={u} className="w-full h-full object-cover rounded-md" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 - Shape & Options */}
            {step===2 && (
              <motion.div key="step-2" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} className="space-y-4">
                {/* Shape */}
                <label className="text-sm text-white/70 mb-1 block">Shape</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.keys(shapeThumbs).map(k => (
                    <button key={k} type="button" onClick={()=>update("shape",k)} className={`p-2 rounded-2xl border flex flex-col items-center gap-1 ${form.shape===k ? "border-cyan-400 bg-white/4 shadow-[0_0_8px_cyan]" : "border-white/10"} transition`}>
                      <img src={shapeThumbs[k]} alt={k} className="w-16 h-12 object-contain" />
                      <div className="text-xs text-white/60 capitalize">{k.replace("-"," ")}</div>
                    </button>
                  ))}
                </div>

                {/* Backing */}
                <label className="text-sm text-white/70 mb-1 block">Backing</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.keys(backingThumbs).map(k => (
                    <button key={k} type="button" onClick={()=>update("backing",k)} className={`p-2 rounded-2xl border flex flex-col items-center gap-1 ${form.backing===k ? "border-cyan-400 bg-white/4 shadow-[0_0_8px_cyan]" : "border-white/10"} transition`}>
                      <img src={backingThumbs[k]} alt={k} className="w-16 h-12 object-contain" />
                      <div className="text-xs text-white/60 capitalize">{k.replace("-"," ")}</div>
                    </button>
                  ))}
                </div>

                {/* Quantity */}
                <label className="text-sm text-white/70">Quantity</label>
                <div className="flex gap-2 items-center">
                  <select className={selectClass} value={form.quantity} onChange={e=>update("quantity", e.target.value)}>
                    <option value="">Select quantity</option>
                    {quantityChoices.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <input className={`${inputClass} flex-1`} type="number" placeholder="Custom quantity" min={1} value={form.custom_qty} onChange={e=>update("custom_qty", e.target.value)} />
                </div>
                {errors.quantity && <div className="text-rose-400 text-sm mt-1">{errors.quantity}</div>}

                {/* Border */}
                <label className="text-sm text-white/70">Border</label>
                <div className="flex gap-2 flex-wrap">
                  {borderOptions.map(b => (
                    <button key={b} type="button" onClick={()=>update("border",b)} className={`px-3 py-1 rounded-2xl border ${form.border===b?"border-cyan-400 bg-white/4 shadow-[0_0_8px_cyan]":"border-white/20"}`}>{b}</button>
                  ))}
                </div>

                {/* Thread */}
                <label className="text-sm text-white/70">Thread</label>
                <div className="flex gap-2 flex-wrap">
                  {threadOptions.map(t => (
                    <button key={t} type="button" onClick={()=>update("thread",t)} className={`px-3 py-1 rounded-2xl border ${form.thread===t?"border-cyan-400 bg-white/4 shadow-[0_0_8px_cyan]":"border-white/20"}`}>{t}</button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3 - Preview */}
            {step===3 && (
              <motion.div key="step-3" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} className="space-y-4">
                <h4 className="text-white font-semibold">Review Your Patch</h4>
                <div className="p-4 bg-white/5 rounded-2xl flex flex-col gap-3">
                  <div><strong>Name:</strong> {form.name}</div>
                  <div><strong>Email:</strong> {form.email}</div>
                  <div><strong>Phone:</strong> {form.phone || "N/A"}</div>
                  <div><strong>Patch Type:</strong> {form.patch_type}</div>
                  {form.patch_type === "embroidered" && <div><strong>Embroidery Coverage:</strong> {form.embroidery_coverage}</div>}
                  {form.patch_type === "leather" && <>
                    <div><strong>Dimension:</strong> {form.dimension}</div>
                    <div><strong>Leather Type:</strong> {form.leather_type}</div>
                    <div><strong>Finish Effect:</strong> {form.finish_effect}</div>
                  </>}
                  <div><strong>Dimensions:</strong> {form.width} x {form.height} {form.unit}</div>
                  <div><strong>Shape:</strong> {form.shape}</div>
                  <div><strong>Backing:</strong> {form.backing}</div>
                  <div><strong>Quantity:</strong> {form.custom_qty || form.quantity}</div>
                  <div><strong>Border:</strong> {form.border}</div>
                  <div><strong>Thread:</strong> {form.thread}</div>
                  <div><strong>Artworks:</strong></div>
                  <div className="flex gap-2 flex-wrap">
                    {filePreviews.map((u,i)=>(
                      <div key={i} className="w-20 h-20 bg-white/4 rounded-2xl overflow-hidden flex items-center justify-center">
                        <img src={u} alt={`art-${i}`} className="w-full h-full object-contain" />
                      </div>
                    ))}
                    {filePreviews.length===0 && <div className="text-white/60">No files uploaded</div>}
                  </div>
                  {form.message && <div><strong>Comments:</strong> {form.message}</div>}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation */}
          <div className="hidden sm:flex justify-between mt-4 sticky bottom-0 bg-black/6 p-3 rounded-b-2xl">
            <button type="button" className={buttonClass} onClick={prev} disabled={step===0}>Back</button>
            {step<STEP_TITLES.length-1 ? (
              <button type="button" className={buttonClass} onClick={next}>Next</button>
            ) : (
              <button type="button" className={buttonClass} onClick={submit} disabled={submitting}>{submitting?"Submitting...":"Submit"}</button>
            )}
          </div>

          {result && result.ok && <div className="mt-3 text-green-400 font-semibold">✅ Your patch request was submitted!</div>}
          {result && result.error && <div className="mt-3 text-rose-400 font-semibold">❌ {result.error}</div>}
        </form>
      </div>

      {/* Mobile sticky nav */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-[999]">
        <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between gap-3">
          {step>0 ? (
            <button onClick={prev} className="px-4 py-2 rounded-full bg-white/6 text-white">Back</button>
          ) : <div className="w-14" />}
          {step<STEP_TITLES.length-1 ? (
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
