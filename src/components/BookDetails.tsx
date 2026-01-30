import type { BookType } from "../types/BookType"

type BookDetailsProps = {
    book:BookType|undefined
}

const BookDetails = ({book}:BookDetailsProps)=>{
    return (
        <div>{book?.title}</div>
    )
}

export default BookDetails