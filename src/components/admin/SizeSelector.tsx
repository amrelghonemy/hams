"use client";

import React, { useState } from "react";

const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size"];

interface SizeSelectorProps {
  selected: string[];
  onChange: (sizes: string[]) => void;
  label?: string;
}

export function SizeSelector({ selected, onChange, label }: SizeSelectorProps) {
  const [newSize, setNewSize] = useState("");

  const toggle = (size: string) => {
    if (selected.includes(size)) {
      onChange(selected.filter((s) => s !== size));
    } else {
      onChange([...selected, size]);
    }
  };

  const addCustom = () => {
    const trimmed = newSize.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setNewSize("");
    }
  };

  const remove = (size: string) => {
    onChange(selected.filter((s) => s !== size));
  };

  const allSizes = Array.from(new Set(PRESET_SIZES.concat(selected)));

  return (
    <div>
      {label && <label className="label-text">{label}</label>}

      <div className="flex flex-wrap gap-2 mb-3">
        {allSizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => toggle(size)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-200 ${
              selected.includes(size)
                ? "bg-blush-400 text-white border-blush-400 shadow-soft"
                : "bg-white text-charcoal-500 border-cream-300 hover:border-blush-300 hover:text-blush-400"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="input-field flex-1"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="+ Add custom size"
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-4 py-2 text-sm font-medium text-blush-400 border border-blush-300 rounded-xl hover:bg-blush-100 transition-colors"
        >
          Add
        </button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {selected.map((size) => (
            <span
              key={size}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blush-100 text-blush-400 rounded-full"
            >
              {size}
              <button type="button" onClick={() => remove(size)} className="hover:text-red-500 transition-colors">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
