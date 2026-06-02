import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import SystemRequirements from "@/components/SystemRequirements";
import SocialProof from "@/components/SocialProof";
import Pricing from "@/components/Pricing";
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
        <TrustBar />
        <Features />
        <SystemRequirements />
        <SocialProof />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
