import { HeartHandshake, ShieldCheck, Globe } from 'lucide-react';

const TRUST_POINTS = [
  {
    id: 1,
    title: 'Support Small Businesses',
    desc: 'Every purchase directly supports independent makers and local entrepreneurs.',
    icon: 'HeartHandshake'
  },
  {
    id: 2,
    title: 'Safe & Secure Payments',
    desc: 'Bank-grade 256-bit SSL encryption and verified checkout gateways.',
    icon: 'ShieldCheck'
  },
  {
    id: 3,
    title: 'Worldwide Shipping',
    desc: 'Fast, insured doorstep delivery with live tracking across all states and abroad.',
    icon: 'Globe'
  }
];

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
