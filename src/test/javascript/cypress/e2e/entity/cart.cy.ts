import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Cart e2e test', () => {
  const cartPageUrl = '/cart';
  const cartPageUrlPattern = new RegExp('/cart(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const cartSample = { quantity: 68950 };

  let cart;
  let users;
  let menu;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: { name: 'Papelería Marroquinería', email: 'Csar_Guilln@gmail.com', password: 'Programa payment Personal', birth: '2022-11-07' },
    }).then(({ body }) => {
      users = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/menus',
      body: { name: 'virtual', description: 'Bacon', price: 13088, image: 'application Acero' },
    }).then(({ body }) => {
      menu = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/carts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/carts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/carts/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [users],
    });

    cy.intercept('GET', '/api/menus', {
      statusCode: 200,
      body: [menu],
    });
  });

  afterEach(() => {
    if (cart) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/carts/${cart.id}`,
      }).then(() => {
        cart = undefined;
      });
    }
  });

  afterEach(() => {
    if (users) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${users.id}`,
      }).then(() => {
        users = undefined;
      });
    }
    if (menu) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/menus/${menu.id}`,
      }).then(() => {
        menu = undefined;
      });
    }
  });

  it('Carts menu should load Carts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('cart');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Cart').should('exist');
    cy.url().should('match', cartPageUrlPattern);
  });

  describe('Cart page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(cartPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Cart page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/cart/new$'));
        cy.getEntityCreateUpdateHeading('Cart');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cartPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/carts',
          body: {
            ...cartSample,
            users: users,
            menu: menu,
          },
        }).then(({ body }) => {
          cart = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/carts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [cart],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(cartPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Cart page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('cart');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cartPageUrlPattern);
      });

      it('edit button click should load edit Cart page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Cart');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cartPageUrlPattern);
      });

      it('edit button click should load edit Cart page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Cart');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cartPageUrlPattern);
      });

      it('last delete button click should delete instance of Cart', () => {
        cy.intercept('GET', '/api/carts/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('cart').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cartPageUrlPattern);

        cart = undefined;
      });
    });
  });

  describe('new Cart page', () => {
    beforeEach(() => {
      cy.visit(`${cartPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Cart');
    });

    it('should create an instance of Cart', () => {
      cy.get(`[data-cy="quantity"]`).type('40131').should('have.value', '40131');

      cy.get(`[data-cy="users"]`).select(1);
      cy.get(`[data-cy="menu"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        cart = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', cartPageUrlPattern);
    });
  });
});
