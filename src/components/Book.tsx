import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import icone from '../assets/bibliotheque.png';
import api from "../config/api";
import type { BookType } from "../types/BookType";

type BookProps = {
    book : BookType,
    setBook : (book:BookType)=>void
}

type ResponseType = {
    description:{value:string}|string,
    title:string,
    authors:[
        {
            author:{
                key:string
            }
        }
    ],
    created:{
        value:string
    },
    covers:number[]
}

const Book = ({book, setBook} : BookProps) =>{

    const [description, setDescription] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [creationDate, setCreationDate] = useState<string>("")
    const [image, setImage] = useState<string|undefined>(undefined)
    const [imgShow, setImgShow] = useState<boolean>(false)
    const imgRef = useRef<HTMLImageElement>(null);
    const completed : Boolean = Boolean(imgRef.current?.complete);
    const [completeDatas, setCompleteDatas] = useState<Object|null>(null)

    useEffect(()=>{
        console.log(book.key);
        
        api.get<ResponseType>(book.key+".json")
            .then(async response=>{
                const d = (typeof response.data.description == "string"? response.data.description : response.data.description?.value )?? ""
                setCompleteDatas(response.data)
                setDescription(d)

                setTitle(response.data.title?.trim() || "BLABLA")

                const date= new Date(response.data.created.value);
                var day = (date.getDay()<10)?"0"+date.getDay():date.getDay()
                var month = (date.getMonth()<10)?"0"+date.getMonth():date.getMonth()
                setCreationDate(day+"/"+month+"/"+date.getFullYear())

                setImage("https://covers.openlibrary.org/b/id/"+response.data.covers?.[0]+"-M.jpg")

            })
            .catch(err=>{
                if(isAxiosError(err)){
                    console.log(err.message)
                }
            })

    }, [book.key])
    
    const openDetails = () => {
        book.title=title
        book.description=description
        book.creationDate=creationDate
        book.image=image
        book.datas = completeDatas

        setBook(book)

        window.location.href='/book-details'
    }

    return (
        <div className="card bg-light">
            <img id="coverimage" ref={imgRef} src={image} onProgress={()=>setImgShow(false)} onError= {()=>setImage(icone)} className={"card-img-top "+((completed == true || imgShow == true)?"visible":"invisible")} alt="..."/>
            <div className={"cardSpinner "+((completed == true || imgShow == true)?"invisible":"visible")}>
                <div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description.substring(0, 100)+"..."}</p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">{book.author_name?.[0] ?? "Autheur inconnu"}</li>
                <li className="list-group-item">{creationDate}</li>
            </ul>

            <div className="card-body">
                <button onClick={()=>openDetails()} className="btn btn-outline-success my-2 my-sm-0">More details</button>
            </div>
        </div>
    )
}

export default Book