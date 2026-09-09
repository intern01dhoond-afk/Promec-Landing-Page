"use client";

import React, { useState } from "react";
import { MenuItem, ProductItem, HoveredLink } from "@/components/ui/navbar-menu";

export function CategoryDropdown() {
  const [active, setActive] = useState<string | null>(null);

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
              href="#story"
              src="assets/promec_solar_card.png"
              description="Solar panel cleaning system with high-efficiency spray."
            />
            <ProductItem
              title="Auto Care"
              href="#story"
              src="assets/promec_autocare.jpg"
              description="Automotive & vehicle detailing system for a flawless shine."
            />
            <ProductItem
              title="Home Care"
              href="#story"
              src="assets/promec_homecare.jpg"
              description="Residential pressure cleaning for walls, driveways & roofs."
            />
            <ProductItem
              title="Commercial"
              href="#story"
              src="assets/promec_corporate.jpg"
              description="Industrial heavy-duty pressure cleaning system for businesses."
            />
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <HoveredLink href="#solutions-showcase">All Accessories &rarr;</HoveredLink>
            <HoveredLink href="#engineering">Engineering Journal &rarr;</HoveredLink>
          </div>
        </div>
      </MenuItem>
    </div>
  );
}

export default CategoryDropdown;
