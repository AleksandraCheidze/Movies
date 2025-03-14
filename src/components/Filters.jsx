import React from "react";

const Filters = ({ filters, setFilters }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);


  const ratingRanges = [
    { value: "1-2", label: "1-2 ⭐" },
    { value: "2-3", label: "2-3 ⭐" },
    { value: "3-4", label: "3-4 ⭐" },
    { value: "4-5", label: "4-5 ⭐" },
    { value: "5-6", label: "5-6 ⭐" },
    { value: "6-7", label: "6-7 ⭐" },
    { value: "7-8", label: "7-8 ⭐" },
    { value: "8-9", label: "8-9 ⭐" },
    { value: "9-10", label: "9-10 ⭐" },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <select
          className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none border border-gray-700 hover:border-purple-500 transition-colors"
          value={filters.rating}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, rating: e.target.value }))
          }
        >
          <option value="">Rating</option>
          {ratingRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <select
          className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none border border-gray-700 hover:border-purple-500 transition-colors"
          value={filters.year}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, year: e.target.value }))
          }
        >
          <option value="">Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;

