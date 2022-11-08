import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IOrders } from 'app/shared/model/orders.model';
import { getEntities } from './orders.reducer';

export const Orders = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const ordersList = useAppSelector(state => state.orders.entities);
  const loading = useAppSelector(state => state.orders.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="orders-heading" data-cy="OrdersHeading">
        <Translate contentKey="shoppingCartApp.orders.home.title">Orders</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="shoppingCartApp.orders.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/orders/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="shoppingCartApp.orders.home.createLabel">Create new Orders</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {ordersList && ordersList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="shoppingCartApp.orders.id">Id</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.orders.date">Date</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.orders.time">Time</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.orders.total">Total</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.orders.payment">Payment</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.orders.users">Users</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.orders.card">Card</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ordersList.map((orders, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/orders/${orders.id}`} color="link" size="sm">
                      {orders.id}
                    </Button>
                  </td>
                  <td>{orders.date ? <TextFormat type="date" value={orders.date} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>{orders.time ? <TextFormat type="date" value={orders.time} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>{orders.total}</td>
                  <td>{orders.payment ? <Link to={`/payment/${orders.payment.id}`}>{orders.payment.id}</Link> : ''}</td>
                  <td>{orders.users ? <Link to={`/users/${orders.users.id}`}>{orders.users.id}</Link> : ''}</td>
                  <td>{orders.card ? <Link to={`/card/${orders.card.id}`}>{orders.card.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/orders/${orders.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/orders/${orders.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/orders/${orders.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
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
              <Translate contentKey="shoppingCartApp.orders.home.notFound">No Orders found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Orders;
