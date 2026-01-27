import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import icone from '../assets/bibliotheque.png';
import api from '../config/api';
import '../styles/App.scss';
import type { BookType } from '../types/BookType';


type TopBarProps = {
  setBooks : (books:BookType[])=>void,
  setLoading : (loading:boolean)=>void,
  setArrowsVisibles : (visible:boolean)=>void,
  pageNumber:number
}

type ResponseType={
  docs : BookType[]
}

const TopBar = ({setBooks, setLoading, setArrowsVisibles, pageNumber}:TopBarProps) =>{

  const [searchItem, setSearchItem] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(()=>{
    if(searchItem.length>0){
      searchBooks(null)
    }
  }, [pageNumber])

  const searchBooks = async (e: React.FormEvent<HTMLFormElement> |null)=>{
    e?.preventDefault()
    setArrowsVisibles(true)
    setLoading(true)
    try{
      const response = await api.get<ResponseType>("search.json?q='"+searchItem+"'&fields=key,author_key,author_name&limit=10&page="+pageNumber)
      
      setBooks(response.data.docs)
    } catch(err:unknown){
      if(isAxiosError(err)){
        setError(err.message)
      }
    } finally{
      setLoading(false)
      document.getElementById("quickSearchLink")?.click()
    }
  }

  return <nav className="navbar navbar-light bg-light topBar">
        <img src={icone} alt=""/>
        <form className="form-inline" onSubmit={(e)=>searchBooks(e)}>
          <input className="form-control mr-sm-2 searchInput" type="text" onChange = {(e)=>setSearchItem(e.target.value)} placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
        {error && <div>{error}</div>}
        <Link to="/quick-search" id="quickSearchLink"></Link>
      </nav>

}

export default TopBar