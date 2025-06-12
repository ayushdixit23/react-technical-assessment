import type { Book } from '../types';
import BookSkeleton from './BookSkeleton'
import BookTableRow from './BookTableRow'

interface BookTableProps {
    books: Book[];
    isLoading: boolean;
    handleDeleteBook: (book: Book) => Promise<void>;
    handleEditBook: (book: Book) => Promise<void>;
}

const BookTable: React.FC<BookTableProps> = ({
    books,
    isLoading,
    handleEditBook,
    handleDeleteBook,
}) => {
    return (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            {[
                                "Title",
                                "Author",
                                "Genre",
                                "Year",
                                "Status",
                                "Actions",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                        {isLoading ? (
                            Array.from({ length: 10 }).map((_, index) => (
                                <BookSkeleton key={index} />
                            ))
                        ) : books.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-8 text-center text-gray-400 text-sm"
                                >
                                    No books found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            books.map((book) => (
                                <BookTableRow
                                    handleEditBook={handleEditBook}
                                    handleDeleteBook={handleDeleteBook}
                                    key={book.id}
                                    book={book}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default BookTable