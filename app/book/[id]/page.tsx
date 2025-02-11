"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { useParams } from "next/navigation"

interface Book {
  title: string
  authors: string[]
  description: string
  imageUrl: string
}

export default function BookDetails() {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams() // Get the dynamic 'id' from the URL

  useEffect(() => {
    if (!id) return // If no id is available, return early

    const fetchBookDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
        const data = response.data

        setBook({
          title: data.volumeInfo.title,
          authors: data.volumeInfo.authors || [],
          description: data.volumeInfo.description || "No description available.",
          imageUrl: data.volumeInfo.imageLinks?.thumbnail || "",
        })
      } catch {
        setError("Failed to fetch book details.")
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!book) return <p>Book not found</p>

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      {book.imageUrl ? (
        <Image src={book.imageUrl} alt={book.title} width={192} height={288} className="w-48 h-72 mb-4" />
      ) : (
        <p className="text-gray-500">No image available</p>
      )}
      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: book.description }} />
    </div>
  )
}
