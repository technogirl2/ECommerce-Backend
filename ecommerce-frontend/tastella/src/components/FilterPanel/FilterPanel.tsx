import type { ReactNode } from 'react'
import { useState } from 'react'
import './FilterPanel.css'

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

export interface FilterValue {
  sortBy: SortOption
  minPrice: string
  maxPrice: string
  brands: string[]
  categories: string[]
}

export const DEFAULT_FILTER_VALUE: FilterValue = {
  sortBy: 'featured',
  minPrice: '',
  maxPrice: '',
  brands: [],
  categories: [],
}

export interface CategoryOption {
  value: string
  label: string
}

interface FilterPanelProps {
  value: FilterValue
  onChange: (value: FilterValue) => void
  brandOptions: string[]
  categoryOptions: CategoryOption[]
}

type SectionKey = 'sorting' | 'price' | 'brand' | 'categories'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

function toggleListValue(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item]
}

function FilterPanel({ value, onChange, brandOptions, categoryOptions }: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    sorting: false,
    price: false,
    brand: false,
    categories: false,
  })

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <aside className="filter-panel">
      <div className="filter-panel-header">
        <h2 className="filter-panel-title">Filter</h2>
        <button
          type="button"
          className="filter-panel-reset"
          onClick={() => onChange(DEFAULT_FILTER_VALUE)}
        >
          Reset
        </button>
      </div>

      <FilterSection
        title="Sorting"
        isOpen={openSections.sorting}
        onToggle={() => toggleSection('sorting')}
      >
        <div className="filter-panel-options">
          {SORT_OPTIONS.map((option) => (
            <label key={option.value} className="filter-panel-option">
              <input
                type="radio"
                name="sort"
                checked={value.sortBy === option.value}
                onChange={() => onChange({ ...value, sortBy: option.value })}
              />
              {option.label}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Price"
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="filter-panel-price">
          <input
            type="number"
            min="0"
            inputMode="decimal"
            placeholder="Min"
            aria-label="Minimum price"
            className="filter-panel-price-input"
            value={value.minPrice}
            onChange={(e) => onChange({ ...value, minPrice: e.target.value })}
          />
          <span className="filter-panel-price-sep">–</span>
          <input
            type="number"
            min="0"
            inputMode="decimal"
            placeholder="Max"
            aria-label="Maximum price"
            className="filter-panel-price-input"
            value={value.maxPrice}
            onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
          />
        </div>
      </FilterSection>

      <FilterSection
        title="Brand"
        isOpen={openSections.brand}
        onToggle={() => toggleSection('brand')}
      >
        <div className="filter-panel-options">
          {brandOptions.length === 0 ? (
            <p className="filter-panel-empty">No brands available</p>
          ) : (
            brandOptions.map((brand) => (
              <label key={brand} className="filter-panel-option">
                <input
                  type="checkbox"
                  checked={value.brands.includes(brand)}
                  onChange={() =>
                    onChange({ ...value, brands: toggleListValue(value.brands, brand) })
                  }
                />
                {brand}
              </label>
            ))
          )}
        </div>
      </FilterSection>

      <FilterSection
        title="Categories"
        isOpen={openSections.categories}
        onToggle={() => toggleSection('categories')}
      >
        <div className="filter-panel-options">
          {categoryOptions.map((category) => (
            <label key={category.value} className="filter-panel-option">
              <input
                type="checkbox"
                checked={value.categories.includes(category.value)}
                onChange={() =>
                  onChange({
                    ...value,
                    categories: toggleListValue(value.categories, category.value),
                  })
                }
              />
              {category.label}
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  )
}

interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}

function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="filter-panel-section">
      <button
        type="button"
        className="filter-panel-section-header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {title}
        <svg
          className={`filter-panel-chevron ${isOpen ? 'is-open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`filter-panel-section-body ${isOpen ? '' : 'is-hidden'}`}
        aria-hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  )
}

export default FilterPanel
