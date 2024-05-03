class RegisterForm {
  elements = {
    titleInput: () => cy.get("#title"),
    titleFeedback: () => cy.get("#titleFeedback"),
    imageUrlInput: () => cy.get("#imageUrl"),
    urlFeedback: () => cy.get("#urlFeedback"),
    submitBtn: () => cy.get('#btnSubmit')
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
}

const registerForm = new RegisterForm()

describe('Image Registration', () => {

  describe('Submitting an image with invalid inputs', () => {

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

    it(`And I should see "Please type a valid URL" message above the imageUrl field`)

    it(`And I should see an exclamation icon in the title and URL fields`)

    
  })
})