import Link from "next/link";

export default function CTAStrip() {
  return (
    <section className="py-32 bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-indigo-900/80 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">
          Ready to Create Your Custom Patch Masterpiece?
        </h2>
        <p className="text-[var(--color-text-secondary)] text-xl mb-10 max-w-3xl mx-auto">
          Get started with a free quote and bring your design to life with premium quality and fast delivery.
        </p>
        <Link href="/quote" className="btn-primary inline-block text-xl px-12 py-6">
          Request Free Quote Now
        </Link>
      </div>
    </section>
  );
}