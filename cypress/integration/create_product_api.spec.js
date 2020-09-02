/// <reference types="cypress" />

describe('Testing Add to cart functionality', () => {

  const homePageUrl = 'http://34.205.174.166';
  const productsCreationUrl = homePageUrl + '/wp-json/wc/v3/products';

  const productName = 'santiagoCardona'
  const productPrice = '500000'
  const priceFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  const productDisplayedPrice = priceFormat.format(productPrice)
  const productQuantity = 7

  const productPageUrl = homePageUrl + '/product/' + productName

  let productID

  before('Create product with name' + productName, () => {
    cy.request({
      method: 'POST',
      url: productsCreationUrl,
      auth: {
        username: 'shopmanager',
        pass: 'axY2 rimc SzO9 cobf AZBw NLnX'
      },
      body: {
        name: productName,
        regular_price: productPrice,
        description: 'A very valuable QA guy that wil make the best on whatever he does'
      }
    }).then((response) => {
      productID = response.body.id
      expect(response.body).to.have.property('name', productName)
      expect(response.status).to.equal(201)

    })
  });

  after('Delete created product', () => {
    cy.request({
      method: 'DELETE',
      url: productsCreationUrl + '/' + productID,
      auth: {
        username: 'shopmanager',
        pass: 'axY2 rimc SzO9 cobf AZBw NLnX'
      }
    })
      .then((response) => {
        expect(response.body).to.have.property('name', productName)
        expect(response.status).to.equal(200)
      })
  });

  it("Product is displayed with correct name and price", () => {

    cy.visit(productPageUrl, {
      auth: {
        username: 'shopmanager',
        pass: 'axY2 rimc SzO9 cobf AZBw NLnX'
      }
    })

    cy.get('.product_title')
      .should('have.text', productName)

    cy.get('.summary > .price ')
      .should('include.text', productDisplayedPrice)
  });

  it('Product quantity can be increased', () => {

    cy.get('.quantity > .input-text')
      .clear()
      .type(productQuantity)

    cy.get('.quantity > .input-text')
      .should('have.value', productQuantity)

  });

  it('Product can be added to cart', () => {

    cy.get('.single_add_to_cart_button')
      .click()
    cy.get('.cart-contents > .count')
      .should('include.text', '7 items')

    cy.get('.cart-contents')
      .click()

    cy.url().should('eq', homePageUrl + '/cart/')

    cy.get('.product-name > a')
      .should('have.text', productName)

    cy.get('.product-price')
      .should('include.text', productDisplayedPrice)

    cy.get('.quantity > .input-text')
      .should('have.value', productQuantity)

  });
})
