import Header from '../../src/components/Header.jsx';

describe('Header component', () => {
  beforeEach(() => {
    cy.mount(<Header />);
  });

  it('renders the logo image with correct alt text and src', () => {
    cy.get('img[alt="School Logo"]').should('be.visible').and(($img) => {
      expect($img).to.have.attr('src').match(/logo\.png$/);
    });
  });

});