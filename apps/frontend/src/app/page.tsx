'use client'
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import TaskDemo from "@/components/landing/TaskDemo";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <CTA />
      <Features />
      <HowItWorks />
      <TaskDemo />
    </>
  );
}