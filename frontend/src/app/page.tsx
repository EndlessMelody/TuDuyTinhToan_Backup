"use client";

import React from "react";
import { PromoNav }         from "@/components/features/promo/PromoNav";
import { PromoHero }        from "@/components/features/promo/PromoHero";
import { PromoFeatures }    from "@/components/features/promo/PromoFeatures";
import { PromoWhySection }  from "@/components/features/promo/PromoWhySection";
import { PromoHowItWorks }  from "@/components/features/promo/PromoHowItWorks";
import { PromoSocialProof } from "@/components/features/promo/PromoSocialProof";
import { PromoPlans }       from "@/components/features/promo/PromoPlans";
import { PromoCTA }         from "@/components/features/promo/PromoCTA";
import { PromoFooter }      from "@/components/features/promo/PromoFooter";

export default function PromoPage() {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <PromoNav />
      <main>
        <PromoHero />
        <PromoFeatures />
        <PromoWhySection />
        <PromoHowItWorks />
        <PromoSocialProof />
        <PromoPlans />
        <PromoCTA />
      </main>
      <PromoFooter />
    </div>
  );
}
