import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Payment from './payment';
import Orders from './orders';
import OrderDetails from './order-details';
import Users from './users';
import Menu from './menu';
import Card from './card';
import Company from './company';
import Cart from './cart';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="payment/*" element={<Payment />} />
        <Route path="orders/*" element={<Orders />} />
        <Route path="order-details/*" element={<OrderDetails />} />
        <Route path="users/*" element={<Users />} />
        <Route path="menu/*" element={<Menu />} />
        <Route path="card/*" element={<Card />} />
        <Route path="company/*" element={<Company />} />
        <Route path="cart/*" element={<Cart />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
