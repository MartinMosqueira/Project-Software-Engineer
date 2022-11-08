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

describe('Orders e2e test', () => {
  const ordersPageUrl = '/orders';
  const ordersPageUrlPattern = new RegExp('/orders(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const ordersSample = {"date":"2022-11-07","time":"2022-11-08","total":6990};

  let orders;
  // let payment;
  // let users;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/payments',
      body: {"name":"Mascotas Guapa Pizza"},
    }).then(({ body }) => {
      payment = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"name":"quantifying hard","email":"Gonzalo_Pia@hotmail.com","password":"Puerta Ladrillo","birth":"2022-11-08"},
    }).then(({ body }) => {
      users = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/orders+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/orders').as('postEntityRequest');
    cy.intercept('DELETE', '/api/orders/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/payments', {
      statusCode: 200,
      body: [payment],
    });

    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [users],
    });

    cy.intercept('GET', '/api/cards', {
      statusCode: 200,
      body: [],
    });

  });
   */

  afterEach(() => {
    if (orders) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/orders/${orders.id}`,
      }).then(() => {
        orders = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (payment) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/payments/${payment.id}`,
      }).then(() => {
        payment = undefined;
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
   */

  it('Orders menu should load Orders page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('orders');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Orders').should('exist');
    cy.url().should('match', ordersPageUrlPattern);
  });

  describe('Orders page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ordersPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Orders page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/orders/new$'));
        cy.getEntityCreateUpdateHeading('Orders');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ordersPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/orders',
          body: {
            ...ordersSample,
            payment: payment,
            users: users,
          },
        }).then(({ body }) => {
          orders = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/orders+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [orders],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(ordersPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(ordersPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Orders page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('orders');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ordersPageUrlPattern);
      });

      it('edit button click should load edit Orders page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Orders');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ordersPageUrlPattern);
      });

      it('edit button click should load edit Orders page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Orders');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ordersPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Orders', () => {
        cy.intercept('GET', '/api/orders/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('orders').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', ordersPageUrlPattern);

        orders = undefined;
      });
    });
  });

  describe('new Orders page', () => {
    beforeEach(() => {
      cy.visit(`${ordersPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Orders');
    });

    it.skip('should create an instance of Orders', () => {
      cy.get(`[data-cy="date"]`).type('2022-11-07').blur().should('have.value', '2022-11-07');

      cy.get(`[data-cy="time"]`).type('2022-11-07').blur().should('have.value', '2022-11-07');

      cy.get(`[data-cy="total"]`).type('15219').should('have.value', '15219');

      cy.get(`[data-cy="payment"]`).select(1);
      cy.get(`[data-cy="users"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        orders = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', ordersPageUrlPattern);
    });
  });
});
