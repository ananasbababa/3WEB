import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import Arrows from './components/Arrows'
import BookDetails from './components/BookDetails'
import Loading from './components/Loading'
import TopBar from './components/TopBar'
import DetailedSearch from './pages/DetailedSearch'
import RecentChanges from './pages/RecentChanges'
import type { BookType } from './types/BookType'

const App = ()=>{
  const [book, setBook] = useState<BookType>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [arrowsVisibles, setArrowsVisibles] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  
  useEffect(()=>{
    if(error != ""){
      toast.error(error)
    }
  }, [error])

  return (
    <section className="App">
      <TopBar setError = {setError} setBook={setBook} setLoading={setLoading} setArrowsVisibles={setArrowsVisibles}/>
      <section id = "content">

      <Routes>
        <Route path="/" element={<RecentChanges setError = {setError} setLoading={setLoading} setBook={setBook}/>}></Route>
        <Route path="/detailed-search/:query" element={<DetailedSearch setError = {setError} setBook = {setBook} setArrowsVisibles={setArrowsVisibles} setLoading = {setLoading} pageNumber={pageNumber}/>}></Route>
        <Route path="/book-details" element={<BookDetails setError = {setError} theBook={book} setLoading={setLoading} />}></Route>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>

      <Loading show={loading}></Loading>

      <Toaster position="top-center" reverseOrder={false}/>

      {arrowsVisibles==true &&
        <Arrows pageNumber={pageNumber} setPageNumber={setPageNumber}></Arrows>
      }
      </section>
    </section>
  )
}
export default App