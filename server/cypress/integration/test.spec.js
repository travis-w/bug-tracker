describe('My First Test', () => {
  it('Does not do much!', () => {
    cy.visit('/');
    cy.wait(1000);
    expect(true).to.equal(true)
  })
})