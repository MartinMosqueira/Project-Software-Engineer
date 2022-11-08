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

describe('Menu e2e test', () => {
  const menuPageUrl = '/menu';
  const menuPageUrlPattern = new RegExp('/menu(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const menuSample = { name: 'invoice synergize', description: 'array', price: 55758, image: 'Convertible Coche' };

  let menu;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/menus+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/menus').as('postEntityRequest');
    cy.intercept('DELETE', '/api/menus/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (menu) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/menus/${menu.id}`,
      }).then(() => {
        menu = undefined;
      });
    }
  });

  it('Menus menu should load Menus page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('menu');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Menu').should('exist');
    cy.url().should('match', menuPageUrlPattern);
  });

  describe('Menu page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(menuPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Menu page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/menu/new$'));
        cy.getEntityCreateUpdateHeading('Menu');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', menuPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/menus',
          body: menuSample,
        }).then(({ body }) => {
          menu = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/menus+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [menu],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(menuPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Menu page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('menu');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', menuPageUrlPattern);
      });

      it('edit button click should load edit Menu page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Menu');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', menuPageUrlPattern);
      });

      it('edit button click should load edit Menu page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Menu');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', menuPageUrlPattern);
      });

      it('last delete button click should delete instance of Menu', () => {
        cy.intercept('GET', '/api/menus/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('menu').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', menuPageUrlPattern);

        menu = undefined;
      });
    });
  });

  describe('new Menu page', () => {
    beforeEach(() => {
      cy.visit(`${menuPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Menu');
    });

    it('should create an instance of Menu', () => {
      cy.get(`[data-cy="name"]`).type('transmitter JBOD').should('have.value', 'transmitter JBOD');

      cy.get(`[data-cy="description"]`).type('Central').should('have.value', 'Central');

      cy.get(`[data-cy="price"]`).type('5963').should('have.value', '5963');

      cy.get(`[data-cy="image"]`).type('Hogar').should('have.value', 'Hogar');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        menu = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', menuPageUrlPattern);
    });
  });
});
