import { useEffect, useState } from "react"
import icone from "../assets/bibliotheque.png"
import api from "../config/api"
import type { AuteurType } from "../types/AuteurType"

type AuthorResponse = {
    photos:number[],
    bio:string,
    birth_date:string,
    death_date:string,
    personal_name:string
}

type AuthorProps = {
    author_key:string
}

const Author  = ({author_key}:AuthorProps) => {
    const [author, setAuthor] = useState<AuteurType|undefined>()
    const [image, setImage] = useState<string|undefined>(undefined)
    
    useEffect(()=> {
        api.get<AuthorResponse>("authors/"+author_key+".json")
            .then((res)=>{
                let lien="https://covers.openlibrary.org/a/id/"+res.data?.photos?.[1]+"-M.jpg"
                let newAuthor:AuteurType = {
                    name:res.data.personal_name,
                    photo:lien,
                    birth_date:res.data.birth_date,
                    death_date:res.data.death_date,
                }

                setAuthor(newAuthor)
                setImage(lien)
            })
    }, [author_key])

    useEffect(()=>{
        console.log(author)
    }, [author])
    return (
        <div className="card smallCard">
            <img id="coverimage" src={image} onError= {()=>setImage(icone)} className="card-img-top smallImage" alt="..."/>
            <div className="cardSpinner">
                <div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            <div className="card-body">
                <h5 className="card-title">{author?.name}</h5>
                <p className="card-text">{author?.birth_date} - {author?.death_date}</p>
            </div>
        </div>
    )
}


export default Author