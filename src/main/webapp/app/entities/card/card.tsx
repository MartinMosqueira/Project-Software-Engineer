import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ICard } from 'app/shared/model/card.model';
import { getEntities } from './card.reducer';

export const Card = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const cardList = useAppSelector(state => state.card.entities);
  const loading = useAppSelector(state => state.card.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="card-heading" data-cy="CardHeading">
        <Translate contentKey="shoppingCartApp.card.home.title">Cards</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="shoppingCartApp.card.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/card/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="shoppingCartApp.card.home.createLabel">Create new Card</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {cardList && cardList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="shoppingCartApp.card.id">Id</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.card.number">Number</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.card.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.card.expiration">Expiration</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.card.code">Code</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.card.dni">Dni</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.card.company">Company</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.card.users">Users</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cardList.map((card, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/card/${card.id}`} color="link" size="sm">
                      {card.id}
                    </Button>
                  </td>
                  <td>{card.number}</td>
                  <td>{card.name}</td>
                  <td>{card.expiration ? <TextFormat type="date" value={card.expiration} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>{card.code}</td>
                  <td>{card.dni}</td>
                  <td>{card.company ? <Link to={`/company/${card.company.id}`}>{card.company.id}</Link> : ''}</td>
                  <td>{card.users ? <Link to={`/users/${card.users.id}`}>{card.users.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/card/${card.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/card/${card.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/card/${card.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
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
              <Translate contentKey="shoppingCartApp.card.home.notFound">No Cards found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Card;
