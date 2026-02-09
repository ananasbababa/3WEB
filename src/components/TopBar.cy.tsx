import axios from 'axios'
import { BrowserRouter } from 'react-router'
import TopBar from './TopBar'

describe('<TopBar />', () => {
  
  const mountTopBar = () => {
    const setBook = cy.stub()
    const setLoading = cy.stub()
    const setArrowsVisibles = cy.stub()
    const setError = cy.stub()

    cy.mount(
      <BrowserRouter>
        <TopBar setError = {setError} setBook={setBook} setLoading={setLoading} setArrowsVisibles={setArrowsVisibles}/>
      </BrowserRouter>
    )
    return {setBook, setLoading, setArrowsVisibles, setError}
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

  it("render test", () => {
    mountTopBar()
    cy.get(".searchInput").should("be.visible")
    cy.get("button[type='submit']").should("contain", "Search")
  })

  it("appel API quand on tape dans la search bar", ()=>{
    mountTopBar()

    cy.get(".searchInput")
    .type("Pride and Prejudice")

    cy.wrap(axios.get).should("have.been.calledOnce")
    cy.wrap(axios.get).should("have.been.calledWithMatch", "/openlibrary/search.json?q='Pride and Prejudice'&fields=title,key,author_key,author_name,edition_key,links,cover_i&limit=50&page=1")
  })


  it("affiche les résultats dans la liste quickSearch", ()=>{
    mountTopBar()

    cy.get(".searchInput").type("Test")
    cy.wrap(axios.get).should("have.been.calledOnce")
    
    cy.get(".quickSearch").should("have.class", "show")

    cy.contains("Work Title Test").should("exist")
    cy.contains("Test test").should("exist")

  })


  it("should redirect to the BookDetails page", ()=>{
    mountTopBar()

    cy.get(".searchInput").type("Test")
    cy.get(".ecriture").click()

    cy.location("pathname").should("eq", "/book-details")
  })

  it("should redirect to the DetailedSearch page", ()=>{
    mountTopBar()

    cy.get(".searchInput").type("Test")
    cy.get("button[type=submit]").click()

    cy.location("pathname").should("eq", "/detailed-search/Test")
  })

  it("should hide the quick result ul", ()=>{
    mountTopBar()

    cy.get(".searchInput").type("Test")
    cy.get(".topBar").click()

    cy.get(".quickSearch").should("have.class", "invisible")

    cy.get(".searchInput").type("Tests")
    cy.get("button[type=submit]").click()

    cy.get(".quickSearch").should("have.class", "invisible")
  })
})