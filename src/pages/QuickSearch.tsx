import type { BookType } from "../types/BookType";

import Book from "../components/Book";
type QuickSerachProps = {
    books:BookType[] | null,
    setBook:(book:BookType)=>void
}
const QuickSearch = ({books, setBook} : QuickSerachProps) => {
    return (
        <section id="searchSection">
            {books && books.map((book:BookType, index:number)=>(
                <Book book = {book} key={index+"-"+book.key} setBook={setBook}></Book>
            ))}
        </section>
    )
}



export default QuickSearch