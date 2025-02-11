"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"



interface AutocompleteProps {
  options: { title: string; id: string }[]
  placeholder?: string
  onSelect: (option: string) => void
  onSearch: (query: string) => void
}

export function Autocomplete({ options, placeholder = "Search...", onSelect, onSearch }: AutocompleteProps) {
  const [query, setQuery] = useState("") // Tracks user input
  const [isOpen, setIsOpen] = useState(false) // Controls dropdown visibility
  const [highlightedIndex, setHighlightedIndex] = useState(-1) // Tracks highlighted item in the dropdown
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredOptions = options.filter((option) => option.title.toLowerCase().includes(query.toLowerCase()))

  // Auto-scroll to the highlighted option
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLLIElement
      highlightedElement.scrollIntoView({ block: "nearest" })
    }
  }, [isOpen, highlightedIndex])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch(e.target.value) // Call onSearch to fetch results from API
    setIsOpen(true) // Show the suggestions dropdown
    setHighlightedIndex(-1) // Reset the highlighted item
  }

  const handleSelectOption = (option: { title: string; id: string }) => {
    setQuery(option.title) // Set the selected option in the input field
    onSelect(option.id) // Trigger the onSelect callback
    setIsOpen(false) // Close the dropdown
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev)) // Move down
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev)) // Move up
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleSelectOption(filteredOptions[highlightedIndex]) // Select highlighted option
    } else if (e.key === "Escape") {
      setIsOpen(false) // Close the dropdown on Escape
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)} // Open dropdown on input focus
        />
        <button
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {query ? <X className="w-4 h-4" onClick={() => setQuery("")} /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.id}
              className={`px-4 py-2 text-sm cursor-pointer ${
                index === highlightedIndex ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelectOption(option)} // Select option on click
            >
              {option.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
