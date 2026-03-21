import React from 'react';
import { Column, Row, Heading, Text } from '@/components/OnceUI';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <Column align="center" fillWidth fillHeight padding="64" gap="32" background="page" style={{ overflowY: 'auto' }}>
      
      {/* Hero Section */}
      <Column align="center" gap="16" style={{ maxWidth: '800px', textAlign: 'center', marginTop: '48px' }}>
        <Heading variant="display-strong-l" style={{ color: "var(--color-primary, white)", fontSize: '3rem', marginBottom: '8px' }}>
          Smart Travel App
        </Heading>
        <Text variant="body-default-l" style={{ color: "rgba(255,255,255,0.7)", fontSize: '1.25rem', lineHeight: '1.6' }}>
          The intelligent "Tinder for Travel". Swipe to discover amazing locations, align group preferences using Game Theory, and generate optimized AI itineraries in seconds.
        </Text>
        
        <Link href="/discover" style={{ textDecoration: 'none', marginTop: '32px' }}>
          <div style={{
            padding: '16px 40px',
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 4px 14px 0 rgba(255,255,255,0.2)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}>
            Start Swiping Now
          </div>
        </Link>
      </Column>

      {/* Features Section */}
      <Row fillWidth justify="center" gap="32" style={{ maxWidth: '1000px', flexWrap: 'wrap', marginTop: '48px' }}>
        <FeatureCard 
          title="Swipe to Discover" 
          description="Vector-based matching algorithm learns your travel preferences with every single swipe."
        />
        <FeatureCard 
          title="Group Itineraries" 
          description="A Minimax routing engine automatically resolves conflicts between friends."
        />
        <FeatureCard 
          title="Dynamic Context" 
          description="Real-time adjustments based on weather, traffic, and physical distance."
        />
      </Row>

      {/* Tech Stack Section */}
      <Column align="center" gap="24" style={{ marginTop: '64px', maxWidth: '800px' }}>
        <Heading variant="heading-strong-l" style={{ color: "white" }}>Powered By</Heading>
        <Row gap="16" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <TechBadge name="Next.js" />
          <TechBadge name="Once UI" />
          <TechBadge name="Framer Motion" />
          <TechBadge name="FastAPI" />
          <TechBadge name="PostgreSQL + pgvector" />
          <TechBadge name="Python + NumPy" />
        </Row>
      </Column>

    </Column>
  );
}

function FeatureCard({ title, description }: { title: string, description: string }) {
  return (
    <Column padding="24" gap="12" style={{
      flex: '1 1 300px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Heading variant="heading-strong-m" style={{ color: 'white' }}>{title}</Heading>
      <Text variant="body-default-m" style={{ color: "rgba(255,255,255,0.6)" }}>{description}</Text>
    </Column>
  );
}

function TechBadge({ name }: { name: string }) {
  return (
    <div style={{
      padding: '8px 16px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      {name}
    </div>
  );
}
