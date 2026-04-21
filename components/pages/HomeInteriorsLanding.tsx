"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Clock, Home, Palettes, Ruler, Layout } from "lucide-react";

const HomeInteriorsLanding = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border bg-[#1a1a1a] text-white py-24 sm:py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
            alt="Bespoke Home Interiors"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-[5%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-[11px] font-black uppercase tracking-[2px] mb-6">
              <Clock size={12} /> Coming Soon
            </div>
            
            <h1 className="font-heading text-[40px] sm:text-[60px] lg:text-[72px] font-bold leading-[1.1] mb-6">
              Bespoke <br />
              <span className="text-secondary">Home Interiors</span>
            </h1>
            
            <p className="text-[18px] sm:text-[20px] text-white/80 leading-relaxed mb-10">
              Transform your living spaces with our full-service interior design 
              solutions. From concept to execution, we create homes that 
              reflect your unique story.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="h-14 px-8 rounded-full bg-secondary text-black font-black uppercase tracking-[2px] text-[13px] hover:opacity-90 transition-all flex items-center gap-2">
                Consult an Expert <ArrowRight size={18} />
              </button>
              <a href="/contact" className="h-14 px-8 rounded-full border border-white/20 hover:bg-white/10 transition-all flex items-center font-black uppercase tracking-[2px] text-[13px]">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-[5%]">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Layout,
                title: "Space Planning",
                desc: "Optimizing your floor plan for flow, functionality, and maximum aesthetic impact."
              },
              {
                icon: Palettes,
                title: "Color & Material",
                desc: "Curating a sophisticated palette of colors, textures, and finishes for your space."
              },
              {
                icon: Ruler,
                title: "Custom Furniture",
                desc: "Designing unique pieces tailored specifically to your dimensions and style."
              },
              {
                icon: Home,
                title: "Full Execution",
                desc: "End-to-end project management ensuring every detail is perfectly realized."
              }
            ].map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[24px] bg-background border border-border shadow-sm hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                  <service.icon size={28} />
                </div>
                <h3 className="text-[20px] font-bold mb-3">{service.title}</h3>
                <p className="text-muted leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WATERMARK */}
      <div className="huge-watermark py-20">INTERIORS</div>

      {/* CTA SECTION */}
      <section className="py-24 px-[5%]">
        <div className="mx-auto max-w-5xl rounded-[40px] bg-[#063A1D] p-12 sm:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-heading text-[32px] sm:text-[48px] font-bold mb-6">
              Start your design journey
            </h2>
            <p className="text-white/70 text-[18px] max-w-2xl mx-auto mb-10">
              Our interior design services are launching soon. Subscribe to get 
              an exclusive invitation for a free design consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="h-14 px-8 rounded-full bg-white/10 border border-white/20 outline-none focus:border-secondary transition-all sm:w-80"
              />
              <button className="h-14 px-10 rounded-full bg-secondary text-black font-black uppercase tracking-[2px] text-[13px] hover:opacity-90 transition-all">
                Stay Updated
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeInteriorsLanding;
