"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  const isSelected = active === item;

  return (
    <div
      onMouseEnter={() => setActive(item)}
      onClick={(e) => {
        e.stopPropagation();
        setActive(isSelected ? null : item);
      }}
      style={{ position: 'relative', display: 'inline-block' }}
      className="relative"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="nav__custom-item cursor-pointer"
        style={{
          margin: 0,
          padding: '6px 0',
          cursor: 'pointer',
          fontFamily: 'var(--_fonts---fonts--heading, "Geist", Arial, sans-serif)',
          fontSize: '14px',
          fontWeight: 500,
          color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
          transition: 'color 0.25s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span>{item}</span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          style={{
            transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            opacity: 0.85
          }}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.p>

      {isSelected && children && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            paddingTop: '26px',
            zIndex: 999999
          }}
        >
          {/* Invisible hit bridge covering gap between link and popup container */}
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              left: '-40px',
              right: '-40px',
              height: '45px',
              backgroundColor: 'transparent'
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -6 }}
            transition={transition}
            style={{
              overflow: 'hidden',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backgroundColor: 'rgba(10, 13, 18, 0.96)',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              color: '#ffffff'
            }}
          >
            <motion.div layout style={{ height: '100%', width: 'max-content', padding: '18px' }}>
              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative flex justify-center space-x-4 rounded-full border border-transparent bg-white px-8 py-6 shadow-input dark:border-white/[0.2] dark:bg-black"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
  onClick,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex space-x-2"
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        textDecoration: 'none',
        padding: '8px',
        borderRadius: '10px',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <Image
        src={src}
        width={130}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
        style={{
          borderRadius: '8px',
          objectFit: 'cover',
          flexShrink: 0,
          width: '120px',
          height: '68px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h4 className="mb-1 text-xl font-bold text-black dark:text-white" style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff', fontFamily: 'Geist, sans-serif' }}>
          {title}
        </h4>

        <p className="max-w-[10rem] text-sm text-neutral-700 dark:text-neutral-300" style={{ margin: 0, fontSize: '12px', lineHeight: 1.4, color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Geist, sans-serif', maxWidth: '150px' }}>
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({
  children,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  return (
    <Link
      {...rest}
      onClick={onClick}
      className="text-neutral-700 hover:text-black dark:text-neutral-200"
      style={{
        color: 'rgba(255, 255, 255, 0.8)',
        textDecoration: 'none',
        fontFamily: 'Geist, sans-serif',
        fontWeight: 500,
        fontSize: '13px',
        transition: 'color 0.2s ease'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
    >
      {children}
    </Link>
  );
};
