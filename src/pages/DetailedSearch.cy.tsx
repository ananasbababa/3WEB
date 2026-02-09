import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router'
import DetailedSearch from './DetailedSearch'

beforeEach(()=>{
  cy.spy(window.history, "pushState").as("pushState")
})
describe('<DetailedSearch />', () => {

  const mountDetailedSearch = () =>{
    const setBook = cy.stub()
    const setArrowsVisibles = cy.stub()
    const setLoading = cy.stub()
    const setError = cy.stub()
    const pageNumber = 1
    
    window.history.pushState({}, "", "/detailed-search/Test")
    cy.mount(
      <BrowserRouter>
        <Routes>
          <Route 
            path='/detailed-search/:query'
            element={<DetailedSearch setError={setError} pageNumber={pageNumber} setBook={setBook} setLoading={setLoading} setArrowsVisibles={setArrowsVisibles}/>}
          />
        </Routes>
      </BrowserRouter>
    )

    return {setBook, setLoading, setArrowsVisibles, setError, pageNumber}
  }

  beforeEach(()=>{
    cy.stub(axios, "get").resolves({
      data:{
        docs:[
          {
            key: "OLWORKTEST1",
            title: "Work Title Test",
            author_name: ["Test test"],
            author_key: ["OLAUTHORTEST1"],
            cover_i : "123456",
            edition_key : ["OLEDITIONTEST1"],
            wiki_lien:"https://fr.wikipedia.com/test"
          }
        ]
      }
    })
  })
  
  it('renders test', () => {
    mountDetailedSearch()

    cy.get("[data-cy=books-list]").should("exist")
    cy.get("[data-cy=book-item]").should("have.length", 1)
  })


  it('should show the right tab', ()=>{
    mountDetailedSearch()

    cy.contains("Auteurs").click()
    cy.get("[data-cy=authors-list]").should("exist")
    cy.get("[data-cy=author-item]").should("have.length", 1)
    
    cy.contains("Thèmes").click()
    cy.get("[data-cy=subjects-list]").should("exist")
    cy.get("[data-cy=subject-item]").should("have.length", 1)
    
    cy.contains("Recherche avancée").click()
    cy.get("[data-cy=deepSearchTitle]").should("be.visible")

    cy.contains("Livres").click()
    cy.get("[data-cy=books-list]").should("exist")
    cy.get("[data-cy=book-item]").should("have.length", 1)
    
  })
  
  it('should reload the page with a detailed query', ()=>{
    mountDetailedSearch()
    
    cy.contains("Recherche avancée").click()
    
    cy.get("#inputTitre").type("Test")
    cy.get("#inputAuthor").type("Test test")
    cy.get("#inputPlace").type("Place Test")
    
    cy.get("[data-cy=submitDeepSearch]").click()

    cy.get("@pushState").should((spy)=>{
      const lastCall = spy.getCalls().pop()
      expect(lastCall.args[2]).to.eq(
        "/detailed-search/title:Test+author:Test test+place:Place Test+"
      )
    })

  })
})