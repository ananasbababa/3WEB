import axios, { isAxiosError } from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import icone from '../assets/bibliotheque.png'
import type { BookType } from "../types/BookType"
import Author from "./Author"
import Edition from "./Edition"
import Subject from "./Subject"
type BookDetailsProps = {
    theBook:BookType|undefined,
    setLoading:(loading:boolean)=>void
}

type WikiResponse = {
    originalimage:{
        source:string
    },
    extract:string
}

type ResponseType = {
    description:{value:string}|string,
    title:string,
    created:{
        value:string
    },
    covers:number[],
    subjects:string[],
    links:{
        title:string,
        url:string
    }[]
}


const BookDetails = ({theBook, setLoading}:BookDetailsProps)=>{
    const navigate = useNavigate()
    useEffect(()=>{
        if(theBook == undefined){
            navigate("/")
        }
    }, [theBook])
    const [authorsOpen, setAuthorsOpen] = useState<boolean>(false)
    const [editionsOpen, setEditionsOpen] = useState<boolean>(false)
    const [wLink, setWLink] = useState<string>(theBook?.wiki_lien ?? "")
    const [wImage, setWImage] = useState<string>("")
    const [wDescription, setWDescription] = useState<string>("")
    const [showWiki, setShowWiki] = useState<boolean>(true)
    const [description, setDescription] = useState<string>(theBook?.description ?? "")
    const [title, setTitle] = useState<string>(theBook?.title ?? "")
    const [creationDate, setCreationDate] = useState<string>(theBook?.creationDate ?? "")
    const [subjects, setSubjects] = useState<string[]>(theBook?.subjects ?? [])
    const [image, setImage] = useState<string>(theBook?.cover_i ?? "")
    
    
    useEffect(()=>{
        
        if(theBook != undefined){
            //MAJ DES DONNEES SI ELLES N'ONT PAS ENCORE EU LE TEMPS DE SE CHARGER
            if(wLink=="" || title==""){
                axios.get<ResponseType>("/openlibrary/"+theBook?.key+".json")
                .then((res)=>{
                    const d = (typeof res.data.description == "string"? res.data.description : res.data.description?.value )?? ""
                    setDescription(d)
                    setTitle(res.data.title?.trim())
                    const date= new Date(res.data.created.value);
                    var day = (date.getDate()<10)?"0"+date.getDate():date.getDate()
                    var month = (date.getMonth()<10)?"0"+date.getMonth():date.getMonth()
                    setCreationDate(day+"/"+month+"/"+date.getFullYear())
                    setSubjects(res.data.subjects)
                    if(res.data.covers?.[0] == undefined){
                        setImage(icone)
                    }else{
                        if(res.data.covers?.[0] != -1){
                            setImage("https://covers.openlibrary.org/b/id/"+res.data.covers?.[0]+"-M.jpg")
                        }else{
                            setImage(icone)
                        }
                    }
                    
                    let linkObject = res.data.links.find((l)=>l.title.startsWith("Wikipedia") )
                    
                    setWLink(linkObject?.url ?? "")
                })
                .catch((err)=>{
                    if(isAxiosError(err)){
                        console.log("Err : ", err.message)
                    }
                })
            }
    
            if(theBook?.author_key != undefined){;
                if(theBook?.author_key?.length<5){
                    setAuthorsOpen(true)
                }
            }
            if(theBook?.edition_key != undefined){
                if(theBook?.edition_key?.length<5){
                    setEditionsOpen(true)
                }
            }
            
        }



    }, [theBook?.key])

    useEffect(()=>{
        
        //WIKIPEDIA
        if(wLink != ""){
            let urlParts = wLink.split("/")
            
            if(urlParts != undefined){
                let titlePage = urlParts[urlParts.length-1]
                
                let url = urlParts.slice(0, 3).join("/")
                axios.get<WikiResponse>(url+"/api/rest_v1/page/summary/"+titlePage)
                .then((resDes)=>{
                    console.log("BOOOKDETAILS", resDes.data);
                    setWDescription(resDes.data.extract)
                    setWImage(resDes.data.originalimage.source)
                })
                .catch((err)=>{
                    if(isAxiosError(err)){
                        console.log("Err : ", err.message)
                    }
                })
            }
            setShowWiki(true)
        }else{
            setShowWiki(false)
        }
    }, [wLink])

    useEffect(()=>{
        if(title != ""){
            setLoading(false)
        }else{
            setLoading(true)

        }
    }, [title])
    return (
        (theBook != undefined) && <section id="bookDetailsSection">
            <section id="bookPresentation">
                <img src={image} alt="" />
                <section id="titleDescription">
                    <h1 className="display-1 text-center"><b>{title}</b></h1>
                    <div className="text-center display-6 date">{creationDate}</div>
                    
                    <div className="text-center">{description}</div>
                </section>
            </section>



            <h1 className="display-5 title"><b>Auteur(s)</b></h1>
            <button className = {"btn btn-outline-success my-2 my-sm-0 "+(authorsOpen==true?"invisible":"visible")} onClick={()=>{setAuthorsOpen(true);document.querySelector(".loadA")?.remove()}}>Load Authors</button>
            <section id="authors">
                {authorsOpen && theBook?.author_key?.map( (key, index)=>(
                    <Author key={key+"-"+index} author_key={key}/>
                ))}
            </section>


            <h1 className={"display-5 title"}><b>Subjects</b></h1>
            <section id="subjects">
                {subjects?.map( (subject, index)=>(
                    <Subject key={subject+"-"+index} subject={subject}/>
                ))}
            </section>

            <h1 className="display-5 title"><b>Editions</b></h1>
            <button className = {"btn btn-outline-success my-2 my-sm-0 "+(editionsOpen==true?"invisible":"visible")} onClick={(e)=>{setEditionsOpen(true);document.querySelector(".loadE")?.remove()}}>Load Editions</button>
            <section id="editions">
                {editionsOpen && theBook?.edition_key?.map( (edition_key, index)=>
                    index>0 && index<=20 && <Edition key={edition_key+"-"+index} edition_key={edition_key}/>
                )}
            </section>

            <h1 className={"display-5 title "+(showWiki==true?"visible":"invisible")}><b>Données de Wikipédia :</b></h1>
            <section id="bookPresentation" className={(showWiki==true?"visible":"invisible")}>
                <img src={wImage} alt="" />
                <section id="titleDescription">
                    
                    <div className="text-center">{wDescription}</div>
                    <div className="text-center"><a href={wLink}>Pour plus d'informations, consultez la page Wikipédia dédiée</a></div>
                </section>
            </section>

        </section>
    )
}

export default BookDetails