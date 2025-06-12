import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
    triggerButton?: React.ReactNode;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    itemType?: string;
    itemAuthor?: string;
    customDescription?: string;
    // isLoading?: boolean;
}

const DeleteBookModal: React.FC<DeleteModalProps> = ({
    triggerButton,
    onConfirm,
    title,
    description,
    itemName,
    itemType = 'item',
    itemAuthor,
    customDescription,
    // isLoading = false
}) => {
    const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false)

    // Generate title if not provided
    const modalTitle = title || `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`;

    // Generate description based on available props
    const getDescription = () => {
        if (customDescription) return customDescription;
        if (description) return description;
        
        if (itemName) {
            const baseText = `Are you sure you want to delete "${itemName}"`;
            const authorText = itemAuthor ? ` by ${itemAuthor}` : '';
            const actionText = `? This action cannot be undone and will permanently remove the ${itemType} from your library.`;
            return baseText + authorText + actionText;
        }
        
        return `Are you sure you want to delete this ${itemType}? This action cannot be undone.`;
    };

    const handleConfirm = async () => {
        try {
            setIsLoading(true)
            await onConfirm();
            setOpen(false);
        } catch (error) {
            console.error('Delete error:', error);
        }finally{
            setIsLoading(false)
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="w-[95%] sm:max-w-md">
                <DialogHeader className="space-y-3 w-full">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <DialogTitle className="text-lg font-semibold">
                            {modalTitle}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-gray-600">
                        {getDescription()}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteBookModal

// const DeleteModalExample = () => {
//     const [books, setBooks] = useState([
//         { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction" },
//         { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction" },
//         { id: 3, title: "1984", author: "George Orwell", genre: "Dystopian Fiction" },
//     ]);

//     const [isDeleting, setIsDeleting] = useState<{type: string, id: number} | null>(null);

//     const handleDeleteBook = async (bookId: number) => {
//         setIsDeleting({type: 'book', id: bookId});
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         setBooks(prev => prev.filter(book => book.id !== bookId));
//         setIsDeleting(null);
//     };

//     return (
//         <div className="p-6 space-y-8">
//             <div>
//                 <h2 className="text-xl font-semibold mb-4">Books</h2>
//                 <div className="space-y-2">
//                     {books.map((book) => (
//                         <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                 
//                             <DeleteModal
//                                 itemName={book.title}
//                                 itemAuthor={book.author}
//                                 itemType="book"
//                                 onConfirm={() => handleDeleteBook(book.id)}
//                                 isLoading={isDeleting?.type === 'book' && isDeleting?.id === book.id}
//                                 triggerButton={
//                                     <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
//                                         <Trash2 className="h-4 w-4" />
//                                     </Button>
//                                 }
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>

       
//         </div>
//     );
// };

// export default DeleteModalExample;

//   <DeleteBookModal
//                                 itemName={book.title}
//                                 itemAuthor={book.author}
//                                 itemType="book"
//                                 onConfirm={() => handleDeleteBook(book.id)}
//                                 isLoading={isDeleting?.type === 'book' && isDeleting?.id === book.id}
//                                 triggerButton={
//                                     <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
//                                         <Trash2 className="h-4 w-4" />
//                                     </Button>
//                                 }
//                             />