import payment from 'app/entities/payment/payment.reducer';
import orders from 'app/entities/orders/orders.reducer';
import orderDetails from 'app/entities/order-details/order-details.reducer';
import users from 'app/entities/users/users.reducer';
import menu from 'app/entities/menu/menu.reducer';
import card from 'app/entities/card/card.reducer';
import company from 'app/entities/company/company.reducer';
import cart from 'app/entities/cart/cart.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  payment,
  orders,
  orderDetails,
  users,
  menu,
  card,
  company,
  cart,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
