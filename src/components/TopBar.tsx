import axios, { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import icone from '../assets/bibliotheque.png';
import '../styles/App.scss';
import type { BookType } from '../types/BookType';

type TopBarProps = {
  setBook : (book:BookType)=>void,
  setLoading : (loading:boolean)=>void,
  setArrowsVisibles : (visible:boolean)=>void
}

type ResponseType={
  docs : BookType[]
}

const TopBar = ({setBook, setLoading, setArrowsVisibles}:TopBarProps) =>{

  const [searchItem, setSearchItem] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [quickSearchBooks, setQuickSearchBooks] = useState<BookType[]>([])
  const [showQuickResult, setShowQuickResult] = useState<boolean>(false)
  const navigate = useNavigate()

  

  useEffect(()=> {
    const timer = setTimeout(() => {
      if(searchItem.trim() != ""){
        quickySearch(null)
      }
    }, 500);

    return ()=>clearTimeout(timer)
  }, [searchItem])

  const quickySearch = async (e: React.ChangeEvent<HTMLInputElement> |null)=>{
    e?.preventDefault()
    if(searchItem.trim() != ""){
      setShowQuickResult(true)
      try{
        const response = await axios.get<ResponseType>("/openlibrary/search.json?q='"+searchItem+"'&fields=title,key,author_key,author_name,edition_key,links,cover_i&limit=50&page=1")
        setQuickSearchBooks(response.data.docs)
      } catch(err:unknown){
        if(isAxiosError(err)){
          setError(err.message)
        }
      }
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
    setShowQuickResult(false)
    navigate("/detailed-search/"+searchItem)
    setArrowsVisibles(true)
  }

  return <nav className="navbar navbar-light bg-light topBar">
        <img src={icone} alt=""/>
        <form className="form-inline" onSubmit={(e)=>openSearch(e)}>
          <input className="form-control mr-sm-2 searchInput" type="text" onChange = {(e)=>{setSearchItem(e.target.value);}} placeholder="Search" aria-label="Search"/>
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
        {error && <div>{error}</div>}
      </nav>

}

export default TopBar