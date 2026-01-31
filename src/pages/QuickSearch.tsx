import type { BookType } from "../types/BookType";

import Book from "../components/Book";
type QuickSerachProps = {
    books:BookType[] | null,
    setBook:(book:BookType)=>void,
    setArrowsVisibles:(visible:boolean)=>void
}
const QuickSearch = ({books, setBook, setArrowsVisibles} : QuickSerachProps) => {
    return (
        <section id="searchSection">
            {books && books.map((book:BookType, index:number)=>(
                <Book book = {book} key={index+"-"+book.key} setBook={setBook} setArrowsVisibles={setArrowsVisibles}></Book>
            ))}
        </section>
    )
}



export default QuickSearch