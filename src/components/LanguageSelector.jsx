import { useState, useEffect, useRef } from "react";
import { LANGUAGE_VERSIONS } from "../utility/constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (lang) => {
    onSelect(lang);
    setIsOpen(false); 
  };

  
  const handleClickOutside = (event) => {
  
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="ml-2 mb-4 relative">
      <div className="mb-2 text-lg font-semibold text-white">Language:</div>
      <button
        ref={buttonRef}
        className="px-4 py-2 border rounded bg-gray-800 text-white hover:text-red-600"
        onClick={toggleDropdown}
      >
        {language}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 mt-4 w-[40%] max-h-96 bg-gray-700 rounded shadow-lg z-50 overflow-auto"
        >
          {languages.map(([lang, version]) => (
            <button
              key={lang}
              className={`block px-4 py-2 text-sm ${lang === language ? "text-red-600" : "text-gray-300"} ${lang === language ? "bg-gray-700" : "hover:bg-gray-700 hover:text-red-600"}`}
              onClick={() => handleSelect(lang)}
            >
              {lang}
              <span className="text-gray-600 text-sm"> ({version})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
