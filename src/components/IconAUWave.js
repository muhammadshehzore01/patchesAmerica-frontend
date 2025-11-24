export default function IconAUWave({ className = 'absolute inset-0 pointer-events-none', opacity = 0.06 }) {
  return (
    <svg className={className} viewBox="0 0 1600 400" preserveAspectRatio="none" style={{opacity}} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="#001f3f" stopOpacity="0.9"/>
          <stop offset="1" stopColor="#002b5c" stopOpacity="0.9"/>
        </linearGradient>
      </defs>
      <path d="M0,80 C200,200 400,0 800,80 C1200,160 1400,60 1600,120 L1600,400 L0,400 Z" fill="url(#g)"/>
    </svg>
  )
}
