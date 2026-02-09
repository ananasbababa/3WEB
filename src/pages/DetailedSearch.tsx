import type { BookType } from "../types/BookType";

import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Author from "../components/Author";
import Book from "../components/Book";
import Subject from "../components/Subject";
import type { AuteurType } from "../types/AuteurType";
import type { SubjectType } from "../types/SubjectType";

type DetailedSearchProps = {
    setBook:(book:BookType)=>void,
    setArrowsVisibles:(visible:boolean)=>void,
    setLoading:(loading:boolean)=>void,
    setError:(message:string)=>void,
    pageNumber:number
}

type ResponseBooksType={
  docs : BookType[]
}

type ResponseAuthorsType={
  docs : AuteurType[]
}

type ResponseSubjectsType={
  docs : SubjectType[]
}

const DetailedSearch = ({setBook, setArrowsVisibles, setLoading, pageNumber, setError} : DetailedSearchProps) => {
    const { query } = useParams<{ query: string }>()
    const [titleQuery, setTitleQuery] = useState<string>("")
    const [authorQuery, setAuthorQuery] = useState<string>("")
    const [isbnQuery, setIsbnQuery] = useState<string>("")
    const [subjectQuery, setSubjectQuery] = useState<string>("")
    const [placeQuery, setPlaceQuery] = useState<string>("")
    const [characQuery, setCharacQuery] = useState<string>("")
    const [editorQuery, setEditorQuery] = useState<string>("")
    const [show, setShow] = useState<string>("books")
    const [books, setBooks] = useState<BookType[]>([])
    const [authors, setAuthors] = useState<AuteurType[]>([])
    const [subjects, setSubjects] = useState<SubjectType[]>([])
    
    const navigate = useNavigate()

    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        if(query != undefined){
            if(query.length<3){
                navigate("/")
            }
            else{   
                var searchInput:HTMLInputElement|null = document.querySelector(".searchInput")
                if(searchInput){
                    searchInput.value = query
                }
            }
        }
    }, [])

    useEffect(()=>{
            setLoading(true)
            setArrowsVisibles(true)

            if(show=="books"){
                axios.get<ResponseBooksType>("/openlibrary/search.json?q="+query+"&fields=key,author_key,author_name,edition_key,links,cover_i,title&limit=10&page="+pageNumber)
                .then((res)=>{
                    if(!res.data || !Array.isArray(res.data.docs)){
                        setError("Erreur API")
                        throw new Error("Format de données invalide")
                    }else{
                        setBooks(res.data.docs)
                    }
                })
                .catch((err)=>{
                    if(isAxiosError(err)){
                        setError(err.message)
                    }
                }) 
                .finally(()=>{
                    setLoading(false)
                })
            }
            else if(show=="authors"){
                axios.get<ResponseAuthorsType>("/openlibrary/search/authors.json?q='"+query+"'&fields=key&limit=10&page="+pageNumber)
                .then((res)=>{
                    if(!res.data || !Array.isArray(res.data.docs)){
                        setError("Erreur API")
                        throw new Error("Format de données invalide")
                    }else{
                        setAuthors([...new Set(res.data.docs)])
                    }
                })
                .catch((err)=>{
                    if(isAxiosError(err)){
                        setError(err.message)
                    }
                }) 
                .finally(()=>{
                    setLoading(false)
                })
            }
            else if(show=="subjects"){
                axios.get<ResponseSubjectsType>("/openlibrary/search/subjects.json?q='"+query+"'&fields=key,name&limit=50&page="+pageNumber)
                .then((res)=>{
                    if(!res.data || !Array.isArray(res.data.docs)){
                        setError("Erreur API")
                        throw new Error("Format de données invalide")
                    }else{
                        setSubjects([...new Set(res.data.docs)])
                    }
                })
                .catch((err)=>{
                    if(isAxiosError(err)){
                        setError(err.message)
                    }
                }) 
                .finally(()=>{
                    setLoading(false)
                })
            }else if(show=="deepSearch"){
                setLoading(false)
                setArrowsVisibles(false)
            }
        
    }, [query, show, pageNumber])

    useEffect(()=>{
        if(show=="deepSearch"){
            resetDatas()
        }
    }, [show])

    const detailledSearch = (e:React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        let q = ""
        const values = [titleQuery, authorQuery, isbnQuery, subjectQuery, placeQuery, characQuery, editorQuery]
        const textValues = ["title", "author", "isbn", "subject", "place", "person", "publisher"]
        values.forEach((value, index)=> {
            if(value != ""){
                q+=textValues[index]+":"+value+"+"
            }
        })
        var searchInput:HTMLInputElement|null = document.querySelector(".searchInput")
        if(searchInput){
            searchInput.value = q
        }
        navigate("/detailed-search/"+q)
        setShow("books")
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    const resetDatas = ()=>{
        setTitleQuery("")
        setAuthorQuery("")
        setCharacQuery("")
        setEditorQuery("")
        setIsbnQuery("")
        setSubjectQuery("")
        setPlaceQuery("")
    }

    return (
        <section id="searchSection">
            <nav className="navbar">
                <form className="container-fluid justify-content-center">
                    <button type="button" className={"btn "+ (show=="books"?"btn-success":"btn-secondary") +" subjectButton"} onClick={()=>{setShow("books");}}>Livres</button>
                    <button type="button" className={"btn "+ (show=="authors"?"btn-success":"btn-secondary") +" subjectButton"}  onClick={()=>{setShow("authors");}}>Auteurs</button>
                    <button type="button" className={"btn "+ (show=="subjects"?"btn-success":"btn-secondary") +" subjectButton"}  onClick={()=>{setShow("subjects");}}>Thèmes</button>
                    <button type="button" className={"btn "+ (show=="deepSearch"?"btn-success":"btn-secondary") +" subjectButton"}  onClick={()=>{setShow("deepSearch");}}>Recherche avancée</button>
                </form>
            </nav>
            <section className="content">
                <div data-cy="books-list">
                    {show == "books" && books.map((book, index)=>(
                        <Book book = {book} key={index+"-"+book.key} setBook={setBook} setArrowsVisibles={setArrowsVisibles}></Book>
                    ))}

                </div>

                <div data-cy="authors-list">
                {
                    show == "authors" && authors.map((author, index)=>(
                    <Author author_key = {author.key} key={index+"-"+author.key} setError={setError}/>
                ))}
                </div>

                <div data-cy="subjects-list">
                {
                    show == "subjects" && subjects?.map( (subject, index)=>(
                    <Subject key={subject+"-"+index} subject={subject.name}/>
                ))}
                </div>

                <div data-cy="deepSearch">
                {
                    show == "deepSearch" && <form>
                        <div className="mb-3" data-cy="deepSearchTitle">
                            <label htmlFor="inputTitre" className="form-label">Titre</label>
                            <input type="text" onChange={(e)=>setTitleQuery(e.target.value)} className="form-control" id="inputTitre" aria-describedby="titreHelp"/>
                            <div id="titreHelp" className="form-text">Titre du livre recherché</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputAuthor" className="form-label">Auteur</label>
                            <input type="text" onChange={(e)=>setAuthorQuery(e.target.value)} className="form-control" id="inputAuthor" aria-describedby="authorHelp"/>
                            <div id="authorHelp" className="form-text">Nom de l'auteur recherché</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputISNB" className="form-label">ISBN</label>
                            <input type="text" onChange={(e)=>setIsbnQuery(e.target.value)} className="form-control" id="inputISNB" aria-describedby="isbnHelp"/>
                            <div id="isbnHelp" className="form-text">Numéro ISBN du livre recherché</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputSubject" className="form-label">Thème</label>
                            <input type="text" onChange={(e)=>setSubjectQuery(e.target.value)} className="form-control" id="inputSubject" aria-describedby="subjectHelp"/>
                            <div id="subjectHelp" className="form-text">Thème recherché</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputPlace" className="form-label">Lieu</label>
                            <input type="text" onChange={(e)=>setPlaceQuery(e.target.value)} className="form-control" id="inputPlace" aria-describedby="placeHelp"/>
                            <div id="placeHelp" className="form-text">Lieu recherché</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputCharac" className="form-label">Personnage</label>
                            <input type="text" onChange={(e)=>setCharacQuery(e.target.value)} className="form-control" id="inputCharac" aria-describedby="characHelp"/>
                            <div id="characHelp" className="form-text">Personnage recherché</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputEditor" className="form-label">Éditeur</label>
                            <input type="text" onChange={(e)=>setEditorQuery(e.target.value)} className="form-control" id="inputEditor" aria-describedby="editorHelp"/>
                            <div id="editorHelp" className="form-text">Éditeur recherché</div>
                        </div>
                        <button onClick={(e)=>detailledSearch(e)} className="btn btn-outline-success my-2 my-sm-0" data-cy="submitDeepSearch">Search</button>
                    </form>
                }
                </div>

            </section>
        </section>
    )
}



export default DetailedSearch