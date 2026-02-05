import axios, { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import icone from '../assets/bibliotheque.png'
import type { BookType } from '../types/BookType'


type ResponseBooksType={
  docs : BookType[]
}

type RecentChangesProps = {
    setLoading:(loading:boolean)=>void,
    setBook:(book:BookType)=>void
}

const RecentChanges = ({setLoading, setBook}:RecentChangesProps) => {
    const [active, setActive] = useState<number>(0)
    const [books, setBooks] = useState<BookType[]>([])
    const navigate = useNavigate()

    useEffect(()=>{
        setLoading(true)
        axios.get<ResponseBooksType>("/openlibrary/search.json?q=recent&fields=key,author_key,author_name,edition_key,links,cover_i,title&limit=20&page=1")
        .then((res)=>{
            setBooks(res.data.docs)
        })
        .catch((err)=>{
            if(isAxiosError(err)){
                console.log("Err : ", err)
            }
        }) 
        .finally(()=>{
            setLoading(false)
        })
    }, [])

    return (
        <section>

                    <h5 className="display-5 text-center">Ajouts Récents</h5>
            <div id="carouselExampleCaptions" className="carousel slide">
                <div className="carousel-indicators">
                    {books.map((book, index)=>(
                        <button key = {index} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className={(active == index?"active":"")} aria-current="true" aria-label={"Slide "+index}></button>
                    ))
                    }
                </div>
                <div className="carousel-inner">
                    {books.map((book, index)=>(
                            <div className={"carousel-item "+(active == index?"active":"")} key={book.key+"-"+index}>
                                <a onClick={()=>{setLoading(true);setBook(book);navigate("/book-details")}}>
                                    <div  className={"w-100 carouselImgDiv"}>
                                        <img src={(book.cover_i==undefined ? icone : "https://covers.openlibrary.org/b/id/"+book.cover_i+"-M.jpg")} className="d-block" alt="..."/>
                                    </div>
                                    <div className="carousel-caption d-none d-md-block">
                                        <h5>{book.title}</h5>
                                        <p>{book.author_name?.join(", ")}</p>
                                    </div>

                                </a>
                            </div>

                        ))
                    }
                    
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev" onClick={()=>setActive(active-1)}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next"  onClick={()=>setActive(active+1)}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default RecentChanges