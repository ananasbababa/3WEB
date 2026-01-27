import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import api from "../config/api";
import type { BookType } from "../types/BookType";
type BookProps = {
    book : BookType
}

type DescriptionType = {
    value:string
}|string

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

const Book = ({book} : BookProps) =>{

    const [description, setDescription] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [creationDate, setCreationDate] = useState<string>("")
    const [imageId, setImageId] = useState<number|null>(null)

    useEffect(()=>{
        api.get<ResponseType>(book.key+".json")
            .then(response=>{
                setImageId(response.data.covers[0])
                setDescription(response.data.description.value ?? response.data.description)
                setTitle(response.data.title)
                const date= new Date(response.data.created.value);
                var day = (date.getDay()<10)?"0"+date.getDay():date.getDay()
                var month = (date.getMonth()<10)?"0"+date.getMonth():date.getMonth()
                setCreationDate(day+"/"+month+"/"+date.getFullYear())
                
            })
            .catch(err=>{
                if(isAxiosError(err)){
                    console.log(err.message)
                }
            })
    }, [book.key])

    return (
        <div className="card bg-light">
            <img id="coverimage" src={imageId?"https://covers.openlibrary.org/b/id/"+imageId+"-M.jpg":""}  className="card-img-top" alt="..."/>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description.substring(0, 100)+"..."}</p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">{book.author_name[0]}</li>
                <li className="list-group-item">{creationDate}</li>
            </ul>

            <div className="card-body">
                <a href="#" className="btn btn-outline-success my-2 my-sm-0">More details</a>
            </div>
        </div>
    )
}

export default Book