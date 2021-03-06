import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import Button from '../util/Button';
import MealDetail from './MealDetail';
import { deleteMeal, deleteCatererMeal } from '../../actions/mealActions';
import '../../static/hover_overlay.scss';

export class Meal extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleOpenModal() {
    this.setState({ isOpen: true });
  }

  handleCloseModal() {
    this.setState({ isOpen: false });
  }

  handleRemoveMeal() {
    if (this.props.userRole === 'superAdmin') {
      this.props.removeMeal(this.props.meal.id);
    } else {
      this.props.removeCatererMeal(this.props.meal.id);
    }
  }

  async handleDelete() {
    try {
      const willDelete = await swal({
        text: 'Are you sure you want to delete meal?',
        buttons: true,
        icon: 'warning',
        dangerMode: true,
      });
      if (willDelete) {
        this.handleRemoveMeal();
      }
    } catch (error) {
      if (error) {
        swal('Oh noes!', 'The request failed!', 'error');
      } else {
        swal.stopLoading();
        swal.close();
      }
    }
  }

  handleUpdate() {
    if (this.props.userRole === 'superAdmin') {
      return swal({
        text: 'You cannot update a caterer meal',
        icon: 'info',
        className: 'swal-button--confirm',
      });
    }

    return this.props.handleMealUpdate(this.props.meal);
  }

  render() {
    const { isDeleting, isUpdating } = this.props;

    const btnStyle = {
      flex: '50%',
      border: 'none',
      margin: '.5rem',
      padding: '.5rem',
      cursor: 'pointer',
      borderRadius: '3px',
      background: '#e9ebeb',
    };

    const modalStyle = {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
      },
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '20rem',
        width: '70%',
      },
    };

    return (
      <div
        className="card user-menu-item"
        data-test={`meal-${this.props.meal.id}`}
      >
        <div
          className="overlay-container"
          onClick={this.handleOpenModal}
          onKeyPress={this.handleOpenModal}
          role="button"
          tabIndex="0"
        >
          <img
            src={this.props.meal.imageUrl}
            alt={this.props.meal.name}
          />
          <div className="overlay">
            <div className="text">
              <p>View description</p>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.isOpen}
          contentLabel="Meal Detail"
          style={modalStyle}
        >
          <Button
            value="&times;"
            onClick={this.handleCloseModal}
            className="close"
          />
          <MealDetail
            closeMealDetail={this.handleCloseModal}
            meal={this.props.meal}
          />
        </Modal>
        <div
          className="font-weight-bold text-black text-center"
          style={{ padding: '.875rem' }}
        >
          <p>{this.props.meal.name}</p>
          <p style={{ fontSize: '1.25rem' }}>
            &#x20a6;{this.props.meal.price}
          </p>
        </div>
        <div style={{ display: 'flex', width: '75%', margin: '.5rem auto' }}>
          <button
            value="Edit"
            disabled={isUpdating}
            onClick={this.handleUpdate}
            style={{ ...btnStyle, color: '#28a745' }}
            title="Edit Meal"
          >
            Edit
          </button>
          <button
            value="Delete"
            disabled={isDeleting}
            onClick={this.handleDelete}
            style={{ ...btnStyle, color: '#dc3545' }}
            title="Delete Meal"
            resource="meal"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

Meal.propTypes = {
  meal: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ])).isRequired,
  isDeleting: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  handleMealUpdate: PropTypes.func.isRequired,
  removeMeal: PropTypes.func.isRequired,
  removeCatererMeal: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  isDeleting: state.meals.isDeleting,
  isUpdating: state.meals.isUpdating,
  userRole: state.user.data.role,
});

export default connect(mapStateToProps, {
  removeMeal: deleteMeal,
  removeCatererMeal: deleteCatererMeal,
})(Meal);
