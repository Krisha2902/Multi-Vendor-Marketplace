import React from 'react';
import { HeartHandshake, ShieldCheck, Globe } from 'lucide-react';
import { TRUST_POINTS } from '../data/mockData';

const iconMap = {
  HeartHandshake,
  ShieldCheck,
  Globe
};

export default function TrustSection() {
  return (
    <section className="section-container trust-section">
      <h2 className="trust-main-heading">Why Choose ShopNest?</h2>
      
      <div className="trust-grid">
        {TRUST_POINTS.map((point) => {
          const Icon = iconMap[point.icon] || Globe;
          return (
            <div key={point.id} className="trust-col">
              <div className="trust-icon-box">
                <Icon size={32} strokeWidth={1.5} className="trust-icon" />
              </div>
              <h3 className="trust-col-title">{point.title}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}
