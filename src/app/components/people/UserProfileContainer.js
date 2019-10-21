import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change, Field, reduxForm } from 'redux-form';

import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import BasicField from '../common/BasicField';
import MaskedInput from '../common/MaskedInput';

class UserProfileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateProfileResult: '',
      userSelectedSpecialties: [],
      userSpecialties: '',
      titles: '',
      predefinedTitlesDisabled: '',
      otherTitleDescription: '',
      selectedTitles: '',
    };
  }

  componentDidMount() {
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'UserProfile',
    });
    userApi.getUserById().then(response => {
      if (response.specialties == null) {
        this.setState({ userSelectedSpecialties: [] });
      } else {
        this.setState({ userSelectedSpecialties: response.specialties });
        this.setState({ userSpecialties: response.specialtyList });
      }
      if (
        response.titles &&
        response.titles.length > 0 &&
        response.titles[0].titleId == 1
      ) {
        this.setState({ predefinedTitlesDisabled: true });
        this.setState({ otherTitleDescription: response.titleList });
      } else {
        this.setState({ selectedTitles: response.titleList });
      }
    });
    if (this.props.userProfile.profileThumbnailPictureHash) {
      userApi.getUserProfilePic(sessionStorage.userId, 'PROFILE');
    }
    userApi.getUserNotoficationPrefs();
    userApi.getAllSpecialties();
    userApi.getAllTitles();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.allSpecialties != this.props.allSpecialties &&
      nextProps.userSpecialties.length > 0
    ) {
      if (nextProps.userSpecialties[0].specialtyId == 1) {
        this.setState({ specialty: nextProps.userSpecialties[0] });
        this.setState({ otherSpecialty: nextProps.userSpecialties[0].name });
      } else {
        nextProps.allSpecialties.map(specialtyObject => {
          if (
            specialtyObject.specialtyId ===
            nextProps.userSpecialties[0].specialtyId
          ) {
            this.setState({ specialty: specialtyObject });
          }
        });
      }
    }
    let userSpecialties = [];
    if (nextProps.userSpecialties != this.props.userSpecialties) {
      // Note that React may call this method even if the props have not changed, so make sure to compare the current and next values if you only want to handle changes
      userSpecialties = nextProps.userSpecialties;
      this.setState({ userSelectedSpecialties: userSpecialties });
      const specialty = userSpecialties[0];
      let subspecialty = [];

      if (specialty && specialty.subSpecialties.length > 0) {
        subspecialty = specialty.subSpecialties[0];
      }
      this.setState({ subspecialty });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    enableFoundationForSingleComponent('#update-profile-photo');
  }

  handleImageChange = e => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      userApi
        .saveUserProfilePic(
          reader.result,
          sessionStorage.userId,
          'PROFILE',
          this.props.userProfile,
        )
        .then(response => {
          toggleAlert('Profile updated!', 'success');
        })
        .catch(error => {
          toggleAlert('Error updating profile', 'error');
        });
      $('#profileImageClose').trigger('click');
    };
    reader.readAsArrayBuffer(file);
  };

  getTitlesToPersist(formProps) {
    const titlesToStore = [];

    let { allTitles } = this.props;
    if (allTitles == undefined || allTitles == null) {
      allTitles = [];
    }

    if (this.state.predefinedTitlesDisabled) {
      const title = { titleId: 1, name: formProps.otherTitle };
      titlesToStore.push(title);
    } else {
      allTitles.map(title => {
        const checkBoxId = `TitleCB${title.titleId}`;
        if (formProps[checkBoxId]) {
          var title;
          if (checkBoxId.toString() != 'TitleCB1') {
            title = { titleId: title.titleId, name: title.name };
          }
          titlesToStore.push(title);
        }
      });
    }
    return titlesToStore;
  }

  onSubmit(formProps) {
    const userObj = {};
    let titles = [];
    const specialty = [];
    if (this.state.specialty) {
      if (this.state.subspecialty) {
        if (!Array.isArray(this.state.subspecialty)) {
          this.state.specialty.subSpecialties = [];
          this.state.specialty.subSpecialties.push(this.state.subspecialty);
        } else if (this.state.subspecialty.length > 0) {
          this.state.specialty.subSpecialties = [this.state.subspecialty];
        }
      } else {
        this.state.specialty.subSpecialties = [];
      }
      specialty.push(this.state.specialty);
    }

    userObj.firstName = formProps.firstName;
    userObj.lastName = formProps.lastName;
    if (formProps.accountPhoneNumber)
      userObj.accountPhoneNumber = formProps.accountPhoneNumber.replace(
        /-/g,
        '',
      );
    if (formProps.workPhoneNumber)
      userObj.workPhoneNumber = formProps.workPhoneNumber.replace(/-/g, '');
    if (formProps.faxNumber)
      userObj.faxNumber = formProps.faxNumber.replace(/-/g, '');
    if (formProps.homePhoneNumber)
      userObj.homePhoneNumber = formProps.homePhoneNumber.replace(/-/g, '');
    userObj.defaultSlimView = formProps.defaultSlimView;
    titles = this.getTitlesToPersist(formProps);
    userObj.titles = titles;
    userObj.specialties = specialty;

    userApi
      .updateUser(userObj)
      .then(res => {
        userApi
          .updateUserNotoficationPrefs(formProps.emailPref, formProps.pushPref)
          .then(res => {
            toggleAlert('Profile updated successfully!', 'success');
            this.setState({
              updateProfileResult: 'User Profile updated successfully!!!',
            });
            userApi.getUserById();
            userApi.getUserProfilePic(sessionStorage.userId, 'PROFILE');
            userApi.getUserNotoficationPrefs();
          });
      })
      .catch(error => {
        this.setState({ updateProfileResult: error.message });
      });
  }

  onClickRemovePicture() {
    userApi
      .deleteUserProfilePic()
      .then(res => {
        this.setState({
          updateProfileResult: 'User profile picture removed successfully!!',
        });
        userApi.getUserProfilePic(sessionStorage.userId, 'PROFILE');
      })
      .catch(error => {
        this.setState({ updateProfileResult: error.message });
      });
  }

  updateTitle = e => {
    if (e.target.title == 'Other') {
      if (e.target.value) {
        this.setState({ predefinedTitlesDisabled: false });

        var inputChecked = $('#title-input input:checked');
        var selectedTitles = [];
        for (var i = 0; i < inputChecked.length; i++) {
          var title = inputChecked[i].title;
          selectedTitles.push(title);
        }

        this.setState({ selectedTitles: selectedTitles.join(', ') });
      } else {
        this.setState({ predefinedTitlesDisabled: true });
        this.setState({ titles: this.state.otherTitleDescription });
      }
    } else {
      var inputChecked = $('#title-input input:checked');
      var selectedTitles = [];
      for (var i = 0; i < inputChecked.length; i++) {
        var title = inputChecked[i].title;
        selectedTitles.push(title);
      }
      this.setState({ selectedTitles: selectedTitles.join(', ') });
    }
  };

  setTitleDescriptionState(e) {
    this.setState({ otherTitleDescription: e.target.value });
    this.setState({ titles: e.target.value });
  }

  createTitleCheckboxes(allTitles) {
    return allTitles.map(title => {
      const checkBoxId = `TitleCB${title.titleId}`;
      if (title.titleId == 1) {
        return (
          <li key={title.titleId} id="title-other">
            <Field
              onChange={e => this.updateTitle(e)}
              name={checkBoxId}
              id={checkBoxId}
              title={title.name}
              component="input"
              type="checkbox"
            />
            <label htmlFor={checkBoxId}>Other</label>
            <Field
              onChange={e => this.setTitleDescriptionState(e)}
              name="otherTitle"
              type="text"
              component={BasicField}
              label="Other Title"
            />
          </li>
        );
      }
      return (
        <li key={title.titleId} id="title-input">
          <Field
            onChange={e => this.updateTitle(e)}
            disabled={this.state.predefinedTitlesDisabled}
            name={checkBoxId}
            id={checkBoxId}
            title={title.name}
            component="input"
            type="checkbox"
          />
          <label htmlFor={checkBoxId}>{title.name}</label>
        </li>
      );
    });
  }

  findObjectByKey(array, key, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
    return null;
  }

  removeObjectByKey(array, key, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }
    return array;
  }

  handleCheckboxClick = e => {
    e.stopPropagation();
  };

  openField = e => {
    if (e.target.name == 'specialties') {
      $('.specialty-open-link.accordion-title').trigger('click');
    }
    if (e.target.name == 'titles') {
      $('.title-open-link.accordion-title').trigger('click');
    }

    return false;
  };

  updateSpecialty = specialty => {
    // Reset subSpecialty when switching to another specialty
    if (specialty === 'Other') {
      this.setState({
        specialty: {
          specialtyId: 1,
          name: this.state.otherSpecialty,
          subSpecialties: [],
        },
      });
      if (
        this.state.subspecialty &&
        this.state.subspecialty.subSpecialtyId != 1
      ) {
        this.setState({ subspecialty: undefined });
      }
    } else {
      if (
        this.state.specialty != undefined &&
        this.state.specialty.specialtyId != specialty.specialtyId &&
        (this.state.subspecialty && this.state.subspecialty.subSpecialtyId != 1)
      ) {
        this.setState({ subspecialty: undefined });
      }
      this.setState({ specialty });
    }
    return false;
  };

  updateSubspecialty = subspecialty => {
    if (subspecialty == 'Other') {
      this.setState({
        subspecialty: {
          subSpecialtyId: 1,
          subSpecialtyName: this.state.otherSubspecialty,
        },
      });
    } else {
      this.setState({ subspecialty });
    }
    return false;
  };

  updateOtherInput = e => {
    if (e.target.name == 'otherSpecialty') {
      this.setState({
        specialty: { specialtyId: 1, name: e.target.value, subSpecialties: [] },
      });
    }
    if (e.target.name == 'otherSubspecialty') {
      this.setState({
        subspecialty: { subSpecialtyId: 1, subSpecialtyName: e.target.value },
      });
    }
  };

  render() {
    const normalizePhone = value => {
      if (!value) {
        return value;
      }
      return `${value.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(
        6,
        10,
      )}`;
    };

    const handleSubmit = this.props.handleSubmit; // injected by reduxform

    let { userProfilePic } = this.props;
    if (userProfilePic == undefined) {
      userProfilePic = 'assets/img/dock-logo-white.png';
    }

    let { userTitles } = this.props;
    if (userTitles == undefined || userTitles == null) {
      userTitles = [];
    }

    let { userSpecialties } = this.props;
    if (userSpecialties == undefined || userSpecialties == null) {
      userSpecialties = [];
    }

    let { allTitles } = this.props;
    if (allTitles == undefined || allTitles == null) {
      allTitles = [];
    }
    let { allSpecialties } = this.props;
    if (allSpecialties == undefined || allSpecialties == null) {
      allSpecialties = [];
    }
    return (
      <div className="wrapper">
        <div className="columns large-9 large-offset-1">
          <div className="row">
            {/* Profile Image */}
            <div className="columns large-12 text-center">
              <div className="update-photo" data-open="update-profile-photo">
                {this.props.userProfile &&
                this.props.userProfile.profileThumbnailPictureHash ? (
                  <img
                    className="member-photo circle xlarge"
                    src={`${
                      process.env.HEYDOC_SERVICES_BASE_URL
                    }user/profilePicture/${this.props.userProfile.userId}/${
                      this.props.userProfile.profilePictureHash
                    }`}
                    alt={`${this.props.userProfile.firstName} ${
                      this.props.userProfile.lastName
                    }`}
                  />
                ) : (
                  <span className="member-initials circle xlarge">
                    {this.props.userProfile.initials}
                  </span>
                )}
                <span className="update circle xlarge">Update picture</span>
                <h5 className="top-buffer">
                  {this.props.userProfile.userName}
                </h5>
              </div>
            </div>
            {/* Profile Image Modal */}
            <div
              className="reveal text-center"
              id="update-profile-photo"
              data-reveal=""
            >
              <h5 className="margin-bottom">Update profile photo</h5>
              <p onClick={this.onClickRemovePicture}>Remove photo</p>
              <p>
                <input
                  type="file"
                  hidden
                  name="file"
                  id="file"
                  className="inputfile"
                  onChange={e => this.handleImageChange(e)}
                />
                <label id="upload-photo-text" htmlFor="file">
                  Upload photo
                </label>
              </p>

              <button
                className="close-button"
                id="profileImageClose"
                data-close=""
                aria-label="Close modal"
                type="button"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form
              onSubmit={handleSubmit(this.onSubmit.bind(this))}
              className="inline-label top-buffer expand white-bg"
            >
              <div className="column large-12 top-buffer">
                <span className="item-title">General Information</span>
              </div>
              {/* <!-- First name --> */}
              <Field
                name="firstName"
                type="text"
                component={BasicField}
                label="First Name"
                bufferClassName="top-buffer-small"
              />

              {/* <!-- Last name --> */}
              <Field
                name="lastName"
                type="text"
                component={BasicField}
                label="Last Name"
              />

              {/* <!-- Title --> */}
              <div className="column large-12 input-group no-icon input-dropdown">
                <div className="form-floating-label input-wrapper has-value">
                  <input
                    className="input-group-field"
                    type="text"
                    data-toggle="add-titles"
                    value={
                      this.state.predefinedTitlesDisabled
                        ? this.state.otherTitleDescription
                        : this.state.selectedTitles
                    }
                  />
                  <label>Title</label>
                </div>
                <div
                  className="dropdown-pane"
                  id="add-titles"
                  data-dropdown
                  data-close-on-click="true"
                >
                  <fieldset className="large-12 columns">
                    <ul className="no-bullet columns-2" id="title-checkboxes">
                      {this.createTitleCheckboxes(allTitles)}
                    </ul>
                  </fieldset>
                </div>
              </div>

              {/* <!-- SPECIALTY --> */}
              <div className="column large-12 input-group no-icon input-dropdown">
                <div
                  className={`form-floating-label input-wrapper ${
                    this.state.specialty ? 'has-value' : ''
                  }`}
                >
                  <input
                    className="input-group-field"
                    type="text"
                    data-toggle="specialty"
                    value={this.state.specialty && this.state.specialty.name}
                  />
                  <label>Specialty</label>
                </div>

                <div
                  className="dropdown-pane"
                  id="specialty"
                  data-dropdown
                  data-close-on-click="true"
                >
                  <fieldset className="large-12 columns">
                    {allSpecialties.map(specialty => {
                      if (specialty.name === 'Other') {
                        return (
                          <label key={specialty.name}>
                            <Field
                              onChange={e => this.updateSpecialty('Other')}
                              name="specialty"
                              component="input"
                              type="radio"
                              value={specialty.name}
                              checked={
                                this.state.specialty &&
                                this.state.specialty.specialtyId ===
                                  specialty.specialtyId
                              }
                            />{' '}
                            {specialty.name}
                            <input
                              onChange={e => this.updateOtherInput(e)}
                              className="other"
                              type="text"
                              name="otherSpecialty"
                              value={this.state.otherSpecialty}
                            />
                          </label>
                        );
                      }
                      return (
                        <label key={specialty.name}>
                          <Field
                            onChange={e => this.updateSpecialty(specialty)}
                            name="specialty"
                            component="input"
                            type="radio"
                            value={specialty.name}
                            checked={
                              this.state.specialty &&
                              this.state.specialty.specialtyId ===
                                specialty.specialtyId
                            }
                          />{' '}
                          {specialty.name}
                        </label>
                      );
                    })}
                  </fieldset>
                </div>
              </div>

              {/* <!-- SUBSPECIALTY --> */}
              <div className="column large-12 input-group no-icon input-dropdown">
                <div
                  className={`form-floating-label input-wrapper ${
                    this.state.subspecialty ? 'has-value' : ''
                  }`}
                >
                  <input
                    className="input-group-field"
                    type="text"
                    data-toggle="subspecialties"
                    value={
                      this.state.subspecialty
                        ? this.state.subspecialty.subSpecialtyName
                        : ''
                    }
                  />
                  <label>Subspecialty</label>
                </div>

                <div
                  className="dropdown-pane"
                  id="subspecialties"
                  data-dropdown
                  data-close-on-click="true"
                >
                  <fieldset className="large-12 columns">
                    <label key="Other Subspecialty">
                      <Field
                        onChange={e => this.updateSubspecialty('Other')}
                        name="subspecialty"
                        component="input"
                        type="radio"
                        value="Other"
                        checked={
                          this.state.subspecialty &&
                          this.state.subspecialty.subSpecialtyId == 1
                        }
                      />{' '}
                      Other
                      <input
                        onChange={e => this.updateOtherInput(e)}
                        className="other"
                        type="text"
                        name="otherSubspecialty"
                        value={this.state.otherSubspecialty}
                      />
                    </label>
                    {this.state.specialty &&
                      this.state.specialty.subSpecialties.map(subspecialty => {
                        if (subspecialty.name != 'Other') {
                          return (
                            <label key={subspecialty.subSpecialtyName}>
                              <Field
                                onChange={e =>
                                  this.updateSubspecialty(subspecialty)
                                }
                                name="subspecialty"
                                component="input"
                                type="radio"
                                value={subspecialty.subSpecialtyName}
                                checked={
                                  this.state.subspecialty &&
                                  this.state.subspecialty.subSpecialtyId ===
                                    subspecialty.subSpecialtyId
                                }
                              />{' '}
                              {subspecialty.subSpecialtyName}
                            </label>
                          );
                        }
                      })}
                  </fieldset>
                </div>
              </div>

              <div className="column large-12 top-buffer">
                <span className="item-title">Contact</span>
              </div>

              <Field
                name="organizationName"
                type="text"
                component={BasicField}
                label="Organization"
                disabled="true"
                bufferClassName="top-buffer-small"
              />
              <Field
                name="email"
                type="text"
                component={BasicField}
                label="Email"
                disabled="true"
              />
              <Field
                name="accountPhoneNumber"
                type="text"
                component={BasicField}
                label="Mobile"
                normalize={normalizePhone}
                disabled="true"
              />
              <Field
                name="workPhoneNumber"
                type="text"
                component={MaskedInput}
                label="Work Phone"
                mask={[
                  /[1-9]/,
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
              />

              {/* <!-- Notifications --> */}
              <div className="column large-12 top-buffer">
                <span className="item-title">Notifications</span>
              </div>
              <div className="column top-buffer large-12">
                <div className="row">
                  <div className="column">
                    <span className="item-title">Email</span>
                    <p className="text-light">Toggle email notifications</p>
                  </div>
                  <div className="column shrink">
                    <div className="switch">
                      <Field
                        className="switch-input"
                        id="emailSwitch"
                        type="checkbox"
                        name="emailPref"
                        component="input"
                      />
                      <label className="switch-paddle" htmlFor="emailSwitch">
                        <span className="show-for-sr" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="column top-buffer large-12">
                <div className="row">
                  <div className="column">
                    <span className="item-title">Push</span>
                    <p className="text-light">Toggle push notifications</p>
                  </div>
                  <div className="column shrink">
                    <div className="switch">
                      <Field
                        className="switch-input"
                        id="pushSwitch"
                        type="checkbox"
                        name="pushPref"
                        component="input"
                      />
                      <label className="switch-paddle" htmlFor="pushSwitch">
                        <span className="show-for-sr" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Save --> */}
              <div className="column large-12 text-center top-buffer">
                <button type="submit" className="button medium secondary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userTitlesCB = {};
  const userSpecialtiesCB = {};
  const userSubSpecialtiesCB = {};
  const userManualSpecialties = {};
  const userOtherTitle = {};
  let isManual = false;

  const userTitles = state.userState.userProfile.titles;
  const userSpecialties = state.userState.userProfile.specialties;

  if (userTitles != null) {
    userTitles.map(title => {
      if (title.titleId == 1) {
        userOtherTitle.otherTitle = title.name;
      }
      const CBName_Title = `TitleCB${title.titleId}`;
      userTitlesCB[CBName_Title] = true;
    });
  }

  if (userSpecialties != null) {
    userSpecialties.map(specialty => {
      if (specialty.specialtyId == 1) {
        isManual = true;
        userManualSpecialties.manualSpecialty = specialty.name;
        if (specialty.subSpecialties != null) {
          specialty.subSpecialties.map(subspecialty => {
            userManualSpecialties.manualSubSpecialty =
              subspecialty.subSpecialtyName;
          });
        }
      }
    });

    if (!isManual) {
      userSpecialties.map(specialty => {
        const CBName_Specialty = `SpecialtyCB${specialty.specialtyId}`;
        userSpecialtiesCB[CBName_Specialty] = true;

        if (specialty.subSpecialties != null) {
          specialty.subSpecialties.map(subspecialty => {
            const CBName_SubSpecialty = `SubSpecialtyCB${
              specialty.specialtyId
            }-${subspecialty.subSpecialtyId}`;
            userSubSpecialtiesCB[CBName_SubSpecialty] = true;
          });
        }
      });
    }
  }

  let initialValues = {
    firstName: state.userState.userProfile.firstName,
    lastName: state.userState.userProfile.lastName,
    accountPhoneNumber: convertToValidPhoneNumber(
      state.userState.userProfile.accountPhoneNumber,
    ),
    workPhoneNumber: convertToValidPhoneNumber(
      state.userState.userProfile.workPhoneNumber,
    ),
    faxNumber: convertToValidPhoneNumber(state.userState.userProfile.faxNumber),
    homePhoneNumber: convertToValidPhoneNumber(
      state.userState.userProfile.homePhoneNumber,
    ),
    email: state.userState.userProfile.email,
    organizationName: state.userState.userProfile.organizationName,
    defaultSlimView: state.userState.userProfile.defaultSlimView,
    emailPref: state.userState.userNotificationPrefs.email,
    pushPref: state.userState.userNotificationPrefs.push,
    userProfile: state.userState.userProfile,
    specialties: state.userState.userProfile.specialtyList,
  }; // this automatically causes REDUX to load the form from state

  initialValues = Object.assign({}, initialValues, userTitlesCB);
  initialValues = Object.assign({}, initialValues, userSpecialtiesCB);
  initialValues = Object.assign({}, initialValues, userSubSpecialtiesCB);
  initialValues = Object.assign({}, initialValues, userManualSpecialties);
  initialValues = Object.assign({}, initialValues, userOtherTitle);

  const stateObj = {
    userProfilePic: state.userState.userProfilePic,
    userProfile: state.userState.userProfile,
    allSpecialties: state.userState.allSpecialties,
    allTitles: state.userState.allTitles,
    userSpecialties: state.userState.userProfile.specialties,
    userTitles: state.userState.userProfile.titles,
    userNotificationPrefs: state.userState.userNotificationPrefs,
    manualSpecialtiesTab: isManual,
  };

  stateObj.initialValues = initialValues;
  return stateObj;
}

function convertToValidPhoneNumber(text) {
  if (text != undefined) {
    const result = [];
    text = text.replace('+1', '');
    text = text.replace(/^\d{2}-?\d{3}-?\d{3}-?\d{3}$/, '');
    while (text.length >= 6) {
      result.push(text.substring(0, 3));
      text = text.substring(3);
    }
    if (text.length > 0) result.push(text);
    return result.join('-');
  }
  return '';
}

function validate(values) {
  const errors = {};

  if (!values.firstName) {
    errors.firstName = 'Please enter First Name';
  }

  if (!values.lastName) {
    errors.lastName = 'Please enter Last Name';
  }

  const homePhoneNumber = values.homePhoneNumber;
  if (homePhoneNumber) {
    if (!validatePhoneNumbers(homePhoneNumber)) {
      errors.homePhoneNumber = 'Please enter 10 digit home phone number';
    }
  }

  const workPhoneNumber = values.workPhoneNumber;
  if (workPhoneNumber) {
    if (!validatePhoneNumbers(workPhoneNumber)) {
      errors.workPhoneNumber = 'Please enter 10 digit work phone number';
    }
  }

  return errors;
}

function validatePhoneNumbers(maskedNumber) {
  const rawPhoneNumber = maskedNumber.replace(/\D/g, '');

  if (rawPhoneNumber.length != 10) {
    return false;
  }
  return true;
}

function mapDispatchToProps(dispatch) {
  return {
    formActions: bindActionCreators({ change }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  reduxForm({
    form: 'UserProfileForm',
    validate,
    enableReinitialize: true, // If your initialValues prop gets updated, your form will update too.
  })(UserProfileContainer),
);
