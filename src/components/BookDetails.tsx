import { isAxiosError } from "axios"
import { useEffect, useState } from "react"
import apiWikiFr from "../config/apiWikiFr"
import type { BookType } from "../types/BookType"
import Author from "./Author"
import Edition from "./Edition"
import Subject from "./Subject"

type BookDetailsProps = {
    theBook:BookType|undefined
}

type WikiLinkResponse = [
    string,
    string[],
    string[],
    string[]
]


type WikiResponse = {
    originalimage:{
        source:string
    },
    extract:string
}



const BookDetails = ({theBook}:BookDetailsProps)=>{

    const [authorsOpen, setAuthorsOpen] = useState<boolean>(false)
    const [editionsOpen, setEditionsOpen] = useState<boolean>(false)
    const [wLink, setWLink] = useState<string>("")
    const [wImage, setWImage] = useState<string>("")
    const [wDescription, setWDescription] = useState<string>("")

    useEffect(()=>{
        
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

        //WIKIPEDIA
        //Recherche
        apiWikiFr.get<WikiLinkResponse>("w/api.php?action=opensearch&search="+theBook?.title+" "+theBook?.author_name+"&origin=*")
        .then((res)=>{
            console.log("WIKI ONE", res.data[3][0])
            setWLink(res.data[3][0])

            let urlParts = res.data[3][0].split("/")
            let titlePage = urlParts[urlParts.length-1]


            //Description
            apiWikiFr.get<WikiResponse>("api/rest_v1/page/summary/"+titlePage)
            .then((resDes)=>{
                setWDescription(resDes.data.extract)
                setWImage(resDes.data.originalimage.source)
            })

        })
        .catch((err)=>{
            if(isAxiosError(err)){
                console.log("Err : ", err.message)
            }
        })

    }, [theBook?.key])

    return (
        <section id="bookDetailsSection">
            <section id="bookPresentation">
                <img src={theBook?.image} alt="" />
                <section id="titleDescription">
                    <h1 className="display-1 text-center"><b>{theBook?.title}</b></h1>
                    <div className="text-center display-6 date">{theBook?.creationDate}</div>
                    
                    <div className="text-center">{theBook?.description}</div>
                </section>
            </section>



            <h1 className="display-5 title"><b>Auteur(s)</b></h1>
            <button className = {"btn btn-outline-success my-2 my-sm-0 "+(authorsOpen==true?"invisible":"visible")} onClick={()=>{setAuthorsOpen(true);document.querySelector(".loadA")?.remove()}}>Load Authors</button>
            <section id="authors">
                {authorsOpen && theBook?.author_key?.map( (key, index)=>(
                    index<=10 && <Author key={key+"-"+index} author_key={key}/>
                ))}
            </section>


            <h1 className={"display-5 title"}><b>Subjects</b></h1>
            <section id="subjects">
                {theBook?.subjects?.map( (subject, index)=>(
                    <Subject key={subject+"-"+index} subject={subject}/>
                ))}
            </section>

            <h1 className="display-5 title"><b>Editions</b></h1>
            <button className = {"btn btn-outline-success my-2 my-sm-0 "+(editionsOpen==true?"invisible":"visible")} onClick={(e)=>{setEditionsOpen(true);document.querySelector(".loadE")?.remove()}}>Load Editions</button>
            <section id="editions">
                {editionsOpen && theBook?.edition_key?.map( (edition_key, index)=>
                    index>0 && index<=10 && <Edition key={edition_key+"-"+index} edition_key={edition_key}/>
                )}
            </section>

            <h1 className="display-5 title"><b>Données de Wikipédia :</b></h1>
            <section id="bookPresentation">
                <img src={wImage} alt="" />
                <section id="titleDescription">
                    
                    <div className="text-center">{wDescription}</div>
                    <div className="text-center"><a href={wLink}>Pour plus d'informations, consultez la page Wikipédia dédiée</a></div>
                </section>
            </section>
            {/* <section id="caracs">
                <section className="caractDiv border border-success">
                    <p className="caractType text-center">https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=21721040</p>
                    <p className="caracValue">https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=Stack%20Overflow+</p>
                </section>https://en.wikipedia.org/api/rest_v1/page/summary/Stack_Overflow
            </section> */}

        </section>
    )
}

export default BookDetails