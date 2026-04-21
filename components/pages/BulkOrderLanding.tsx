"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Clock, Building2, Users2, BadgePercent, Briefcase } from "lucide-react";

const BulkOrderLanding = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border bg-[#0a2013] text-white py-24 sm:py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
            alt="Corporate and Bulk Solutions"
            className="h-full w-full object-cover opacity-20"
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
              Scale Your <br />
              <span className="text-secondary">Vision in Bulk</span>
            </h1>
            
            <p className="text-[18px] sm:text-[20px] text-white/80 leading-relaxed mb-10">
              Partner with NestCraft for large-scale projects, corporate offices, 
              and hospitality interiors. Premium furniture solutions at 
              unbeatable scale and quality.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="h-14 px-8 rounded-full bg-secondary text-black font-black uppercase tracking-[2px] text-[13px] hover:opacity-90 transition-all flex items-center gap-2">
                Inquire Now <ArrowRight size={18} />
              </button>
              <a href="/contact" className="h-14 px-8 rounded-full border border-white/20 hover:bg-white/10 transition-all flex items-center font-black uppercase tracking-[2px] text-[13px]">
                Business Contact
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* B2B FEATURES SECTION */}
      <section className="py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-[5%]">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Building2,
                title: "Corporate Solutions",
                desc: "Optimized furniture systems for modern workspaces and executive offices."
              },
              {
                icon: BadgePercent,
                title: "Exclusive Pricing",
                desc: "Tiered pricing structures designed to provide maximum value for bulk orders."
              },
              {
                icon: Briefcase,
                title: "Project Support",
                desc: "Dedicated project managers to handle logistics and installation at scale."
              },
              {
                icon: Users2,
                title: "Custom Sourcing",
                desc: "Ability to source and manufacture custom designs for specific project needs."
              }
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[24px] bg-background border border-border shadow-sm hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-[20px] font-bold mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WATERMARK */}
      <div className="huge-watermark py-20">BULK ORDER</div>

      {/* CTA SECTION */}
      <section className="py-24 px-[5%]">
        <div className="mx-auto max-w-5xl rounded-[40px] bg-primary p-12 sm:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-heading text-[32px] sm:text-[48px] font-bold mb-6">
              Large scale, low stress
            </h2>
            <p className="text-white/70 text-[18px] max-w-2xl mx-auto mb-10">
              Our Bulk Order platform is launching soon. Get in touch today for 
              early-bird corporate discounts and dedicated project consultations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Business Email" 
                className="h-14 px-8 rounded-full bg-white/10 border border-white/20 outline-none focus:border-secondary transition-all sm:w-80"
              />
              <button className="h-14 px-10 rounded-full bg-secondary text-black font-black uppercase tracking-[2px] text-[13px] hover:opacity-90 transition-all">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BulkOrderLanding;
