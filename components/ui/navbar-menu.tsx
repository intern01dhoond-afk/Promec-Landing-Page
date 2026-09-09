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
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      onMouseEnter={() => setActive(item)}
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
          color: active === item ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
          transition: 'color 0.25s ease'
        }}
      >
        {item}
      </motion.p>

      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && children && (
            <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: '8px', zIndex: 99999 }}>
              <motion.div
                transition={transition}
                layoutId="active"
                style={{
                  overflow: 'hidden',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: '#0a0d12',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: '#ffffff'
                }}
              >
                <motion.div layout style={{ height: '100%', width: 'max-content', padding: '16px' }}>
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
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
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link
      href={href}
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
  ...rest
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <Link
      {...rest}
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
