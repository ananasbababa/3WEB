import { isAxiosError } from "axios"
import { useEffect, useState } from "react"
import icone from '../assets/bibliotheque.png'
import api from "../config/api"
import type { EditionType } from "../types/EditionType"

type EditionResponse = {
    authors:{
        key:string
    }[],
    languages:{
        key:string
    }[],
    number_of_pages:number,
    covers:string[],
    full_title:string,
    title:string,
    publish_date:string,
    publishers:string[],
}

type AuthorResponse = {
    personal_name:string
}

type LanguageReponse = {
    name:string
}

type EditionProps = {
    edition_key:string
}

const Edition  = ({edition_key}:EditionProps) => {
    const [edition, setEdition] = useState<EditionType>()
    const [image, setImage] = useState<string>("")
    useEffect(()=> {
        api.get<EditionResponse>("books/"+edition_key+".json")
            .then((res)=>{
                console.log("EDITION response", res.data);
                
                let lien="https://covers.openlibrary.org/a/id/"+res.data?.covers?.[0]+"-M.jpg"
                let newEdition:EditionType = {
                    image:lien,
                    nbPages:res.data.number_of_pages,
                    fullTitle:res.data.full_title ?? res.data.title,
                    publishDate:res.data.publish_date,
                    publishers:res.data.publishers,
                }

                setEdition(newEdition)

                if(res.data?.covers?.[0] == undefined){
                    setImage(icone)
                }
            })
            .catch(err=>{
                if(isAxiosError(err)){
                    console.log(err.message)
                }
            })
    }, [edition_key])

    useEffect(()=>{
        console.log("edition", edition)
    }, [edition])
    return (
        <div className="card smallCard">
            <img id="coverimage" src={image == ""?edition?.image:image} className="card-img-top smallImage" alt="..."/>
            <div className="cardSpinner">
                <div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            <div className="card-body">
                <h5 className="card-title">{edition?.fullTitle}</h5>
                <p className="card-text"><u>Editeurs :</u> {edition?.publishers}</p>
                <p className="card-text"><u>Date de publication :</u> {edition?.publishDate}</p>
                <p className="card-text"><u>Nombre de pages :</u> {edition?.nbPages ?? "-"}</p>
            </div>
        </div>
    )
}


export default Edition