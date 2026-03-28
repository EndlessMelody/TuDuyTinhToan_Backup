"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Column, Row, Heading, Text, Button, IconButton, Input, Avatar } from '@/components/OnceUI';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Camera, X, Save, Lock, MapPin, Calendar, Star, Utensils, Award, Heart, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// ═══════════ MOCK USER DATA ═══════════ //
const USER = {
  name: 'Ramona F.',
  username: '@ramona_eats',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop',
  cover: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop',
  bio: 'Foodie Explorer 🍜 | Discovering hidden gems in Bình Dương & Sài Gòn. Spicy food addict. Street food is my love language.',
  level: 12,
  title: 'Taste Explorer',
  location: 'Dĩ An, Bình Dương',
  joined: 'March 2025',
  stats: { reviews: 89, visited: 142, followers: 1240, following: 356 },
  badges: [
    { icon: '🔥', label: 'Spice Master', color: '#E63946' },
    { icon: '🌙', label: 'Night Owl', color: '#7B2FF7' },
    { icon: '📸', label: 'Photo Pro', color: '#2A9D8F' },
    { icon: '👑', label: 'Top Reviewer', color: '#FBBF24' },
  ],
  topSpots: [
    { name: 'Bún Bò O Trắng', img: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200&h=200&fit=crop', rating: 4.9 },
    { name: 'Matcha Garden', img: 'https://images.unsplash.com/photo-1582787895088-2ff176b668d2?w=200&h=200&fit=crop', rating: 4.7 },
    { name: 'Neon Ramen House', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop', rating: 4.8 },
  ],
};

export default function ProfilePage() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState(USER.name);
  const [formUsername, setFormUsername] = useState(USER.username.replace('@', ''));
  const [formBio, setFormBio] = useState(USER.bio);
  const [formEmail, setFormEmail] = useState('ramona.f@email.com');
  const [formPhone, setFormPhone] = useState('+84 901 234 567');

  const handleSave = () => {
    setIsEditModalOpen(false);
    toast.success('Profile updated successfully! ✨');
  };

  const handleComingSoon = () => toast('Will be updated in the next version 🚀');

  return (
    <Column fillWidth fillHeight style={{ minHeight: '100vh', backgroundColor: '#08080C', position: 'relative' }}>

      {/* ═══ COVER PHOTO ═══ */}
      <div style={{ position: 'relative', width: '100%', height: '280px', flexShrink: 0 }}>
        <img src={USER.cover} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,12,0.1) 0%, rgba(8,8,12,0.8) 100%)' }} />

        {/* Back Button */}
        <Link href="/" style={{ position: 'absolute', top: '20px', left: '24px', display: 'flex' }}>
          <IconButton
            icon={<ChevronLeft size={20} color="white" />}
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
              borderRadius: '12px', width: '40px', height: '40px', cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        </Link>
      </div>

      {/* ═══ PROFILE HEADER ═══ */}
      <Column fillWidth style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px', marginTop: '-80px', zIndex: 10 }}>

        {/* Avatar + Actions Row */}
        <Row fillWidth style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Avatar src={USER.avatar} size="xl" style={{
              width: '140px', height: '140px', borderRadius: '50%',
              border: '4px solid #08080C',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }} />
            {/* Level Badge */}
            <div style={{
              position: 'absolute', bottom: '4px', right: '4px',
              backgroundColor: '#ED1B24', borderRadius: '12px',
              padding: '4px 10px', border: '3px solid #08080C',
            }}>
              <Text style={{ color: 'white', fontSize: '0.65rem', fontWeight: 800 }}>LV {USER.level}</Text>
            </div>
          </div>

          <Row style={{ gap: '10px' }}>
            <Button
              size="m"
              onClick={() => setIsEditModalOpen(true)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', color: 'white', fontWeight: 600,
                padding: '10px 20px', cursor: 'pointer',
              }}
            >
              <Edit3 size={14} style={{ marginRight: '8px' }} /> Edit Profile
            </Button>
            <IconButton
              icon={<Heart size={18} color="rgba(255,255,255,0.5)" />}
              onClick={handleComingSoon}
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '12px', width: '42px', height: '42px', cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          </Row>
        </Row>

        {/* Name + Info */}
        <Column style={{ gap: '8px', marginBottom: '24px' }}>
          <Heading variant="display-strong-s" style={{ color: 'white' }}>{USER.name}</Heading>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{USER.username} • {USER.title}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '560px' }}>{USER.bio}</Text>

          <Row style={{ gap: '20px', marginTop: '8px' }}>
            <Row style={{ gap: '6px', alignItems: 'center' }}>
              <MapPin size={14} color="rgba(255,255,255,0.35)" />
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{USER.location}</Text>
            </Row>
            <Row style={{ gap: '6px', alignItems: 'center' }}>
              <Calendar size={14} color="rgba(255,255,255,0.35)" />
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Joined {USER.joined}</Text>
            </Row>
          </Row>
        </Column>

        {/* Stats Bar */}
        <Row fillWidth style={{
          backgroundColor: '#121217', borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '20px 0', marginBottom: '32px',
        }}>
          {[
            { label: 'Reviews', value: USER.stats.reviews },
            { label: 'Visited', value: USER.stats.visited },
            { label: 'Followers', value: USER.stats.followers.toLocaleString() },
            { label: 'Following', value: USER.stats.following },
          ].map((stat, i) => (
            <Column key={stat.label} style={{
              flex: 1, alignItems: 'center', gap: '4px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <Text style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>{stat.value}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{stat.label}</Text>
            </Column>
          ))}
        </Row>

        {/* Badges */}
        <Column style={{ gap: '16px', marginBottom: '32px' }}>
          <Row style={{ gap: '10px', alignItems: 'center' }}>
            <Award size={18} color="#FBBF24" />
            <Heading variant="heading-strong-m" style={{ color: 'white' }}>Badges</Heading>
          </Row>
          <Row style={{ gap: '12px', flexWrap: 'wrap' }}>
            {USER.badges.map(badge => (
              <Row key={badge.label} style={{
                gap: '8px', alignItems: 'center',
                padding: '10px 16px',
                backgroundColor: `${badge.color}12`,
                border: `1px solid ${badge.color}30`,
                borderRadius: '12px',
              }}>
                <span style={{ fontSize: '1.1rem' }}>{badge.icon}</span>
                <Text style={{ color: badge.color, fontWeight: 600, fontSize: '0.8rem' }}>{badge.label}</Text>
              </Row>
            ))}
          </Row>
        </Column>

        {/* Top Spots */}
        <Column style={{ gap: '16px', marginBottom: '48px' }}>
          <Row style={{ gap: '10px', alignItems: 'center' }}>
            <Utensils size={18} color="#00D1B2" />
            <Heading variant="heading-strong-m" style={{ color: 'white' }}>Top Spots</Heading>
          </Row>
          <Row style={{ gap: '16px' }}>
            {USER.topSpots.map(spot => (
              <motion.div
                key={spot.name}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  flex: 1, borderRadius: '16px', overflow: 'hidden',
                  backgroundColor: '#121217', border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ height: '120px', overflow: 'hidden' }}>
                  <img src={spot.img} alt={spot.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <Column style={{ padding: '12px 14px', gap: '4px' }}>
                  <Text style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{spot.name}</Text>
                  <Row style={{ gap: '4px', alignItems: 'center' }}>
                    <Star size={12} color="#FBBF24" fill="#FBBF24" />
                    <Text style={{ color: '#FBBF24', fontSize: '0.75rem', fontWeight: 600 }}>{spot.rating}</Text>
                  </Row>
                </Column>
              </motion.div>
            ))}
          </Row>
        </Column>
      </Column>

      {/* ═══════════ EDIT PROFILE MODAL ═══════════ */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsEditModalOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={{
                width: '600px', maxWidth: '95vw', maxHeight: '90vh',
                backgroundColor: '#121217',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Modal Header */}
              <Row style={{
                padding: '18px 24px', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
              }}>
                <Heading variant="heading-strong-s" style={{ color: 'white' }}>Edit Profile</Heading>
                <IconButton
                  icon={<X size={18} color="rgba(255,255,255,0.5)" />}
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px',
                    width: '36px', height: '36px', cursor: 'pointer',
                  }}
                />
              </Row>

              {/* Scrollable Body */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                {/* Cover + Avatar Visual */}
                <Column style={{ padding: '24px 24px 0', gap: '16px' }}>
                  {/* Cover Photo */}
                  <div style={{ position: 'relative', height: '130px', borderRadius: '14px', overflow: 'hidden' }}>
                    <img src={USER.cover} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                    <div
                      onClick={handleComingSoon}
                      style={{
                        position: 'absolute', bottom: '10px', right: '10px',
                        width: '36px', height: '36px', borderRadius: '10px',
                        backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Camera size={16} color="white" />
                    </div>
                  </div>

                  {/* Avatar */}
                  <Row style={{ marginTop: '-48px', marginLeft: '20px', zIndex: 2 }}>
                    <div style={{ position: 'relative' }}>
                      <Avatar src={USER.avatar} size="xl" style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        border: '3px solid #121217',
                      }} />
                      <div
                        onClick={handleComingSoon}
                        style={{
                          position: 'absolute', bottom: '-2px', right: '-2px',
                          width: '28px', height: '28px', borderRadius: '50%',
                          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                          border: '2px solid #121217',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Camera size={12} color="white" />
                      </div>
                    </div>
                  </Row>
                </Column>

                {/* Form Fields */}
                <Column style={{ padding: '20px 24px 24px', gap: '20px' }}>

                  {/* Public Info */}
                  <Column style={{ gap: '16px' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Public Information</Text>

                    {/* Display Name */}
                    <Column style={{ gap: '6px' }}>
                      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500 }}>Display Name</Text>
                      <input
                        type="text"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        style={{
                          width: '100%', padding: '12px 16px',
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px', color: 'white',
                          fontSize: '0.9rem', outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                    </Column>

                    {/* Username */}
                    <Column style={{ gap: '6px' }}>
                      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500 }}>Username</Text>
                      <Row style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px', overflow: 'hidden', alignItems: 'center',
                      }}>
                        <span style={{
                          padding: '12px 0 12px 16px', color: 'rgba(255,255,255,0.3)',
                          fontSize: '0.9rem', userSelect: 'none',
                        }}>@</span>
                        <input
                          type="text"
                          value={formUsername}
                          onChange={e => setFormUsername(e.target.value)}
                          style={{
                            flex: 1, padding: '12px 16px 12px 4px',
                            backgroundColor: 'transparent', border: 'none',
                            color: 'white', fontSize: '0.9rem', outline: 'none',
                          }}
                        />
                      </Row>
                    </Column>

                    {/* Bio */}
                    <Column style={{ gap: '6px' }}>
                      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500 }}>Bio</Text>
                      <textarea
                        value={formBio}
                        onChange={e => setFormBio(e.target.value)}
                        rows={3}
                        style={{
                          width: '100%', padding: '12px 16px',
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px', color: 'white',
                          fontSize: '0.9rem', outline: 'none',
                          resize: 'none', fontFamily: 'inherit',
                          lineHeight: 1.5,
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                    </Column>
                  </Column>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />

                  {/* Private Info */}
                  <Column style={{ gap: '16px' }}>
                    <Row style={{ gap: '10px', alignItems: 'center' }}>
                      <Lock size={16} color="rgba(255,255,255,0.35)" />
                      <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Private Account Information</Text>
                    </Row>

                    {/* Email */}
                    <Column style={{ gap: '6px' }}>
                      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500 }}>Email</Text>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={e => setFormEmail(e.target.value)}
                        style={{
                          width: '100%', padding: '12px 16px',
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px', color: 'white',
                          fontSize: '0.9rem', outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                    </Column>

                    {/* Phone */}
                    <Column style={{ gap: '6px' }}>
                      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500 }}>Phone</Text>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={e => setFormPhone(e.target.value)}
                        style={{
                          width: '100%', padding: '12px 16px',
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px', color: 'white',
                          fontSize: '0.9rem', outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                    </Column>
                  </Column>
                </Column>
              </div>

              {/* Modal Footer */}
              <Row style={{
                padding: '16px 24px', justifyContent: 'flex-end', gap: '12px',
                borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
                backgroundColor: '#121217',
              }}>
                <Button
                  size="m"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px', color: 'rgba(255,255,255,0.6)',
                    padding: '10px 20px', cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="m"
                  onClick={handleSave}
                  style={{
                    backgroundColor: '#00D1B2', color: '#000',
                    borderRadius: '10px', fontWeight: 700,
                    padding: '10px 24px', cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  <Save size={14} style={{ marginRight: '8px' }} /> Save Changes
                </Button>
              </Row>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Column>
  );
}
