import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './card.reducer';

export const CardDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const cardEntity = useAppSelector(state => state.card.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="cardDetailsHeading">
          <Translate contentKey="shoppingCartApp.card.detail.title">Card</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="shoppingCartApp.card.id">Id</Translate>
            </span>
          </dt>
          <dd>{cardEntity.id}</dd>
          <dt>
            <span id="number">
              <Translate contentKey="shoppingCartApp.card.number">Number</Translate>
            </span>
          </dt>
          <dd>{cardEntity.number}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="shoppingCartApp.card.name">Name</Translate>
            </span>
          </dt>
          <dd>{cardEntity.name}</dd>
          <dt>
            <span id="expiration">
              <Translate contentKey="shoppingCartApp.card.expiration">Expiration</Translate>
            </span>
          </dt>
          <dd>{cardEntity.expiration ? <TextFormat value={cardEntity.expiration} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="shoppingCartApp.card.code">Code</Translate>
            </span>
          </dt>
          <dd>{cardEntity.code}</dd>
          <dt>
            <span id="dni">
              <Translate contentKey="shoppingCartApp.card.dni">Dni</Translate>
            </span>
          </dt>
          <dd>{cardEntity.dni}</dd>
          <dt>
            <Translate contentKey="shoppingCartApp.card.company">Company</Translate>
          </dt>
          <dd>{cardEntity.company ? cardEntity.company.id : ''}</dd>
          <dt>
            <Translate contentKey="shoppingCartApp.card.users">Users</Translate>
          </dt>
          <dd>{cardEntity.users ? cardEntity.users.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/card" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/card/${cardEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CardDetail;
