export interface User {
  id: string;
  trNumber: string | undefined;
  name: string | undefined;
  role: 'student' | 'admin';
}
export  interface Book {
  id: number;
  name: string;
}
export interface Entry {
  id: number;
  studentTr: string;
  studentName: string;
  bookName: string;
  fromPage: number;
  toPage: number;
}
export interface Group {
  id: string;
  bookName: string;
  sharedPages: {
    from: number;
    to: number;
  }[];
  members: {
    trNumber: string;
    name: string;
  }[];
}