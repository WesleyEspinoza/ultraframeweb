import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PerformanceResults from "@/components/PerformanceResults";
import AIAssistant from "@/components/AIAssistant";
import Features from "@/components/Features";
import Comparison from "@/components/Comparison";
import SystemRequirements from "@/components/SystemRequirements";
import Pricing from "@/components/Pricing";
import MoneyBackGuarantee from "@/components/MoneyBackGuarantee";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { buildSoftwareApplicationJsonLd, defaultDescription, defaultTitle } from "@/lib/site-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: defaultTitle,
  description: defaultDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={buildSoftwareApplicationJsonLd()} />
      <main id="main-content" className="min-h-screen bg-[#020408]">
        <Navbar />
        <Hero />
        <PerformanceResults />
        <AIAssistant />
        <Features />
        <Comparison />
        <SystemRequirements />
        <Pricing />
        <MoneyBackGuarantee />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
