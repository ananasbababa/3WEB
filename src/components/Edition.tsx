import axios, { isAxiosError } from "axios"
import { useEffect, useState } from "react"
import icone from '../assets/bibliotheque.png'
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
    ocaid:string
}

type EditionProps = {
    edition_key:string,
    setError:(error:string)=>void
}

const Edition  = ({edition_key, setError}:EditionProps) => {
    const [edition, setEdition] = useState<EditionType>()
    const [image, setImage] = useState<string>("")
    const [audioBookLink, setAudioBookLink] = useState<string>("")
    useEffect(()=> {
        axios.get<EditionResponse>("/openlibrary/books/"+edition_key+".json")
            .then((res)=>{
                let lien="https://covers.openlibrary.org/a/id/"+res.data?.covers?.[0]+"-M.jpg"
                let newEdition:EditionType = {
                    image:lien,
                    nbPages:res.data.number_of_pages,
                    fullTitle:res.data.full_title ?? res.data.title,
                    publishDate:res.data.publish_date,
                    publishers:res.data.publishers,
                }

                if(res.data?.covers?.[0] == undefined){
                    setImage(icone)
                }else{
                    setImage(lien)
                }

                if(res.data.ocaid != undefined){
                    setAudioBookLink("https://archive.org/details/"+res.data.ocaid)
                }
                
                setEdition(newEdition)
            })
            .catch(err=>{
                if(isAxiosError(err)){
                    setError(err.message)
                }
            })
    }, [edition_key])

    return (
        <div className="card smallCard" data-cy="edition-item">
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
                {
                    audioBookLink != "" && <p className="card-text"><u>Lire ou écouter le livre :</u> <a href="">{audioBookLink}</a></p>
                }
                
            </div>
        </div>
    )
}


export default Edition