import React from 'react';
import { 
  Shirt, 
  Armchair, 
  Sparkles, 
  Smartphone, 
  Dumbbell, 
  Gamepad2, 
  BookOpen, 
  MoreHorizontal 
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

const iconMap = {
  Shirt,
  Armchair,
  Sparkles,
  Smartphone,
  Dumbbell,
  Gamepad2,
  BookOpen,
  MoreHorizontal,
};

export default function CategoriesBar({ selectedCategory, onSelectCategory }) {
  return (
    <section className="categories-bar-section" id="categories-bar-section">
      <div className="categories-container">
        <div className="categories-grid">
          {CATEGORIES.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`category-item-btn ${isSelected ? 'active' : ''}`}
                title={`Filter by ${cat.name}`}
              >
                <div 
                  className="category-icon-circle"
                  style={{ 
                    backgroundColor: isSelected ? cat.activeColor : cat.color 
                  }}
                >
                  <IconComponent 
                    className="category-icon" 
                    size={22} 
                    strokeWidth={1.8}
                  />
                </div>
                <span className="category-label">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
