import type { BookType } from "../types/BookType";

import Book from "../components/Book";
type QuickSerachProps = {
    books:BookType[] | null
}
const QuickSearch = ({books} : QuickSerachProps) => {
    return (
        <section id="searchSection">
            {books?.map((book:BookType)=>(
                <Book book = {book} key={book.key}></Book>

            ))}
        </section>
    )
}



export default QuickSearch