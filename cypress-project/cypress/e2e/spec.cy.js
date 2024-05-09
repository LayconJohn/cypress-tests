import assert from "assert"

class RegisterForm {
  elements = {
    titleInput: () => cy.get("#title"),
    titleFeedback: () => cy.get("#titleFeedback"),
    imageUrlInput: () => cy.get("#imageUrl"),
    urlFeedback: () => cy.get("#urlFeedback"),
    submitBtn: () => cy.get('#btnSubmit'),
    imagesConteiner: () => cy.get("#card-list")
  }

  typeTitle(title) {
    if(!title) {
      return
    }
    this.elements.titleInput().type(title)
  }

  typeUrl(url) {
    if (!url) return 
    this.elements.imageUrlInput().type(url)
  }

  clickSubmit() {
    this.elements.submitBtn().click()
  }

  clickEnter() {
    cy.focused().type('{enter}')
  }
}

const registerForm = new RegisterForm()

const colors = {
  error: "rgb(220, 53, 69)",
  sucess: "rgb(25, 135, 84)"
}

const baseUrl = "https://erickwendel.github.io" 

const localStorage = {
  imageRegistration: "tdd-ew-db"
}

describe('Image Registration', () => {

  describe('Submitting an image with invalid inputs', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })

    const input = {
      title: "",
      url: "",
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it(`When I enter ${input.title} in the title field`, () => {
      registerForm.typeTitle(input.title)
    })

    it(`Then I enter ${input.url} in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })

    it(`Then I click the submit button`, () => {
      registerForm.clickSubmit()
    })

    it(`Then I should see "Please type a title for the image" message above the title field`, () => {
      registerForm.elements.titleFeedback().should('contains.text', 'Please type a title for the image')
    })

    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      registerForm.elements.urlFeedback().should('contains.text', "Please type a valid URL")
    })

    it(`And I should see an exclamation icon in the title and URL fields`, () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border =styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.error)
      })
    })

    
  })

  describe('Submitting an image with valid inputs using enter key', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })

    const input = {
      title: "Alien BR",
      url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it("When I enter 'Alien BR' in the title field", () => {
      registerForm.typeTitle(`${input.title}{enter}`)
    })

    it("When I enter 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg' in the URL field", () => {
      registerForm.typeUrl(input.url)
    })

    it("Then I should see a check icon in the title field", () => {
      registerForm.elements.titleInput().should(([value]) => {
        const styles = window.getComputedStyle(value)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.sucess)
      })
    })

    it("Then I should see a check icon in the imageUrl field", () => {
      registerForm.elements.imageUrlInput().should(([value]) => {
        const styles = window.getComputedStyle(value)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.sucess)
      })
    })

    it("Then I can hit enter to submit the form", () => {
      registerForm.clickEnter()
      cy.wait(1000)
    })

    it("And the list of registered images should be updated with the new item", () => {
      registerForm.elements.imagesConteiner().children().should("have.length", 4)
    })

    it("And the new item should be stored in the localStorage", () => {
      cy.getAllLocalStorage().then((result) => {
        const localStorageImageRegistrationValue = result[baseUrl][localStorage.imageRegistration]
        
        const expectedValue = `[{"title":"Alien BR","imageUrl":"https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg"}]`
        assert.strictEqual(localStorageImageRegistrationValue, expectedValue)


      })
    })

    it("Then The inputs should be cleared", () => {
      registerForm.elements.titleInput().should("be.empty")
      registerForm.elements.imageUrlInput().should("be.empty")
    })
  })
})

