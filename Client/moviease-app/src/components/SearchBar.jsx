import React from "react";

function SearchBar({ value, onChange }) {

  return (
    <div className="w-full z-auto flex justify-center mt-32 px-4 md:px-8">
      <input
        type="text"
        placeholder="Search for movies..."
        value={value}
        onChange={onChange}
        className="w-full max-w-[500px] py-2 px-4 text-lg rounded-full bg-gray-100 focus:bg-white shadow-lg focus:shadow-xl transition-all duration-300 outline-none"
      />
    </div>
  );
}

export default SearchBar;
