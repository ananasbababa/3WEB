import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import icone from '../assets/bibliotheque.png';
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
    covers:number[],
    subjects:string[],
    edition_key:string[],
    links:{
        title:string,
        url:string
    }[]
}

const Book = ({book, setBook, setArrowsVisibles} : BookProps) =>{

    
    const [description, setDescription] = useState<string>("")
    const [creationDate, setCreationDate] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [subjects, setSubjects] = useState<string[]>([])
    const [lien, setLien] = useState<string>("")
    const navigate = useNavigate()

    useEffect(()=>{

        if(book.cover_i != undefined || book.cover_i != ""){
            setImage("https://covers.openlibrary.org/b/id/"+book.cover_i+"-M.jpg")
        }

        axios.get<ResponseType>("/openlibrary"+book.key+".json")
            .then(async response=>{

                const d = (typeof response.data.description == "string"? response.data.description : response.data.description?.value )?? ""
                setDescription(d)
                // setTitle(response.data.title?.trim())
                const date= new Date(response.data.created.value);
                var day = (date.getDate()<10)?"0"+date.getDate():date.getDate()
                var month = (date.getMonth()<10)?"0"+date.getMonth():date.getMonth()
                setCreationDate(day+"/"+month+"/"+date.getFullYear())
                setSubjects(response.data.subjects)
                if(image == ""){
                    if(response.data.covers?.[0] == undefined){
                        setImage(icone)
                    }else{
                        if(response.data.covers?.[0] != -1){
                            setImage("https://covers.openlibrary.org/b/id/"+response.data.covers?.[0]+"-M.jpg")
                        }else{
                            setImage(icone)
                        }
                    }
                }
                let linkObject = response.data.links.find((l)=>l.title.startsWith("Wikipedia") )
                setLien(linkObject?.url ?? "")
            })
            .catch(err=>{
                if(isAxiosError(err)){
                    console.log(err.message)
                }
            })

    }, [book.key])
    
    const openDetails = () => {
        book.description=description
        book.creationDate=creationDate
        book.cover_i=image
        book.subjects=subjects
        book.wiki_lien=lien
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
            <div className="card-body" data-cy="book-item">
                <h5 className="card-title">{book.title}</h5>
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