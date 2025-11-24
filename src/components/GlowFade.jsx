// src/components/GlowFade.jsx

export default function GlowFade({ layers = [], className = "" }) {
  // Default single glow layer
  const defaultLayers = [
    { from: "from-[#0033FF]/40", via: "via-[#0600AB]/20", to: "to-transparent", height: "h-64" },
  ];

  const glowLayers = layers.length ? layers : defaultLayers;

  return (
    <>
      {glowLayers.map((layer, index) => (
        <div
          key={index}
          className={`absolute bottom-0 left-0 right-0 ${layer.height} bg-gradient-to-t ${layer.from} ${layer.via} ${layer.to} blur-3xl pointer-events-none ${className}`}
        />
      ))}
    </>
  );
}
