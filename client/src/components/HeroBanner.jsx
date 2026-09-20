import React from 'react';
import { Sparkles, Heart, Flower2, ShieldCheck, ArrowRight } from 'lucide-react';

export const HeroBanner = ({ onExploreClick }) => {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        {/* Left Column: Story & Call to Action */}
        <div>
          <div className="hero-tag">
            <Sparkles size={14} />
            <span>100% Handcrafted Crochet Collection</span>
          </div>

          <h1 className="hero-title">
            Handmade with soft yarns, needlework & <span>pure love.</span>
          </h1>

          <p className="hero-desc">
            Welcome to <strong>Craft Crumbs Crochet Corner</strong>. Discover everlasting floral bouquets that never fade, charming couple amigurumi keychains, artisanal hairbands, and fluffy cloud scrunchies. Every single stitch is thoughtfully hand-knitted with high quality milk cotton yarn.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              id="hero-explore-btn"
              className="btn-primary"
              onClick={onExploreClick}
            >
              <span>Explore Crochet Collection</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Value Perks */}
          <div className="hero-perks">
            <div className="hero-perk-item">
              <div className="hero-perk-icon">
                <Heart size={18} />
              </div>
              <div>
                <div className="hero-perk-label">100% Hand-Crocheted</div>
                <div className="hero-perk-sub">Intricate stitch by stitch</div>
              </div>
            </div>

            <div className="hero-perk-item">
              <div className="hero-perk-icon">
                <Flower2 size={18} />
              </div>
              <div>
                <div className="hero-perk-label">Everlasting Blooms</div>
                <div className="hero-perk-sub">Never withers or wilts</div>
              </div>
            </div>

            <div className="hero-perk-item">
              <div className="hero-perk-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="hero-perk-label">Premium Milk Yarn</div>
                <div className="hero-perk-sub">Hypoallergenic & soft</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="hero-card-showcase">
          <img
            src="/sunflower_01.jpeg"
            alt="Handcrafted Crochet Sunflower Bouquet from Craft Crumbs"
            className="hero-image-main"
          />
          <div className="hero-floating-card">
            <img
              src="/craft_crumbs_logo.jpeg"
              alt="Craft Crumbs"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--color-amber-primary)',
              }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Bespoke Handmade
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Hand-knitted with love in India
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
