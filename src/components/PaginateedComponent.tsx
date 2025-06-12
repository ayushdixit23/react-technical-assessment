import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface PaginatedComponentProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  booksPerPage: number;
  totalPages: number;
  data: {
    total: number;
  };
}

const PaginatedComponent: React.FC<PaginatedComponentProps> = ({
  currentPage,
  setCurrentPage,
  booksPerPage,
  totalPages,
    data,
}) => {
    return (
        <div className="mt-6 flex sm:flex-row flex-col gap-3.5 items-center sm:justify-between">
            <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * booksPerPage + 1} to{" "}
                {Math.min(currentPage * booksPerPage, data.total)} of{" "}
                {data.total} results
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setCurrentPage((prev:number) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev:number) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default PaginatedComponent