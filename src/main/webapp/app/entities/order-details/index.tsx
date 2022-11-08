import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import OrderDetails from './order-details';
import OrderDetailsDetail from './order-details-detail';
import OrderDetailsUpdate from './order-details-update';
import OrderDetailsDeleteDialog from './order-details-delete-dialog';

const OrderDetailsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<OrderDetails />} />
    <Route path="new" element={<OrderDetailsUpdate />} />
    <Route path=":id">
      <Route index element={<OrderDetailsDetail />} />
      <Route path="edit" element={<OrderDetailsUpdate />} />
      <Route path="delete" element={<OrderDetailsDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default OrderDetailsRoutes;
