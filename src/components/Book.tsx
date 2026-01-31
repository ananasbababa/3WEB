import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import type { BookType } from "../types/BookType";
type BookProps = {
    book : BookType,
    setBook : (book:BookType)=>void,
    setArrowsVisibles : (visible:boolean)=>void
}

type ResponseType = {
    description:{value:string}|string,
    title:string,
    authors:[
        {
            author:{
                key:string[]
            }
        }
    ],
    created:{
        value:string
    },
    covers:number[]
}

const Book = ({book, setBook, setArrowsVisibles} : BookProps) =>{

    const [description, setDescription] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [creationDate, setCreationDate] = useState<string>("")
    const [image, setImage] = useState<string|undefined>(undefined)
    const [completeDatas, setCompleteDatas] = useState<Object|null>(null)
    const navigate = useNavigate()

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
        navigate("/book-details")
        setArrowsVisibles(false)
    }

    return (
        <div className="card bg-light">
            <img id="coverimage" src={image} className="card-img-top bigImage" alt="..."/>
            <div className="cardSpinner     ">
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