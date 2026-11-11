
import {
  Shirt,
  Home,
  Flower2,
  Laptop,
  Dumbbell,
  Gamepad2,
  BookOpen,
  Scissors,
  Sparkles,
  Watch,
  Tag,
  ShoppingBag,
  Utensils,
} from 'lucide-react';

const iconMap = {
  Shirt,
  Home,
  Armchair: Home,
  Flower2,
  Sparkles,
  Laptop,
  Smartphone: Laptop,
  Dumbbell,
  Gamepad2,
  BookOpen,
  Scissors,
  Watch,
  Tag,
  ShoppingBag,
  Utensils,
};

const categoryColors = [
  '#e8e5e0',
  '#ede3d5',
  '#fae3e3',
  '#e0eaf3',
  '#e0f1eb',
  '#fbe8dc',
  '#fbe0e2',
  '#e6eaf0',
];

export default function CategoriesBar({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <section
      className="categories-bar-section"
      id="categories-bar-section"
    >
      <div className="categories-container">
        <div className="categories-grid">

          {categories.map((category, index) => {
            const IconComponent =
              iconMap[category.icon] || Sparkles;

            const isSelected =
              selectedCategory === category.id;

            const color =
              categoryColors[index % categoryColors.length];

            return (
              <button
                key={category.id}
                onClick={() =>
                  onSelectCategory(
                    isSelected ? null : category.id
                  )
                }
                className={`category-item-btn ${
                  isSelected ? 'active' : ''
                }`}
                title={`Filter by ${category.name}`}
              >
                <div
                  className="category-icon-circle"
                  style={{
                    backgroundColor: isSelected
                      ? '#d6cfc4'
                      : color,
                  }}
                >
                  <IconComponent
                    className="category-icon"
                    size={22}
                    strokeWidth={1.8}
                  />
                </div>

                <span className="category-label">
                  {category.name}
                </span>
              </button>
            );
          })}

        </div>
      </div>
    </section>
  );
}
