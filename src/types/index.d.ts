export interface Book {
  id?: string | number;
  title: string;
  author: string;
  genre: string;
  publishedYear: string;
  status: 'Available' | 'Issued';
}