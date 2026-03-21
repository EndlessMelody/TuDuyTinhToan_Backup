"use client";

import React, { useState, useEffect } from 'react';
import { Column, Row, Heading, Text, Button, IconButton, Input, Avatar } from '@/components/OnceUI';
import { Compass, Hand, MapPin, Users, Mic, Bell, MessageSquare, Plus, CloudRain, Car, Sparkles, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate network fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Row fillWidth fillHeight background="page" style={{ height: '100vh', overflow: 'hidden' }}>
      
      {/* 1. Left Panel: Navigation Sidebar */}
      <Column 
        className="no-scrollbar"
        fillHeight 
        padding="l" 
        gap="32" 
        style={{ 
          width: '280px', // slightly wider to fit widget
          borderRight: '1px solid var(--neutral-alpha-weak, rgba(255,255,255,0.1))',
          backgroundColor: '#121212',
          flexShrink: 0,
          overflowY: 'auto'
        }}
      >
        <Heading variant="heading-strong-l" style={{ color: '#ED1B24', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
          TasteMap.
        </Heading>

        <Column gap="4" fillWidth>
          <Text variant="body-default-s" style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px', fontSize: '0.75rem' }}>Menu</Text>
          <SidebarItem icon={<Compass size={20} />} label="Discover" active />
          <SidebarItem icon={<Hand size={20} />} label="Food Tour Builder" />
          <SidebarItem icon={<MapPin size={20} />} label="Local Hot Routes" />
        </Column>

        <Column gap="4" fillWidth>
          <Text variant="body-default-s" style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px', fontSize: '0.75rem' }}>Social</Text>
          <SidebarItem icon={<Users size={20} />} label="Foodies" />
          <SidebarItem icon={<Mic size={20} />} label="Group Rooms" />
        </Column>

        <div style={{ flex: 1 }} />

        {/* Gamification Card */}
        <Column background="surface" padding="m" radius="m" gap="16" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Column align="center" gap="8">
             <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" size="l" />
             <Heading variant="heading-strong-s" style={{ color: 'white' }}>Taste Explorer</Heading>
             <Text variant="body-default-xs" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Level 12 • 4/8 reviews</Text>
          </Column>
          <Button size="s" variant="secondary" fillWidth style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>View Challenges</Button>
        </Column>
      </Column>

      {/* 2. Center Panel: Main Content Area */}
      <Column 
        className="no-scrollbar"
        fillHeight 
        fillWidth 
        gap="40" 
        style={{ flex: 1, overflowY: 'auto', position: 'relative' }}
      >
        {/* Sticky Top Header with Glassmorphism */}
        <Row fillWidth justify="between" align="center" style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 50, 
          backdropFilter: 'blur(24px)', 
          WebkitBackdropFilter: 'blur(24px)',
          backgroundColor: 'rgba(18, 18, 18, 0.75)', 
          padding: '24px 48px',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Row gap="16" align="center">
            <Row align="center" gap="8" style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <MapPin size={20} color="#ED1B24" />
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>Dĩ An, Bình Dương</Text>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginLeft: '4px' }}>▼</span>
            </Row>
            <div style={{ width: '320px' }}>
              <Input placeholder="Search locations, tours, foodies..." style={{ borderRadius: '999px', padding: '12px 24px', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }} />
            </div>
          </Row>
          <Row gap="24" align="center">
            <IconButton icon={<Bell size={24} color="white" />} style={{ backgroundColor: 'transparent' }} />
            <IconButton icon={<MessageSquare size={24} color="white" />} style={{ backgroundColor: 'transparent' }} />
            <Row align="center" gap="12" style={{ marginLeft: '8px' }}>
              <Avatar src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop" size="m" />
              <Column>
                <Heading variant="heading-strong-xs" style={{ color: 'white', fontSize: '0.9rem' }}>Ramona F.</Heading>
                <Text variant="body-default-xs" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Level 12</Text>
              </Column>
            </Row>
          </Row>
        </Row>

        <Column fillWidth padding="xl" gap="40" style={{ paddingTop: '0px', paddingLeft: '48px', paddingRight: '48px' }}>
          
          {/* Hero Banner Upgrade with Context Tags & Animations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Column 
              fillWidth 
              justify="center"
              padding="l"
              style={{ 
                minHeight: '360px', 
                borderRadius: '24px', 
                backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 24px 48px rgba(0,0,0,0.4)'
              }}
            >
              {/* Gradient Overlay left-to-right */ }
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.1) 80%)' }} />
              
              <Column gap="12" style={{ position: 'relative', zIndex: 1, maxWidth: '600px', marginLeft: '32px' }}>
                
                <Row gap="8" align="center" style={{ flexWrap: 'wrap', marginBottom: '4px' }}>
                  <div style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '6px', color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>100XP / spot</div>
                  
                  {/* Real-time Data Tags */}
                  <Row align="center" gap="6" style={{ padding: '6px 12px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '6px', color: 'white' }}>
                    <CloudRain size={14} color="#60A5FA" />
                    <Text style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#60A5FA' }}>Light Rain • 1.2km</Text>
                  </Row>
                  
                  <Row align="center" gap="6" style={{ padding: '6px 12px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '6px', color: 'white' }}>
                    <Car size={14} color="#34D399" />
                    <Text style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#34D399' }}>Smooth Traffic</Text>
                  </Row>
                </Row>

                <Heading variant="display-strong-m" style={{ color: 'white', fontSize: '3.5rem', lineHeight: 1.1 }}>
                  Weekend<br/>Street Food Tour
                </Heading>

                <Row gap="8" align="center">
                  <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop" size="s" style={{ border: '2px solid rgba(0,0,0,0.8)' }} />
                  <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop" size="s" style={{ marginLeft: '-16px', border: '2px solid rgba(0,0,0,0.8)' }} />
                  <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop" size="s" style={{ marginLeft: '-16px', border: '2px solid rgba(0,0,0,0.8)' }} />
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', marginLeft: '8px' }}>+5 friends tracking</Text>
                </Row>

                <Row gap="16" align="center" style={{ marginTop: '12px' }}>
                  <Button size="l" style={{ backgroundColor: '#ED1B24', padding: '16px 40px', fontSize: '1.1rem' }}>Start Tour</Button>
                  <IconButton icon={<Plus size={24} color="white" />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', width: '52px', height: '52px', borderRadius: '50%' }} />
                </Row>
              </Column>
            </Column>
          </motion.div>

          {/* Group Tours with Loading State */}
          <Column gap="16" fillWidth>
            <Row align="center" justify="between" fillWidth>
               <Heading variant="heading-strong-m" style={{ color: 'white', fontSize: '1.25rem' }}>Group Tours</Heading>
               <div style={{ width: '40px', height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>
                  <div style={{ width: '16px', height: '8px', backgroundColor: 'white', borderRadius: '4px' }} />
               </div>
            </Row>
            
            <Row className="no-scrollbar" gap="24" fillWidth style={{ overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <>
                    <SkeletonGroupCard key="sk1" />
                    <SkeletonGroupCard key="sk2" />
                    <SkeletonGroupCard key="sk3" />
                  </>
                ) : (
                  <>
                    <GroupCard title="Spicy Noodle Challenge" desc="District 1 mapping" img="https://images.unsplash.com/photo-1552611052-33e04de081de?w=200&h=200&fit=crop" delay={0.1} />
                    <GroupCard title="Coffee Lovers" desc="Hidden cafes tour" img="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=200&h=200&fit=crop" delay={0.2} />
                    <GroupCard title="Midnight Seafood" desc="Coastal group run" img="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop" delay={0.3} />
                    <GroupCard title="Vegan Discoveries" desc="Healthy spots only" img="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop" delay={0.4} />
                  </>
                )}
              </AnimatePresence>
            </Row>
          </Column>

          {/* Eat It Again with Loading State */}
          <Column gap="16" fillWidth>
            <Heading variant="heading-strong-m" style={{ color: 'white', fontSize: '1.25rem' }}>Eat It Again</Heading>
            <Row className="no-scrollbar" gap="24" fillWidth style={{ overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <>
                    <SkeletonThumbnailCard key="skt1" />
                    <SkeletonThumbnailCard key="skt2" />
                    <SkeletonThumbnailCard key="skt3" />
                  </>
                ) : (
                  <>
                    <ThumbnailCard title="Banh Mi Pho 古" xp="10XP" img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=150&fit=crop" tags="Vietnamese • Street Food" delay={0.1} />
                    <ThumbnailCard title="Neon Diner" xp="15XP" img="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=150&fit=crop" tags="American • Retro" delay={0.2} />
                    <ThumbnailCard title="Matcha Room" xp="30XP" img="https://images.unsplash.com/photo-1582787895088-2ff176b668d2?w=300&h=150&fit=crop" tags="Japanese • Cafe" delay={0.3} />
                    <ThumbnailCard title="Sky Bar" xp="10XP" img="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=150&fit=crop" tags="Cocktails • View" delay={0.4} />
                  </>
                )}
              </AnimatePresence>
            </Row>
          </Column>

        </Column>
      </Column>

      {/* 3. Right Panel: Activity Sidebar */}
      <Column 
        fillHeight 
        padding="l" 
        gap="32" 
        align="center"
        style={{ 
          width: '100px', 
          borderLeft: '1px solid var(--neutral-alpha-weak, rgba(255,255,255,0.1))',
          backgroundColor: '#121212',
          flexShrink: 0,
          paddingTop: '48px',
          paddingRight: '12px'
        }}
      >
        <IconButton 
          icon={<Plus size={24} color="#ED1B24" />} 
          style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer', transition: 'all 0.2s ease', WebkitTapHighlightColor: 'transparent' }} 
        />
        
        <Column gap="24" align="center" style={{ marginTop: '32px', width: '100%', alignItems: 'center' }}>
          <AvatarWithStatus src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" status="online" />
          <AvatarWithStatus src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop" status="offline" />
          <AvatarWithStatus src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop" status="online" />
          <AvatarWithStatus src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop" status="busy" />
          <AvatarWithStatus src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop" status="online" />
        </Column>

      </Column>

    </Row>
  );
}

// ------ Styled Components & Helpers ------ //

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Row gap="16" align="center" fillWidth style={{ 
      padding: '12px 16px', 
      borderRadius: '8px', 
      backgroundColor: active ? 'rgba(255,255,255,0.05)' : 'transparent',
      cursor: 'pointer',
      borderLeft: active ? '4px solid #ED1B24' : '4px solid transparent',
      color: active ? 'white' : 'rgba(255,255,255,0.6)',
      transition: 'all 0.2s ease',
    }}>
      <div style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>{icon}</div>
      <Text style={{ color: 'inherit', fontWeight: active ? '600' : '500', fontSize: '0.95rem' }}>{label}</Text>
    </Row>
  );
}

// Micro-animation applied using framer-motion's motion.div wrapping the standard Column setup
function GroupCard({ title, desc, img, delay }: { title: string, desc: string, img: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05, border: '1px solid rgba(237,27,36,0.5)', boxShadow: '0 8px 32px rgba(237,27,36,0.15)' }} // Hover scale micro-animation
      style={{ borderRadius: '16px' }}
    >
      <Column padding="m" gap="12" style={{ backgroundColor: '#1A1A1A', borderRadius: '16px', minWidth: '240px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
         <Row justify="between" align="center" fillWidth>
           <Avatar src={img} size="m" style={{ borderRadius: '12px' }} />
           <Row>
             <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop" size="s" style={{ border: '2px solid #1a1a1a', zIndex: 3 }} />
             <Avatar src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=32&h=32&fit=crop" size="s" style={{ border: '2px solid #1a1a1a', zIndex: 2, marginLeft: '-12px' }} />
             <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop" size="s" style={{ border: '2px solid #1a1a1a', zIndex: 1, marginLeft: '-12px' }} />
           </Row>
         </Row>
         <Column>
           <Heading variant="heading-strong-xs" style={{ color: 'white', fontSize: '1rem', marginTop: '8px' }}>{title}</Heading>
           <Text variant="body-default-xs" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{desc}</Text>
         </Column>
      </Column>
    </motion.div>
  );
}

function ThumbnailCard({ title, xp, img, tags, delay }: { title: string, xp: string, img: string, tags: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05, zIndex: 10, boxShadow: '0 12px 32px rgba(237,27,36,0.3)' }}
      style={{ borderRadius: '16px' }}
    >
      <Column justify="end" style={{ 
        minWidth: '320px', 
        height: '180px', 
        borderRadius: '16px', 
        backgroundImage: `url(${img})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden'
      }}>
        {/* Bottom up gradient overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 65%)' }} />
        
        <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '6px', color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>
          {xp}
        </div>

        <Column padding="m" gap="4" style={{ position: 'relative', zIndex: 1, paddingBottom: '16px' }}>
           <Heading variant="heading-strong-s" style={{ color: 'white', fontSize: '1.1rem' }}>{title}</Heading>
           <Text variant="body-default-xs" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{tags}</Text>
        </Column>
      </Column>
    </motion.div>
  );
}

function AvatarWithStatus({ src, status }: { src: string, status: 'online' | 'offline' | 'busy' }) {
  const color = status === 'online' ? '#00D1B2' : status === 'busy' ? '#ED1B24' : 'rgba(255,255,255,0.2)';
  return (
    <div style={{ position: 'relative' }}>
      <Avatar src={src} size="m" />
      <div style={{ 
        position: 'absolute', 
        bottom: 2, 
        right: -2, 
        width: '12px', 
        height: '12px', 
        backgroundColor: color, 
        borderRadius: '50%',
        border: '2px solid #121212'
      }} />
    </div>
  );
}

// ------ Skeletons ------ //

function SkeletonGroupCard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', minWidth: '240px', height: '140px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ width: '100%', height: '100%', animation: 'pulse 1.5s infinite', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)', backgroundSize: '200% 100%' }} />
    </motion.div>
  );
}

function SkeletonThumbnailCard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', minWidth: '320px', height: '180px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ width: '100%', height: '100%', animation: 'pulse 1.5s infinite', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)', backgroundSize: '200% 100%' }} />
    </motion.div>
  );
}
