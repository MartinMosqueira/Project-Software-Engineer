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

describe('OrderDetails e2e test', () => {
  const orderDetailsPageUrl = '/order-details';
  const orderDetailsPageUrlPattern = new RegExp('/order-details(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const orderDetailsSample = {"quantity":35346,"price":88335};

  let orderDetails;
  // let orders;
  // let menu;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/orders',
      body: {"date":"2022-11-08","time":"2022-11-07","total":26200},
    }).then(({ body }) => {
      orders = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/menus',
      body: {"name":"extranet Hormigon","description":"Rampa infrastructures","price":21436,"image":"Corporativo Account Marca"},
    }).then(({ body }) => {
      menu = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/order-details+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/order-details').as('postEntityRequest');
    cy.intercept('DELETE', '/api/order-details/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/orders', {
      statusCode: 200,
      body: [orders],
    });

    cy.intercept('GET', '/api/menus', {
      statusCode: 200,
      body: [menu],
    });

  });
   */

  afterEach(() => {
    if (orderDetails) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/order-details/${orderDetails.id}`,
      }).then(() => {
        orderDetails = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (orders) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/orders/${orders.id}`,
      }).then(() => {
        orders = undefined;
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
   */

  it('OrderDetails menu should load OrderDetails page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('order-details');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('OrderDetails').should('exist');
    cy.url().should('match', orderDetailsPageUrlPattern);
  });

  describe('OrderDetails page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(orderDetailsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create OrderDetails page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/order-details/new$'));
        cy.getEntityCreateUpdateHeading('OrderDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderDetailsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/order-details',
          body: {
            ...orderDetailsSample,
            orders: orders,
            menu: menu,
          },
        }).then(({ body }) => {
          orderDetails = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/order-details+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [orderDetails],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(orderDetailsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(orderDetailsPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details OrderDetails page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('orderDetails');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderDetailsPageUrlPattern);
      });

      it('edit button click should load edit OrderDetails page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OrderDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderDetailsPageUrlPattern);
      });

      it('edit button click should load edit OrderDetails page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OrderDetails');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderDetailsPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of OrderDetails', () => {
        cy.intercept('GET', '/api/order-details/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('orderDetails').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderDetailsPageUrlPattern);

        orderDetails = undefined;
      });
    });
  });

  describe('new OrderDetails page', () => {
    beforeEach(() => {
      cy.visit(`${orderDetailsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('OrderDetails');
    });

    it.skip('should create an instance of OrderDetails', () => {
      cy.get(`[data-cy="quantity"]`).type('24711').should('have.value', '24711');

      cy.get(`[data-cy="price"]`).type('94654').should('have.value', '94654');

      cy.get(`[data-cy="orders"]`).select(1);
      cy.get(`[data-cy="menu"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        orderDetails = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', orderDetailsPageUrlPattern);
    });
  });
});
