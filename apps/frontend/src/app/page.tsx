'use client'
import Hero from "@/components/landing/Hero";
import TaskDemo from "@/components/landing/TaskDemo";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <CTA />
      <Features />
      <HowItWorks />
      <TaskDemo />
    </>
  );
}