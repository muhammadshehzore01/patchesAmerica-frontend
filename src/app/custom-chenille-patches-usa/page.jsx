import { getServices, getUSStates } from "@/lib/api";
import ChenilleGlobalClient from "./ChenilleGlobalClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Custom Chenille Patches USA | Northern Patches",
    description: "Order premium custom chenille patches in the USA. No minimum order, fast nationwide shipping. Perfect for schools, clubs, teams, and organizations.",
    alternates: {
      canonical: "https://northernpatches.com/custom-chenille-patches-usa/",
    },
  };
}

export default async function ChenilleGlobalPage() {
  let services = [];
  let states = [];

  try {
    services = await getServices();
  } catch (e) {
    console.error("Services fetch failed:", e);
  }

  try {
    states = await getUSStates();
  } catch (e) {
    console.error("States fetch failed:", e);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 text-white">
      <ChenilleGlobalClient
        services={services || []}
        states={states || []}
      />
    </main>
  );
}