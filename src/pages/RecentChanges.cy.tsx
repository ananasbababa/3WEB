import axios from 'axios'
import { BrowserRouter } from 'react-router'
import RecentChanges from './RecentChanges'

describe('<RecentChanges />', () => {
  
  const mountRecentChanges = ()=>{
    const setLoading = cy.stub()
    const setBook = cy.stub()
    const setError = cy.stub()

    cy.mount(
      <BrowserRouter>
        <RecentChanges setError = {setError} setBook={setBook} setLoading={setLoading}/>
      </BrowserRouter>
    )

    return {setBook, setLoading, setError}
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
          },
          {
            key: "OLWORKTEST2",
            title: "Work Title Test 2",
            author_name: ["Test test 2"],
            author_key: ["OLAUTHORTEST1"],
            cover_i : "123456",
            edition_key : ["OLEDITIONTEST1"],
            wiki_lien:"https://fr.wikipedia.com/test"
          },
        ]
      }
    })
  })
  
  it("render test", () => {
    mountRecentChanges()

    cy.wrap(axios.get).should("have.been.calledTwice")

    cy.get(".recent").should("exist")
    cy.get(".trending").should("exist")
    cy.get(".carousel-item").should("have.length", 4)
  })

  it("carrousel navigation next or previous slide", ()=>{
    mountRecentChanges()

    cy.get(".carousel-item").eq(0).should("have.class", "active")
    cy.get(".carousel-item").eq(1).should("not.have.class", "active")
    
    cy.get("button[data-bs-slide=next]").eq(0).click()

    cy.get(".carousel-item").eq(0).should("not.have.class", "active")
    cy.get(".carousel-item").eq(1).should("have.class", "active")
    
    cy.get("button[data-bs-slide=prev]").eq(0).click()

    cy.get(".carousel-item").eq(0).should("have.class", "active")
    cy.get(".carousel-item").eq(1).should("not.have.class", "active")
    
  })

  it("navigation to the book details", ()=>{
    mountRecentChanges()

    cy.get(".carouselImgDiv").eq(0).click()

    cy.location("pathname").should("eq", "/book-details")
  })
})