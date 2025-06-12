import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { genres } from '../constant';

// Zod schema for validation
const bookSchema = z.object({
   id: z.union([z.string(), z.number()]).optional(),
    title: z.string().min(1, 'Title is required').min(2, 'Title must be at least 2 characters'),
    author: z.string().min(1, 'Author is required').min(2, 'Author must be at least 2 characters'),
    genre: z.string().min(1, 'Genre is required'),
    publishedYear: z.string()
        .min(1, 'Published year is required')
        .regex(/^\d{4}$/, 'Year must be a 4-digit number')
        .refine((year: string) => {
            const currentYear = new Date().getFullYear();
            const yearNum = parseInt(year);
            return yearNum >= 1000 && yearNum <= currentYear;
        }, 'Year must be between 1000 and current year'),
    status: z.enum(['Available', 'Issued'], {
        required_error: 'Status is required',
    }),
});

// TypeScript type from Zod schema
export type FormData = z.infer<typeof bookSchema>;

interface BookFormModalProps {
    onSubmit: (data: FormData) => void;
    initialData?: FormData;
    isLoading?: boolean;
    triggerButton?: React.ReactNode;
    mode?: 'add' | 'edit';
}

const BookFormModal: React.FC<BookFormModalProps> = ({
    onSubmit,
    initialData,
    isLoading = false,
    triggerButton,
    mode = 'add'
}) => {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            id: initialData?.id || '',
            title: initialData?.title || '',
            author: initialData?.author || '',
            genre: initialData?.genre || '',
            publishedYear: initialData?.publishedYear ? String(initialData?.publishedYear) : '',
            status: initialData?.status || 'Available',
        },
    });

    const handleFormSubmit = async (data: FormData) => {
        if (isSubmitting || isLoading) return;
        try {
            await onSubmit(data);
            setOpen(false);
            if (mode === 'add') {
                reset();
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleReset = () => {
        reset();
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen && mode === 'add') {
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="w-[95%] sm:max-w-md flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'edit' ? 'Edit Book' : 'Add New Book'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit'
                            ? 'Update the details of the selected book.'
                            : 'Fill in the details to add a new book to your library.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5 py-4">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            {...register('title')}
                            id="title"
                            placeholder="Enter book title"
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Author Field */}
                    <div className="space-y-2">
                        <Label htmlFor="author">Author *</Label>
                        <Input
                            {...register('author')}
                            id="author"
                            placeholder="Enter author name"
                            className={errors.author ? 'border-red-500' : ''}
                        />
                        {errors.author && (
                            <p className="text-sm text-red-600">{errors.author.message}</p>
                        )}
                    </div>

                    {/* Genre Field */}
                    <div className="space-y-2">
                        <Label>Genre *</Label>
                        <Select
                            value={watch('genre')}
                            onValueChange={(value) => setValue('genre', value)}
                        >
                            <SelectTrigger className={`w-full ${errors.genre && 'border-red-500'}`}>
                                <SelectValue placeholder="Select a genre" />
                            </SelectTrigger>
                            <SelectContent>
                                {genres.map((genre) => (
                                    <SelectItem key={genre} value={genre}>
                                        {genre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.genre && (
                            <p className="text-sm text-red-600">{errors.genre.message}</p>
                        )}
                    </div>

                    {/* Published Year Field */}
                    <div className="space-y-2">
                        <Label htmlFor="publishedYear">Published Year *</Label>
                        <Input
                            {...register('publishedYear')}
                            id="publishedYear"
                            placeholder="e.g. 2023"
                            maxLength={4}
                            className={errors.publishedYear ? 'border-red-500' : ''}
                        />
                        {errors.publishedYear && (
                            <p className="text-sm text-red-600">{errors.publishedYear.message}</p>
                        )}
                    </div>

                    {/* Status Field */}
                    <div className="space-y-3">
                        <Label>Status *</Label>
                        <RadioGroup
                            value={watch('status')}
                            onValueChange={(value) => setValue('status', value as 'Available' | 'Issued')}
                            className="flex gap-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Available" id="available" />
                                <Label htmlFor="available">Available</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Issued" id="issued" />
                                <Label htmlFor="issued">Issued</Label>
                            </div>
                        </RadioGroup>
                        {errors.status && (
                            <p className="text-sm text-red-600">{errors.status.message}</p>
                        )}
                    </div>

                    {/* Form Buttons */}
                    <div className="flex gap-3 justify-end max-w-full pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isSubmitting || isLoading}
                            className='flex justify-center items-center w-[50%]'
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className='flex justify-center items-center w-[50%]'
                        >
                            {isSubmitting || isLoading ? 'Submitting...' : mode === 'edit' ? 'Update Book' : 'Add Book'}
                        </Button>


                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BookFormModal;