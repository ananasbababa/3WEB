import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Arrows from './components/Arrows'
import BookDetails from './components/BookDetails'
import Loading from './components/Loading'
import TopBar from './components/TopBar'
import QuickSearch from './pages/QuickSearch'
import RecentChanges from './pages/RecentChanges'
import type { BookType } from './types/BookType'
const App = ()=>{

  const [books, setBooks] = useState<BookType[]>([])
  const [book, setBook] = useState<BookType>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [arrowsVisibles, setArrowsVisibles] = useState<boolean>(false)
  
  useEffect(()=>{
    console.log("book", books)
  }, [books])
  return (
    <section className="App">
      <TopBar setBooks={setBooks} setLoading={setLoading} pageNumber={pageNumber} setArrowsVisibles={setArrowsVisibles}/>
      <section id = "content">

      <Routes>
        <Route path="/" element={<RecentChanges/>}></Route>
        <Route path="/deep-search">Advanced search</Route>
        <Route path="/quick-search" element={<QuickSearch books={books} setBook = {setBook} setArrowsVisibles={setArrowsVisibles}/>}></Route>
        <Route path="/book-details" element={<BookDetails theBook={book}/>}></Route>
      </Routes>

      {loading &&
        <Loading></Loading>
      }


      {arrowsVisibles &&
        <Arrows pageNumber={pageNumber} setPageNumber={setPageNumber}></Arrows>
      }
      </section>
    </section>
  )
}
export default App