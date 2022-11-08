import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './order-details.reducer';

export const OrderDetailsDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const orderDetailsEntity = useAppSelector(state => state.orderDetails.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="orderDetailsDetailsHeading">
          <Translate contentKey="shoppingCartApp.orderDetails.detail.title">OrderDetails</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="shoppingCartApp.orderDetails.id">Id</Translate>
            </span>
          </dt>
          <dd>{orderDetailsEntity.id}</dd>
          <dt>
            <span id="quantity">
              <Translate contentKey="shoppingCartApp.orderDetails.quantity">Quantity</Translate>
            </span>
          </dt>
          <dd>{orderDetailsEntity.quantity}</dd>
          <dt>
            <span id="price">
              <Translate contentKey="shoppingCartApp.orderDetails.price">Price</Translate>
            </span>
          </dt>
          <dd>{orderDetailsEntity.price}</dd>
          <dt>
            <Translate contentKey="shoppingCartApp.orderDetails.orders">Orders</Translate>
          </dt>
          <dd>{orderDetailsEntity.orders ? orderDetailsEntity.orders.id : ''}</dd>
          <dt>
            <Translate contentKey="shoppingCartApp.orderDetails.menu">Menu</Translate>
          </dt>
          <dd>{orderDetailsEntity.menu ? orderDetailsEntity.menu.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/order-details" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/order-details/${orderDetailsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default OrderDetailsDetail;
