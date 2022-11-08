import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUsers } from 'app/shared/model/users.model';
import { getEntities } from './users.reducer';

export const Users = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const usersList = useAppSelector(state => state.users.entities);
  const loading = useAppSelector(state => state.users.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="users-heading" data-cy="UsersHeading">
        <Translate contentKey="shoppingCartApp.users.home.title">Users</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="shoppingCartApp.users.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/users/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="shoppingCartApp.users.home.createLabel">Create new Users</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {usersList && usersList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="shoppingCartApp.users.id">Id</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.users.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.users.email">Email</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.users.password">Password</Translate>
                </th>
                <th>
                  <Translate contentKey="shoppingCartApp.users.birth">Birth</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {usersList.map((users, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/users/${users.id}`} color="link" size="sm">
                      {users.id}
                    </Button>
                  </td>
                  <td>{users.name}</td>
                  <td>{users.email}</td>
                  <td>{users.password}</td>
                  <td>{users.birth ? <TextFormat type="date" value={users.birth} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/users/${users.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/users/${users.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/users/${users.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
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
              <Translate contentKey="shoppingCartApp.users.home.notFound">No Users found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Users;
