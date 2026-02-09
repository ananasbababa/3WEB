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
    setError : (message:string)=>void,
    setBook:(book:BookType)=>void
}

const RecentChanges = ({setLoading, setBook, setError}:RecentChangesProps) => {
    const [active, setActive] = useState<number>(0)
    const [recentlyAddedBooks, setRecentlyAddedBooks] = useState<BookType[]>([])
    const [trendingBooks, setTrandingBooks] = useState<BookType[]>([])
    const [soloPlay, setSoloPlay] = useState<boolean>(true)
    const navigate = useNavigate()
    const carouselId = 'recentChangesCarousel'

    useEffect(()=>{
        setLoading(true)

        //AJOUTS RECENTS
        axios.get<ResponseBooksType>("/openlibrary/search.json?q=recent&fields=key,author_key,author_name,edition_key,links,cover_i,title&limit=20&page=1")
        .then((res)=>{
            if(!res.data || !Array.isArray(res.data.docs)){
                setError("Erreur API")
                throw new Error("Format de données invalide")
            }else{
                setRecentlyAddedBooks(res.data.docs)
            }
        })
        .catch((err)=>{
            if(isAxiosError(err)){
                setError(err.message)
            }
        }) 
        .finally(()=>{
            setLoading(false)
        })

        //LIVRES EN VOGUE
        axios.get<ResponseBooksType>(`/openlibrary/search.json?q=trending_score_hourly_sum%3A%5B1+TO+%2A%5D+readinglog_count%3A%5B4+TO+%2A%5D+language%3Afre+-subject%3A"content_warning%3Acover"+-subject%3A"content_warning%3Acover"&fields=key,author_key,author_name,edition_key,links,cover_i,title&limit=20&page=1&sort=trending`)
        .then((res)=>{
            setTrandingBooks(res.data.docs)
        })
        .catch((err)=>{
            if(isAxiosError(err)){
                setError(err.message)
            }
        }) 
        .finally(()=>{
            setLoading(false)
        })
    }, [])

    useEffect(()=>{
        if(recentlyAddedBooks.length>0){
            const interval = setInterval(()=>{
                if(soloPlay){
                    handleActive(true)
                }
            }, 5000)
    
            return ()=>clearInterval(interval)
        }
        else{
            return;
        }

    }, [active, recentlyAddedBooks, soloPlay])


    const handleActive = (plus:boolean, fromUser=false)=>{
        if(fromUser){
            setSoloPlay(false)
            
            setTimeout(()=>{
                setSoloPlay(true)
            }, 10000)
        }

        if(recentlyAddedBooks.length>0){
            if(active == 0 && plus==false){
                setActive(recentlyAddedBooks.length-1)
            }else if(active == (recentlyAddedBooks.length-1) && plus==true){
                setActive(0)
            }else{
                setActive(plus==true?active+1:active-1)
            }
        }

    }

    return (
        <section>

            <h5 className="display-5 text-center">Ajouts Récents</h5>
            <div 
                id={carouselId} 
                className="carousel slide"
                data-bs-ride={soloPlay ? "carousel" : undefined}
                data-bs-interval="5000"
            >
                <div className="carousel-indicators">
                    {recentlyAddedBooks.map((book, index)=>(
                        <button key = {index} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className={(active == index?"active":"")} aria-current="true" aria-label={"Slide "+index}></button>
                    ))
                    }
                </div>
                <div className="carousel-inner">
                    {recentlyAddedBooks.map((book, index)=>(
                            <div className={"carousel-item recent "+(active == index?"active":"")} key={book.key+"-"+index}>
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
                    
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev" onClick={()=>handleActive(false, true)}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next"  onClick={()=>handleActive(true, true)}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>


            <h5 className="display-5 text-center">Livres en vogue</h5>
            <div 
                id={carouselId} 
                className="carousel slide"
                data-bs-ride={soloPlay ? "carousel" : undefined}
                data-bs-interval="5000"
            >
                <div className="carousel-indicators">
                    {trendingBooks.map((book, index)=>(
                        <button key = {index} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className={(active == index?"active":"")} aria-current="true" aria-label={"Slide "+index}></button>
                    ))
                    }
                </div>
                <div className="carousel-inner">
                    {trendingBooks .map((book, index)=>(
                            <div className={"carousel-item trending "+(active == index?"active":"")} key={book.key+"-"+index}>
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
                    
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev" onClick={()=>handleActive(false, true)}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next"  onClick={()=>handleActive(true, true)}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default RecentChanges