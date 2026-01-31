import type { BookType } from "../types/BookType"
import Author from "./Author"

type BookDetailsProps = {
    theBook:BookType|undefined
}




const BookDetails = ({theBook}:BookDetailsProps)=>{


   

    return (
        <section>
            <section id="bookPresentation">
                <img src={theBook?.image} alt="" />
                <section id="titleDescription">
                    <h1 className="display-1"><b>{theBook?.title}</b></h1>
                    <div>{theBook?.description}</div>
                    <div>{theBook?.author_key}</div>
                </section>
            </section>

            <h1 className="display-5 title"><b>Auteur(s)</b></h1    >

            <section id="authors">
                {theBook?.author_key.map((key, index)=>(
                    <Author key={key+"-"+index} author_key={key}/>
                ))}
            </section>
        </section>
    )
}

export default BookDetails