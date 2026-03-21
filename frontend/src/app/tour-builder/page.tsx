"use client";

import React, { useState } from 'react';
import { Column, Row, Heading, Text, Button, IconButton, Avatar } from '@/components/OnceUI';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, Sliders, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TourBuilderPage() {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const [cards, setCards] = useState([
    { id: 1, title: 'Banh Mi Co Thuy', tags: 'Street Food • $$ • 1.2km away', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=800&fit=crop' },
    { id: 2, title: 'Neon Sushi', tags: 'Restaurant • $$$ • 2.5km away', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=800&fit=crop' }
  ]);

  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      // Simulate swipe confirmed
      setCards(prev => prev.slice(1));
    }
  };

  return (
    <Column fillWidth fillHeight background="page" style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      
      {/* 1. Top Header */}
      <Row 
        fillWidth 
        padding="m" 
        align="center" 
        justify="between" 
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', height: '80px', flexShrink: 0, paddingLeft: '32px', paddingRight: '32px' }}
      >
        {/* Left */}
        <Row align="center" gap="16">
          <Link href="/dashboard" style={{ display: 'flex' }}>
            <IconButton icon={<ChevronLeft color="white" />} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }} />
          </Link>
          <Row align="center" gap="8">
            <MapPin size={18} color="#ED1B24" />
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Dĩ An, Bình Dương</Text>
          </Row>
        </Row>

        {/* Center: Timeline Progress */}
        <Row align="center" gap="16">
          <TimelineStep label="Chapter 1: Main Course" active={true} />
          <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <TimelineStep label="Chapter 2: Coffee" active={false} />
          <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <TimelineStep label="Chapter 3: Late Night" active={false} />
        </Row>

        {/* Right */}
        <IconButton icon={<Sliders color="white" />} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }} />
      </Row>

      {/* 2. Center Stage (Swipe Mechanics) */}
      <Row fillWidth justify="center" align="center" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Labels */}
        <Heading 
          variant="display-strong-xl" 
          style={{ position: 'absolute', left: '-5%', color: 'var(--neutral-alpha-weak, rgba(255,255,255,0.08))', fontSize: '10rem', whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none' }}
        >
          ⟵ STREET
        </Heading>
        <Heading 
          variant="display-strong-xl" 
          style={{ position: 'absolute', right: '-5%', color: 'var(--neutral-alpha-weak, rgba(255,255,255,0.08))', fontSize: '10rem', whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none' }}
        >
          RESTAURANT ⟶
        </Heading>

        {/* Central Card Stack */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px', aspectRatio: '3/4', zIndex: 10 }}>
          {cards.length > 0 ? (
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              style={{ x, rotate, opacity }}
              whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
              initial={{ scale: 0.95, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="swipe-card"
            >
              <Column 
                justify="end"
                style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  borderRadius: '24px',
                  backgroundImage: `url(${cards[0].img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'grab'
                }}
              >
                {/* Dark Gradient Overlay */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 60%)', pointerEvents: 'none' }} />
                
                {/* Content */}
                <Column padding="l" gap="8" style={{ position: 'relative', zIndex: 1, paddingBottom: '32px' }}>
                  <Row align="center" gap="8" style={{ marginBottom: '8px' }}>
                    <div style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '6px', color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>98% Match</div>
                  </Row>
                  <Heading variant="heading-strong-l" style={{ color: 'white', fontSize: '2.5rem', lineHeight: 1.1 }}>{cards[0].title}</Heading>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{cards[0].tags}</Text>
                </Column>
              </Column>
            </motion.div>
          ) : (
             <Column fillWidth fillHeight align="center" justify="center" gap="16">
               <Sparkles size={48} color="#00D1B2" />
               <Heading style={{ color: 'white' }}>Chapter Complete</Heading>
             </Column>
          )}
        </div>
      </Row>

      {/* 3. Bottom Bar */}
      <Row 
        fillWidth 
        padding="m" 
        align="center" 
        justify="between" 
        style={{ 
          height: '110px', 
          backgroundColor: '#161616', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
          paddingLeft: '48px',
          paddingRight: '48px'
        }}
      >
        {/* Left: Metrics */}
        <Column gap="8">
          <Text style={{ color: '#00D1B2', fontWeight: 'bold', fontSize: '1.2rem' }}>Tour Stats</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Est. Distance: 2.5km • Budget: ~250k VND</Text>
        </Column>

        {/* Center: Journey Slots */}
        <Row gap="24" align="center">
          {/* Slot 1: Filled */}
          <Avatar src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop" size="l" style={{ width: '56px', height: '56px', border: '3px solid #00D1B2' }} />
          <div style={{ width: '24px', height: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          {/* Slot 2: Empty Dashed */}
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Text style={{ color: 'rgba(255,255,255,0.2)' }}>2</Text>
          </div>
          <div style={{ width: '24px', height: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          {/* Slot 3: Empty Dashed */}
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Text style={{ color: 'rgba(255,255,255,0.2)' }}>3</Text>
          </div>
        </Row>

        {/* Right: Complete Action */}
        <Button size="l" style={{ backgroundColor: '#ED1B24', padding: '16px 40px', fontSize: '1.2rem', opacity: 0.3, cursor: 'not-allowed' }}>Complete Tour</Button>
      </Row>

    </Column>
  );
}

// ------ Subcomponents ------
function TimelineStep({ label, active }: { label: string, active: boolean }) {
  return (
    <Row align="center" gap="12" style={{ opacity: active ? 1 : 0.4 }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: active ? '#ED1B24' : 'transparent', border: '3px solid', borderColor: active ? '#ED1B24' : 'rgba(255,255,255,0.5)' }} />
      <Text style={{ color: 'white', fontWeight: active ? 'bold' : 'normal', fontSize: '0.9rem' }}>{label}</Text>
    </Row>
  );
}
