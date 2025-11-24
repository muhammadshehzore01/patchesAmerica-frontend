// src/components/LuxuryOverlay.jsx

export default function LuxuryOverlay({ layers = [], className = "" }) {
  // If no layers are provided, use a default single layer
  const defaultLayers = [
    { from: "from-white/5", via: "via-transparent", to: "to-transparent" },
  ];

  const overlayLayers = layers.length ? layers : defaultLayers;

  return (
    <>
      {overlayLayers.map((layer, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-gradient-to-t ${layer.from} ${layer.via} ${layer.to} pointer-events-none ${className}`}
        />
      ))}
    </>
  );
}
