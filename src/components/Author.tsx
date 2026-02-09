import axios from "axios"
import { useEffect, useState } from "react"
import icone from "../assets/bibliotheque.png"
import type { AuteurType } from "../types/AuteurType"

type AuthorResponse = {
    photos:number[],
    bio:string,
    birth_date:string,
    death_date:string,
    personal_name:string,
    name:string
}

type AuthorProps = {
    author_key:string,
    setError:(error:string)=>void
}

const Author  = ({author_key, setError}:AuthorProps) => {
    const [author, setAuthor] = useState<AuteurType|undefined>()
    const [image, setImage] = useState<string|undefined>("/fallback.png")
    
    useEffect( ()=> {
        
        axios.get<AuthorResponse>("/openlibrary/authors/"+author_key+".json")
        .then((res)=>{
                let lien="https://covers.openlibrary.org/a/id/"+res.data?.photos?.[1]+"-M.jpg"
                let newAuthor:AuteurType = {
                    key:author_key,
                    name:res.data.personal_name ?? res.data.name,
                    photo:lien,
                    birth_date:res.data.birth_date,
                    death_date:res.data.death_date,
                }

                setAuthor(newAuthor)
                if(res.data?.photos?.[1]==undefined){
                    setImage(icone)
                }else{
                    setImage(lien)
                }
            })
            .catch((err)=>{
                setError(err.message)
            })
    }, [author_key])

    return (
        <div className="card smallCard" data-cy="author-item">
            <img id="coverimage" src={image}  className="card-img-top smallImage" alt="..."/>
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