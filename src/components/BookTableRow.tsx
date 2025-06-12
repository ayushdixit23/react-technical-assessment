import { Edit, Trash2 } from "lucide-react";
import type { Book } from "../types";
import DeleteBookModal from "./DeleteBookModal";
import BookFormModal from "./BookFormData";

const BookTableRow = ({
  book,
  handleDeleteBook,
  handleEditBook,
}: {
  book: Book;
  handleDeleteBook: (book: Book) => Promise<void>;
  handleEditBook: (book: Book) => Promise<void>;
}) => {
  return (
    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
      <td className="px-6 py-4 text-gray-700">{book.author}</td>
      <td className="px-6 py-4 text-gray-700">{book.genre}</td>
      <td className="px-6 py-4 text-gray-700">{book.publishedYear}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${book.status === "Available"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {book.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <BookFormModal
            onSubmit={(updatedData) => {
              handleEditBook({ ...book, ...updatedData })
            }
            }
            initialData={book}
            mode="edit"
            triggerButton={
              <button className="p-2 rounded hover:bg-blue-100 text-blue-600 transition">
                <Edit className="w-4 h-4" />
              </button>
            }
          />

          <DeleteBookModal
            itemName={book.title}
            itemAuthor={book.author}
            itemType="book"
            onConfirm={() => handleDeleteBook(book)}
            triggerButton={
              <button className="p-2 rounded hover:bg-red-100 text-red-600 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            }
          />
        </div>
      </td>
    </tr>
  );
};

export default BookTableRow;
