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

describe('Card e2e test', () => {
  const cardPageUrl = '/card';
  const cardPageUrlPattern = new RegExp('/card(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const cardSample = { number: 75788, name: 'sexy Cambridgeshire', expiration: '2022-11-08', code: 53314, dni: 82523 };

  let card;
  let company;
  let users;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/companies',
      body: { name: 'Avon Account extranet' },
    }).then(({ body }) => {
      company = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: { name: 'Baleares back-end microchip', email: 'Pablo73@hotmail.com', password: 'payment', birth: '2022-11-08' },
    }).then(({ body }) => {
      users = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/cards+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/cards').as('postEntityRequest');
    cy.intercept('DELETE', '/api/cards/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/companies', {
      statusCode: 200,
      body: [company],
    });

    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [users],
    });
  });

  afterEach(() => {
    if (card) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/cards/${card.id}`,
      }).then(() => {
        card = undefined;
      });
    }
  });

  afterEach(() => {
    if (company) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/companies/${company.id}`,
      }).then(() => {
        company = undefined;
      });
    }
    if (users) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${users.id}`,
      }).then(() => {
        users = undefined;
      });
    }
  });

  it('Cards menu should load Cards page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('card');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Card').should('exist');
    cy.url().should('match', cardPageUrlPattern);
  });

  describe('Card page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(cardPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Card page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/card/new$'));
        cy.getEntityCreateUpdateHeading('Card');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cardPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/cards',
          body: {
            ...cardSample,
            company: company,
            users: users,
          },
        }).then(({ body }) => {
          card = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/cards+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [card],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(cardPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Card page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('card');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cardPageUrlPattern);
      });

      it('edit button click should load edit Card page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Card');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cardPageUrlPattern);
      });

      it('edit button click should load edit Card page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Card');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cardPageUrlPattern);
      });

      it('last delete button click should delete instance of Card', () => {
        cy.intercept('GET', '/api/cards/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('card').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cardPageUrlPattern);

        card = undefined;
      });
    });
  });

  describe('new Card page', () => {
    beforeEach(() => {
      cy.visit(`${cardPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Card');
    });

    it('should create an instance of Card', () => {
      cy.get(`[data-cy="number"]`).type('92776').should('have.value', '92776');

      cy.get(`[data-cy="name"]`).type('Humano reinvent').should('have.value', 'Humano reinvent');

      cy.get(`[data-cy="expiration"]`).type('2022-11-07').blur().should('have.value', '2022-11-07');

      cy.get(`[data-cy="code"]`).type('56343').should('have.value', '56343');

      cy.get(`[data-cy="dni"]`).type('19053').should('have.value', '19053');

      cy.get(`[data-cy="company"]`).select(1);
      cy.get(`[data-cy="users"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        card = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', cardPageUrlPattern);
    });
  });
});
