import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Form, Field } from 'formik';
import { ProgressBar } from 'react-materialize';
import Label from '../util/Label';
import Button from '../util/Button';
import Loading from '../util/Loading';

const SignInForm = (props) => {
  const {
    errors,
    touched,
    isSubmitting,
  } = props;

  return (
    <Form className="form card">
      <h5 className="text-center">Sign In</h5>
      <p className="text-center font-weight-bold">
        Sign in to book a meal now
      </p>
      <div>
        <Label className="label label-block" htmlFor="email">
          Email address:
        </Label>
        <Field
          type="email"
          placeholder="johndoe@domain.com"
          id="email"
          name="email"
          required
          className={touched.email
          && errors.email ? 'input-error' : ''}
        />
        {
          touched.email
          && errors.email
          && <div className="error">{errors.email}</div>
        }
      </div>
      <div>
        <Label className="label label-block" htmlFor="password">
          Password:
        </Label>
        <Field
          type="password"
          placeholder="Enter password"
          id="password"
          name="password"
          required
          className={touched.password
          && errors.password ? 'input-error' : ''}
        />
        {
          touched.password
          && errors.password
          && <div className="error">{errors.password}</div>
        }
      </div>
      <Button
        value="Sign In"
        type="submit"
        className="btn btn-default btn-default-lg font-weight-bold"
        disabled={isSubmitting}
      />
      {isSubmitting ?
        <Loading text="signing in">
          <ProgressBar />
        </Loading>
        : null}
      {!isSubmitting && errors.signIn ?
        <div className="error">{errors.signIn}</div>
        : null
      }
      <p className="form-footer text-right">
        Don&apos;t have an account?
        {' '}
        <span>
          <button className="btn btn-alt">
            <NavLink to="/signup">Sign Up</NavLink>
          </button>
        </span>
      </p>
    </Form>
  );
};

SignInForm.propTypes = {
  errors: PropTypes.objectOf(PropTypes.string).isRequired,
  touched: PropTypes.objectOf(PropTypes.bool).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default SignInForm;
