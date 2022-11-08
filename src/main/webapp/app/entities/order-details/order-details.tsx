import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IOrderDetails } from 'app/shared/model/order-details.model';
import { getEntities } from './order-details.reducer';

export const OrderDetails = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const orderDetailsList = useAppSelector(state => state.orderDetails.entities);
  const loading = useAppSelector(state => state.orderDetails.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="order-details-heading" data-cy="OrderDetailsHeading">
        <Translate contentKey="shoppingCartApp.orderDetails.home.title">Order Details</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="shoppingCartApp.orderDetails.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/order-details/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="shoppingCartApp.orderDetails.home.createLabel">Create new Order Details</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {orderDetailsList && orderDetailsList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="shoppingCartApp.orderDetails.id">Id</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.orderDetails.quantity">Quantity</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.orderDetails.price">Price</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.orderDetails.orders">Orders</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.orderDetails.menu">Menu</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orderDetailsList.map((orderDetails, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/order-details/${orderDetails.id}`} color="link" size="sm">
                      {orderDetails.id}
                    </Button>
                  </td>
                  <td>{orderDetails.quantity}</td>
                  <td>{orderDetails.price}</td>
                  <td>{orderDetails.orders ? <Link to={`/orders/${orderDetails.orders.id}`}>{orderDetails.orders.id}</Link> : ''}</td>
                  <td>{orderDetails.menu ? <Link to={`/menu/${orderDetails.menu.id}`}>{orderDetails.menu.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/order-details/${orderDetails.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/order-details/${orderDetails.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/order-details/${orderDetails.id}/delete`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="shoppingCartApp.orderDetails.home.notFound">No Order Details found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
