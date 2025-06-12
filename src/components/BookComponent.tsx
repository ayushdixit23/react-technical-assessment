import React, { useState, useEffect } from "react";
import { Plus, BookOpen } from "lucide-react";

import type { Book } from "../types";
import BookFormModal, { type FormData } from "./BookFormData";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../constant";
import { toast } from "react-toastify";
import PaginatedComponent from "./PaginateedComponent";
import BookTable from "./BookTable";
import SearchAndFilter from "./SearchAndFilter";

const BookManagementDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 10;
  const queryClient = useQueryClient();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const loadBooks = async (page: number) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (searchTerm) params.append("search", searchTerm);
    if (genreFilter) params.append("genre", genreFilter);
    if (statusFilter) params.append("status", statusFilter);

    const response = await axios.get(
      `${API_BASE_URL}/books?${params.toString()}`
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "books",
      currentPage,
      debouncedSearchTerm,
      genreFilter,
      statusFilter,
    ],
    queryFn: () => loadBooks(currentPage),
  });

  const [books, setBooks] = useState<Book[]>(data?.books || []);

  const handleAddBook = async (data: FormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/books`, data);
      if (response.data.success) {
        queryClient.invalidateQueries({ queryKey: ["books"] });
        toast.success("Book added successfully!");
      } else {
        toast.error("Failed to add book");
      }
    } catch (error) {
      toast.error("An error occurred while adding the book.");
    }
  };

  const handleEditBook = async (book: Book) => {
    if (!book.id) return;
    try {
      const response = await axios.put(`${API_BASE_URL}/books/${book.id}`, {
        data: book,
      });
      if (response.data.success) {
        queryClient.invalidateQueries({ queryKey: ["books"] });
        toast.success("Book updated successfully!");
      } else {
        toast.error("Failed to update book");
      }
    } catch (error) {
      toast.error("An error occurred while updating the book.");
    }
  };

  const handleDeleteBook = async (book: Book) => {
    if (!book.id) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/books/${book.id}`);
      if (response.data.success) {
        queryClient.invalidateQueries({ queryKey: ["books"] });
        toast.success("Book deleted successfully!");
      } else {
        toast.error("Failed to delete book");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the book.");
    }
  };

  useEffect(() => {
    if (data) {
      setBooks(data.books);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  if (error) {
    return (
      <div className="text-red-500 flex justify-center items-center h-screen">
        Error loading books: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <header className="rounded-t-lg border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 sm:text-xl font-bold text-gray-900">
                Book Management Dashboard
              </h1>
            </div>

            <BookFormModal
              onSubmit={handleAddBook}
              mode="add"
              triggerButton={
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center sm:space-x-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:block">Add Book</span>
                </button>
              }
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setCurrentPage={setCurrentPage}
        />

        {/* Books Table */}
        <BookTable
          books={books}
          isLoading={isLoading}
          handleEditBook={handleEditBook}
          handleDeleteBook={handleDeleteBook}
        />

        {/* Pagination */}
        {!isLoading && books.length > 0 && (
          <PaginatedComponent
            booksPerPage={booksPerPage}
            currentPage={currentPage}
            data={data}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </main>
    </div>
  );
};

export default BookManagementDashboard;
