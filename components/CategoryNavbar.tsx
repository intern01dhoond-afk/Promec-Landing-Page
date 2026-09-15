"use client";

import React, { useState } from "react";
import { MenuItem, ProductItem, HoveredLink } from "@/components/ui/navbar-menu";

export function CategoryDropdown() {
  const [active, setActive] = useState<string | null>(null);

  const scrollToUseCase = (id: string) => {
    setActive(null);
    const target = document.getElementById(id);
    if (target) {
      if (window.lenis && typeof window.lenis.scrollTo === "function") {
        window.lenis.scrollTo(target, { offset: -20, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div
      onMouseLeave={() => setActive(null)}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      <MenuItem setActive={setActive} active={active} item="Category">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minWidth: '520px' }}>
            <ProductItem
              title="Solar Care"
              href="#category-solarcare"
              src="assets/promec_solar_card.png"
              description="Solar panel cleaning system with high-efficiency spray."
              onClick={(e) => {
                e.preventDefault();
                scrollToUseCase("category-solarcare");
              }}
            />
            <ProductItem
              title="Auto Care"
              href="#category-autocare"
              src="assets/promec_autocare.jpg"
              description="Automotive & vehicle detailing system for a flawless shine."
              onClick={(e) => {
                e.preventDefault();
                scrollToUseCase("category-autocare");
              }}
            />
            <ProductItem
              title="Home Care"
              href="#category-homecare"
              src="assets/promec_homecare.jpg"
              description="Residential pressure cleaning for walls, driveways & roofs."
              onClick={(e) => {
                e.preventDefault();
                scrollToUseCase("category-homecare");
              }}
            />
            <ProductItem
              title="Commercial"
              href="#category-commercial"
              src="assets/promec_corporate.jpg"
              description="Industrial heavy-duty pressure cleaning system for businesses."
              onClick={(e) => {
                e.preventDefault();
                scrollToUseCase("category-commercial");
              }}
            />
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <HoveredLink
              href="#story"
              onClick={(e) => {
                e.preventDefault();
                scrollToUseCase("story");
              }}
            >
              All Accessories &rarr;
            </HoveredLink>
            <HoveredLink
              href="#engineering"
              onClick={(e) => {
                e.preventDefault();
                scrollToUseCase("engineering");
              }}
            >
              Engineering Journal &rarr;
            </HoveredLink>
          </div>
        </div>
      </MenuItem>
    </div>
  );
}

export default CategoryDropdown;
