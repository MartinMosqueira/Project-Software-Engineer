import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './orders.reducer';

export const OrdersDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const ordersEntity = useAppSelector(state => state.orders.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="ordersDetailsHeading">
          <Translate contentKey="shoppingCartApp.orders.detail.title">Orders</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="shoppingCartApp.orders.id">Id</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.id}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="shoppingCartApp.orders.date">Date</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.date ? <TextFormat value={ordersEntity.date} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="time">
              <Translate contentKey="shoppingCartApp.orders.time">Time</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.time ? <TextFormat value={ordersEntity.time} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="total">
              <Translate contentKey="shoppingCartApp.orders.total">Total</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.total}</dd>
          <dt>
            <Translate contentKey="shoppingCartApp.orders.payment">Payment</Translate>
          </dt>
          <dd>{ordersEntity.payment ? ordersEntity.payment.id : ''}</dd>
          <dt>
            <Translate contentKey="shoppingCartApp.orders.users">Users</Translate>
          </dt>
          <dd>{ordersEntity.users ? ordersEntity.users.id : ''}</dd>
          <dt>
            <Translate contentKey="shoppingCartApp.orders.card">Card</Translate>
          </dt>
          <dd>{ordersEntity.card ? ordersEntity.card.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/orders" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/orders/${ordersEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default OrdersDetail;
