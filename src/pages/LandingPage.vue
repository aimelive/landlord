<script setup lang="ts">
import { useSeo } from '../composables/useSeo'
import NavBar from "../components/home/NavBar.vue";
import HeroSection from "../components/home/HeroSection.vue";
import DashboardPreview from "../components/home/DashboardPreview.vue";
import StatsStrip from "../components/home/StatsStrip.vue";
import BeforeAfter from "../components/home/BeforeAfter.vue";
import TenantDashboard from "../components/home/TenantDashboard.vue";
import ValueProp from "../components/home/ValueProp.vue";
import FeaturesGrid from "../components/home/FeaturesGrid.vue";
import CreditScoreSection from "../components/home/CreditScoreSection.vue";
import HowItWorks from "../components/home/HowItWorks.vue";
import CtaBanner from "../components/home/CtaBanner.vue";
import FooterSection from "../components/home/FooterSection.vue";

useSeo({
  title: 'LandLord · Rent Transactions',
  description:
    'LandLord gives tenants a beautiful dashboard to track rent payments, build a rental credit score, and visualise month-by-month coverage — so you always know where you stand.',
  canonical: 'https://landlord.aimelive.com/',
  ogImage: 'https://landlord.aimelive.com/og-image.svg',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'LandLord',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description:
        'Smart rent payment tracking and rental credit scoring for tenants.',
      url: 'https://landlord.aimelive.com',
      screenshot: 'https://landlord.aimelive.com/og-image.svg',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'RWF' },
      featureList: [
        'Rent payment history',
        'Month-by-month coverage timeline',
        'Rental credit score',
        'Coverage period tracking',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is LandLord?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'LandLord is a tenant dashboard that tracks rent payments, shows month-by-month coverage, and calculates a rental credit score.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is LandLord free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — LandLord is free for tenants.',
          },
        },
      ],
    },
  ],
})
</script>

<template>
  <div
    class="min-h-screen font-sans"
    style="background: #f8fafc"
  >
    <NavBar />
    <HeroSection />
    <DashboardPreview />
    <StatsStrip />
    <BeforeAfter />
    <TenantDashboard />
    <ValueProp />
    <FeaturesGrid />
    <CreditScoreSection />
    <HowItWorks />
    <CtaBanner />
    <FooterSection />
  </div>
</template>
