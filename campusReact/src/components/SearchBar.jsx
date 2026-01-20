import React from 'react';
import { BiSearch } from 'react-icons/bi';

function SearchBar({ searchQuery, onSearchChange, onClearSearch }) {
  return (
    <div className="top-search-bar">
      <div className="top-search-form">
        <BiSearch className="top-search-icon" />
        <input
          type="text"
          placeholder="Search by student name or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="top-search-input"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            className="top-clear-btn"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
