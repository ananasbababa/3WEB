import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Arrows from './components/Arrows'
import BookDetails from './components/BookDetails'
import Loading from './components/Loading'
import TopBar from './components/TopBar'
import DetailedSearch from './pages/DetailedSearch'
import RecentChanges from './pages/RecentChanges'
import type { BookType } from './types/BookType'
const App = ()=>{
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookType[]>([])
  const [book, setBook] = useState<BookType>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [arrowsVisibles, setArrowsVisibles] = useState<boolean>(false)
  
  return (
    <section className="App">
      <TopBar setBooks={setBooks} setBook={setBook} setLoading={setLoading} setArrowsVisibles={setArrowsVisibles}/>
      <section id = "content">

      <Routes>
        <Route path="/" element={<RecentChanges setLoading={setLoading} setBook={setBook}/>}></Route>
        <Route path="/detailed-search/:query" element={<DetailedSearch books={books} setBook = {setBook} setArrowsVisibles={setArrowsVisibles} setLoading = {setLoading} pageNumber={pageNumber}/>}></Route>
        <Route path="/book-details" element={<BookDetails theBook={book} setLoading={setLoading} />}></Route>
      </Routes>

      <Loading show={loading}></Loading>


      {arrowsVisibles==true &&
        <Arrows pageNumber={pageNumber} setPageNumber={setPageNumber}></Arrows>
      }
      </section>
    </section>
  )
}
export default App