"use client"

import { useState } from "react"
import { Autocomplete } from "@/components/autocomplete"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Home() {
  const [books, setBooks] = useState<{ title: string; id: string }[]>([]) // Store book titles and IDs
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSelect = (id: string) => {
    console.log(`Selected book ID: ${id}`)
    // Navigate to the dynamic book details page
    router.push(`/book/${id}`)
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) return // Avoid making request if query is empty

    setLoading(true)

    try {
      const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
        params: {
          q: query,
          maxResults: 10,
        },
      })

      // Extract book titles and IDs from the API response and update the state
      const bookTitles = response.data.items?.map((book: { volumeInfo: { title: string }; id: string }) => ({
        title: book.volumeInfo.title,
        id: book.id,
      })) || []

      setBooks(bookTitles)
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Book Finder</h1>
        <Autocomplete
          options={books}
          onSelect={handleSelect} // Pass the handleSelect function
          placeholder="Search for a book..."
          onSearch={handleSearch} // Trigger the search when typing in input
        />
        {loading && <p>Loading...</p>}
      </div>
    </div>
  )
}
