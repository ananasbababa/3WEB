import axios, { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import icone from '../assets/bibliotheque.png';
import '../styles/App.scss';
import type { BookType } from '../types/BookType';

type TopBarProps = {
  setBook : (book:BookType)=>void,
  setError : (message:string)=>void,
  setLoading : (loading:boolean)=>void,
  setArrowsVisibles : (visible:boolean)=>void
}

type ResponseType={
  docs : BookType[]
}

const TopBar = ({setBook, setLoading, setArrowsVisibles, setError}:TopBarProps) =>{

  const [searchItem, setSearchItem] = useState<string>("")
  const [quickSearchBooks, setQuickSearchBooks] = useState<BookType[]>([])
  const [showQuickResult, setShowQuickResult] = useState<boolean>(false)

  const quickSearchRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const navigate = useNavigate()

  useEffect(()=>{
    const handleClickOutside = (event:MouseEvent)=>{
      if(quickSearchRef.current && !quickSearchRef.current.contains(event.target as Node)){
        setShowQuickResult(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return ()=>{
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(()=> {
    const timer = setTimeout(() => {
      if(searchItem.trim().length>=3){
        quickySearch(null)
      }
    }, 1000);

    return ()=>clearTimeout(timer)
  }, [searchItem])

  

  const quickySearch = async (e: React.ChangeEvent<HTMLInputElement> |null)=>{
    e?.preventDefault()
    if(searchItem.trim().length>=3){
      setShowQuickResult(true)
      try{
        const response = await axios.get<ResponseType>("/openlibrary/search.json?q='"+searchItem+"'&fields=title,key,author_key,author_name,edition_key,links,cover_i&limit=50&page=1")
        if(!response.data || !Array.isArray(response.data.docs)){
          setError("Erreur API")
          throw new Error("Format de données invalide")
        }else{
          setQuickSearchBooks(response.data.docs)
        }
      } catch(err:unknown){
        if(isAxiosError(err)){
          setError(err.message)
        }
      }
    }else{
      setError("Un recherche doit être constituée au minimum de 3 lettres")
    }
  }

  const openDetails = (book:BookType) => {
    setShowQuickResult(false)
    setBook(book)
    navigate("/book-details")
    setArrowsVisibles(false)
    setLoading(true)
  }

  const openSearch = (e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    if(searchItem.trim().length<3){
      setError("Un recherche doit être constituée au minimum de 3 lettres")
    }else{
      setShowQuickResult(false)
      navigate("/detailed-search/"+searchItem)
      setArrowsVisibles(true)
    }
  }

  return <nav className="navbar navbar-light bg-light topBar">
        <img src={icone} alt="" onClick={()=>navigate("/")}/>
        <div ref={quickSearchRef}>
          <form className="form-inline" onSubmit={(e)=>openSearch(e)}>
            <input 
              ref = {inputRef} 
              className="form-control mr-sm-2 searchInput" 
              type="text" 
              onChange = {(e)=>{setSearchItem(e.target.value);}} 
              placeholder="Search" 
              aria-label="Search"
              onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  setShowQuickResult(false)
                }
              }}
            />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
          <ul className={"dropdown-menu quickSearch "+(showQuickResult==true?"show visible":"invisible")}>
            {
              quickSearchBooks.map((book, index)=>(
                <section key={book.key+"-"+index}>
                  <li ><a className="dropdown-item" onClick={()=>openDetails(book)}>
                    <img src={((book.cover_i!=undefined && book.cover_i!="" )?"https://covers.openlibrary.org/b/id/"+book.cover_i+"-S.jpg":icone)} alt="" />
                    <div className="ecriture">
                      <h5 className="card-title">{book.title}</h5>
                      <p className="card-text">{book.author_name}</p>
                    </div>
                  </a></li>
                  <li><hr className="dropdown-divider"/></li>
                </section>

              ))
            }
            
          </ul>
        </div>
      </nav>

}

export default TopBar