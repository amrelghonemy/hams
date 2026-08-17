"use client";

import React, { useState } from "react";

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function TagsInput({ tags, onChange, label = "Tags", placeholder = "Add tag and press Enter" }: TagsInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div>
      <label className="label-text">{label}</label>
      <div className="flex flex-wrap gap-1.5 p-2.5 bg-white border border-cream-300 rounded-xl min-h-[42px] focus-within:border-blush-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-charcoal-600 text-xs font-medium rounded-lg"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-charcoal-400 hover:text-red-500 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>
    </div>
  );
}
