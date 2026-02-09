import axios from 'axios'
import { BrowserRouter } from 'react-router'
import type { BookType } from '../types/BookType'
import BookDetails from './BookDetails'

describe('<BookDetails />', () => {

  const mountBookDetails = ()=>{
    const setLoading = cy.stub()
    const setError = cy.stub()
    const book:BookType ={
            key: "OLWORKTEST1",
            title: "Work Title Test",
            author_key: ["OLAUTHORTEST1", "OLAUTHORTEST2"],
            cover_i : "123456",
            edition_key : ["OLEDITIONTEST1"],
            wiki_lien:"https://fr.wikipedia.com/test",
            description:"Test Description",
            creationDate:"01/01/2026",
            subjects:["TestSubject1", "TestSubject2"]
          }
    cy.mount(
      <BrowserRouter>
        <BookDetails setError = {setError} theBook={book} setLoading={setLoading}/>
      </BrowserRouter>
    )

    return {book, setLoading, setError}
  }

  beforeEach(()=>{
    cy.stub(axios, "get").resolves({
      data:{
        extract: "Test résumé Wiki",
        originalimage:{
          source: "http://upload.wikipedia.org/test.jpg"
        }
      }
    })
  })

  it('renders', () => {
    mountBookDetails()

    cy.get("[data-cy=title]").should("contain", "Work Title Test")
    cy.get("[data-cy=author-item]").should("have.length", 2)
    cy.get("[data-cy=subject-item]").should("have.length", 2)
    cy.get("[data-cy=edition-item]").should("have.length", 1)
    cy.get("[data-cy=wiki]").should("be.visible")
    cy.contains("Test résumé Wiki").should("exist")
  })

  it('redirection to the detailed search page', ()=>{
    mountBookDetails()

    cy.get("[data-cy=subject-item]").eq(0).click()
    cy.location("pathname").should("eq", "/detailed-search/subject:TestSubject1")

  })
})