import React, { Component ,PropTypes} from 'react';
import {reduxForm, Field, actions, change, formValueSelector} from 'redux-form';
import {invitePersonToOrganization} from '../../actions/people-actions';
import BasicField from '../common/BasicField';
import { Link,hashHistory } from 'react-router';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as userApi from '../../api/user-api'
import BaseComponent from '../BaseComponent'
import {mobileAnalyticsClient} from '../../api/analytics-api'
import MemberInitials from '../common/MemberInitials'

class UserProfileContainer extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      updateProfileResult:'',
      userSelectedSpecialties:[],
      userSpecialties:"",
      titles:"",
      predefinedTitlesDisabled:'',
      otherTitleDescription:"",
      selectedTitles:""
    };
  }

    componentDidMount () {
      mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
              'PageName': 'UserProfile'
      });
      userApi.getUserById()
      .then((response)=>{
        if(response.specialties== null){
          this.setState({userSelectedSpecialties: []});
        }
        else{
          this.setState({userSelectedSpecialties:response.specialties});
          this.setState({userSpecialties:response.specialtyList});
          // this.setState({otherSubspecialty: "Working"})
          if(response.specialties[0].subspecialties){
          }
          console.log(response.specialties)
        }
        if(response.titles && response.titles.length > 0
          && response.titles[0].titleId == 1){
          this.setState({predefinedTitlesDisabled:true})
          this.setState({otherTitleDescription:response.titleList})
        }else{
          this.setState({selectedTitles:response.titleList})
        }
      })
      if(this.props.userProfile.profileThumbnailPictureHash){
        userApi.getUserProfilePic(sessionStorage.userId, "PROFILE")
      }
      userApi.getUserNotoficationPrefs()
      userApi.getAllSpecialties()
      userApi.getAllTitles()
    }

    componentWillReceiveProps(nextProps){
      if((nextProps.allSpecialties != this.props.allSpecialties) && nextProps.userSpecialties.length > 0){
        if(nextProps.userSpecialties[0].specialtyId == 1){
          this.setState({specialty: nextProps.userSpecialties[0]})
          this.setState({otherSpecialty: nextProps.userSpecialties[0].name})
        }else{
          nextProps.allSpecialties.map(specialtyObject => {
            if(specialtyObject.specialtyId === nextProps.userSpecialties[0].specialtyId){
              this.setState({specialty: specialtyObject})
            }
          })
        }

      }
      var userSpecialties = [];
      if (nextProps.userSpecialties != this.props.userSpecialties) { //Note that React may call this method even if the props have not changed, so make sure to compare the current and next values if you only want to handle changes
        userSpecialties = nextProps.userSpecialties;
        this.setState({userSelectedSpecialties: userSpecialties});
        var specialty = userSpecialties[0];
        var subspecialty = [];

        if(specialty.subSpecialties.length > 0){
          subspecialty = specialty.subSpecialties[0]
        }
        this.setState({subspecialty: subspecialty})
        //console.log(userSpecialties)
      }
    }

    componentWillUpdate(nextProps){
      // var selected = [];
      // $('#title-checkboxes li input:checked').each(function() {
      //     selected.push($(this).attr('title'));
      // });
      // if(this.state.titles != selected.toString()){
      //   this.setState({titles: selected.toString()})
      //   this.props.formActions.change('UserProfileForm', 'titles', selected.toString())
      // }

    }

    handleImageChange = (e) => {
      console.log("handleImageChange")
      e.preventDefault();
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onloadend = () => {
        //alert(reader.result);
        // this.setState({
        //   file: file,
        //   imagePreviewUrl: reader.result
        // });
        userApi.saveUserProfilePic(reader.result, sessionStorage.userId, "PROFILE", this.props.userProfile)
        .then((response) => {
          toggleAlert("Profile updated!", "success")
        }).catch((error) => {
          toggleAlert("Error updating profile", "error")
        })
        $('#profileImageClose').trigger('click');
      }
      //reader.readAsDataURL(file)
      reader.readAsArrayBuffer(file)
    }

    getTitlesToPersist(formProps){
      var titlesToStore = [];

      var {allTitles} = this.props
      if(allTitles == undefined || allTitles == null){
        allTitles = []
      }

      if(this.state.predefinedTitlesDisabled){
        var title = {titleId:1,name:formProps.otherTitle}
        titlesToStore.push(title);
      }else{
        allTitles.map((title) =>{
          var checkBoxId = "TitleCB" + title.titleId
          if(formProps[checkBoxId]){
            var title;
            if(checkBoxId.toString() != "TitleCB1"){
              title = {titleId:title.titleId,name:title.name}
            }
            titlesToStore.push(title);
          }
        })
      }
      return titlesToStore;
    }

    // getSpecialtiesToPersist(formProps){
    //   var specialtiesToStore = [];
    //   var subSpecialtiesArr = [];
    //
    //   var {allSpecialties} = this.props
    //   if(allSpecialties == undefined || allSpecialties == null){
    //     allSpecialties = []
    //   }
    //
    //   if(formProps.manualSpecialty == undefined && formProps.manualSubSpecialty == undefined) { //specialties selected from dropdown
    //     allSpecialties.map((specialty) =>{
    //         var checkBoxId = "SpecialtyCB" + specialty.specialtyId
    //         if(formProps[checkBoxId]){
    //           var newSpecialty = {specialtyId:specialty.specialtyId,name:specialty.name}
    //
    //           var subSpecialties = specialty.subSpecialties;
    //           subSpecialtiesArr = [];
    //           subSpecialties.map((subspecialty) =>{
    //             var subSpecCheckBoxId = "SubSpecialtyCB" + specialty.specialtyId + "-" +subspecialty.subSpecialtyId;
    //             if(formProps[subSpecCheckBoxId]){
    //               var newSubSpecialty = {subSpecialtyId:subspecialty.subSpecialtyId,subSpecialtyName:subspecialty.subSpecialtyName}
    //               subSpecialtiesArr.push(newSubSpecialty)
    //             }
    //           })
    //           newSpecialty["subSpecialties"] = subSpecialtiesArr
    //           specialtiesToStore.push(newSpecialty);
    //         };
    //     })
    //   }
    //   else if(formProps.manualSpecialty =="" && formProps.manualSubSpecialty ==""){
    //     allSpecialties.map((specialty) =>{
    //         var checkBoxId = "SpecialtyCB" + specialty.specialtyId
    //         if(formProps[checkBoxId]){
    //           var newSpecialty = {specialtyId:specialty.specialtyId,name:specialty.name}
    //
    //           var subSpecialties = specialty.subSpecialties;
    //           subSpecialtiesArr = [];
    //           subSpecialties.map((subspecialty) =>{
    //             var subSpecCheckBoxId = "SubSpecialtyCB" + specialty.specialtyId + "-" +subspecialty.subSpecialtyId;
    //             if(formProps[subSpecCheckBoxId]){
    //               var newSubSpecialty = {subSpecialtyId:subspecialty.subSpecialtyId,subSpecialtyName:subspecialty.subSpecialtyName}
    //               subSpecialtiesArr.push(newSubSpecialty)
    //             }
    //           })
    //           newSpecialty["subSpecialties"] = subSpecialtiesArr
    //           specialtiesToStore.push(newSpecialty);
    //         };
    //     })
    //   }
    //   else{ //manual specialties selected
    //
    //     var manualSpecialty = formProps.manualSpecialty
    //     if(manualSpecialty == undefined){
    //       manualSpecialty= ""
    //     }
    //
    //     var manualSubSpecialty= formProps.manualSubSpecialty
    //     if(manualSubSpecialty == undefined){
    //       manualSubSpecialty=""
    //     }
    //
    //     if(manualSpecialty == "" && manualSubSpecialty ==""){
    //       specialtiesToStore = []
    //     }
    //     else{
    //       var newManualSpecialty = {specialtyId:1,name:manualSpecialty}
    //       var newManualSubSpecialty = {subSpecialtyId:1,subSpecialtyName:manualSubSpecialty}
    //       subSpecialtiesArr = [];
    //       if(manualSubSpecialty != undefined && manualSubSpecialty != ""){
    //         subSpecialtiesArr.push(newManualSubSpecialty)
    //         newManualSpecialty["subSpecialties"] = subSpecialtiesArr
    //       }
    //       specialtiesToStore.push(newManualSpecialty);
    //     }
    //   }
    //   return specialtiesToStore;
    // }

    onSubmit (formProps) {
      //console.log(formProps)
      var userObj = {};
      var specialties = [];
      var titles = [];
      var specialty = [];
      if(this.state.specialty){
        if(this.state.subspecialty){
          this.state.specialty.subSpecialties = [this.state.subspecialty];
        }else{
          this.state.specialty.subSpecialties = [];
        }
        specialty.push(this.state.specialty)
      }

      userObj.firstName = formProps.firstName
      userObj.lastName = formProps.lastName
      if(formProps.accountPhoneNumber)
        userObj.accountPhoneNumber = formProps.accountPhoneNumber.replace(/-/g,"")
      if(formProps.workPhoneNumber)
        userObj.workPhoneNumber = formProps.workPhoneNumber.replace(/-/g,"")
      if(formProps.faxNumber)
        userObj.faxNumber = formProps.faxNumber.replace(/-/g,"")
      if(formProps.homePhoneNumber)
        userObj.homePhoneNumber = formProps.homePhoneNumber.replace(/-/g,"")

      titles= this.getTitlesToPersist(formProps)
      // specialties = this.getSpecialtiesToPersist(formProps)
      userObj["titles"]=titles
      userObj["specialties"]=specialty

      //console.log(userObj)
      userApi.updateUser(userObj)
      .then((res)=>{
          userApi.updateUserNotoficationPrefs(formProps.emailPref, formProps.pushPref)
          .then((res) =>{
            toggleAlert("Profile updated successfully!", "success")
            this.setState({updateProfileResult: 'User Profile updated successfully!!!'});
            userApi.getUserById()
            userApi.getUserProfilePic(sessionStorage.userId,"PROFILE")
            userApi.getUserNotoficationPrefs()
            //hashHistory.push('/people')
          })
      })
      .catch((error)=>{
        this.setState({updateProfileResult: error.message}); //this will cause render to be called
      })
    }

    onClickRemovePicture() {
      userApi.deleteUserProfilePic()
      .then((res)=>{
        this.setState({updateProfileResult: 'User profile picture removed successfully!!'}); //this will cause render to be called
        userApi.getUserProfilePic(sessionStorage.userId,"PROFILE")
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({updateProfileResult: error.message}); //this will cause render to be called
      })
    }

    updateTitle = (e) => {
      //check if user is clicking or unclicking 'other'
      if(e.target.title == "Other"){
        if(e.target.value){
          this.setState({predefinedTitlesDisabled:false})

          var inputChecked = $('#title-input input:checked')
          var selectedTitles = [];
          for(var i=0; i<inputChecked.length; i++){
            var title = inputChecked[i].title
            selectedTitles.push(title)
          }

          this.setState({selectedTitles: selectedTitles.join(', ')})
        }else{
          this.setState({predefinedTitlesDisabled:true})
          this.setState({titles:this.state.otherTitleDescription})
        }
      }else{
        var inputChecked = $('#title-input input:checked')
        var selectedTitles = [];
        for(var i=0; i<inputChecked.length; i++){
          var title = inputChecked[i].title
          selectedTitles.push(title)
        }
        this.setState({selectedTitles: selectedTitles.join(', ')})
      }
    }

    setTitleDescriptionState(e){
      this.setState({otherTitleDescription:e.target.value})
      this.setState({titles:e.target.value})
    }

    createTitleCheckboxes(allTitles){
      return allTitles.map((title) =>{
        var checkBoxId = "TitleCB" + title.titleId
        if(title.titleId ==1){
          return(
             <li key={title.titleId} id="title-other">
               <Field onChange={(e) => this.updateTitle(e)} name={checkBoxId} id={checkBoxId} title={title.name} component="input" type="checkbox"/>
               <label htmlFor={checkBoxId}>Other</label>
               <Field onChange={(e) => this.setTitleDescriptionState(e)} name='otherTitle' type='text' component={BasicField} label='Other Title'/>
            </li>
          )
        }
        else{
          return(
            <li key={title.titleId} id="title-input">
             <Field onChange={(e) => this.updateTitle(e)} disabled={this.state.predefinedTitlesDisabled} name={checkBoxId} id={checkBoxId} title={title.name} component="input" type="checkbox"/>
              <label htmlFor={checkBoxId}>{title.name}</label>
            </li>
          )
        }
      })
    }

    // createSpecialtyDropDown(allSpecialties){
    //   return allSpecialties.map((specialty) =>{
    //     var checkBoxId = "SpecialtyCB" + specialty.specialtyId
    //     if(specialty.specialtyId !=1){ //skip the "Other" as we have "manually add Specialties"
    //       return(
    //         // originally had 'checkBoxId' as field name and htmlFor but changed it to a string due to validation and was probably unneeded
    //            <li key={specialty.specialtyId} >
    //             <Field name={checkBoxId} id={checkBoxId} component="input" type="checkbox" value={checkBoxId} onChange={(e) => this.onClickSpecialtyCheckBox(e)}/>
    //             <label htmlFor={checkBoxId}>{specialty.name}</label>
    //             </li>
    //         )
    //       }
    //     })
    // }

findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
  }

  removeObjectByKey(array, key, value) {
     for (var i = 0; i < array.length; i++) {
         if (array[i][key] === value) {
           array.splice(i, 1);
           break;
         }
     }
     return array;
   }

  handleCheckboxClick = (e) => {
    //debugger;
    e.stopPropagation()
  }

  // createSubSpecialtyCheckBoxes(specialty){
  //   var subSpecialties = specialty.subSpecialties;
  //   return subSpecialties.map((subspecialty) =>{
  //     var checkBoxId = "SubSpecialtyCB" + specialty.specialtyId + "-" +subspecialty.subSpecialtyId;
  //       return(
  //            <li key={subspecialty.subSpecialtyId} >
  //             <Field name={checkBoxId} id={checkBoxId} component="input" type="checkbox" />
  //             <label htmlFor={checkBoxId}>{subspecialty.subSpecialtyName}</label>
  //             </li>
  //         )
  //     })
  // }

  // createSpecialtySubSpecialtyTable(allSpecialties,userSpecialties){
  //     if(userSpecialties.length == 0){
  //       return (
  //         <div className="row table-row">
  //           <div className="columns large-12">
  //             <span className="details">You have not added any specialties</span>
  //           </div>
  //         </div>
  //       );
  //     }
  //
  //     return allSpecialties.map((specialty) =>{
  //       if(specialty.specialtyId ==1){ //1 is for "Others"
  //         return;
  //       }
  //
  //       var objFoundInUserSpecialties = this.findObjectByKey(userSpecialties,"specialtyId", specialty.specialtyId);
  //       if(objFoundInUserSpecialties ==null){
  //         return;
  //       }
  //
  //       return(
  //           <div key ={specialty.specialtyId} className="row table-row">
  //             <div className="columns small-12 large-6">
  //               {specialty.name}
  //             </div>
  //             <div className="columns small-12 large-6">
  //               <ul className="condense no-bullet no-bottom-buffer">
  //                 {this.createSubSpecialtyCheckBoxes(specialty)}
  //               </ul>
  //             </div>
  //           </div>
  //       );
  //     })
  //   }

    // updateSpecialty(e){
    //   this.setState({specialty: e.target.value})
    // }

    // onClickSpecialtyCheckBox(e){
    //   const tmpUserSelectedSpecialties = this.state.userSelectedSpecialties
    //
    //   var {allSpecialties} = this.props
    //   if(allSpecialties == undefined){
    //     allSpecialties = []
    //   }
    //   var SpecialityCheckBoxId = e.target.id;
    //   var specialtyId  = parseInt(SpecialityCheckBoxId.replace("SpecialtyCB", ""));
    //
    //     if (e.target.checked) {
    //        var objFoundInAllSpecialties = this.findObjectByKey(allSpecialties,"specialtyId", specialtyId);
    //        var specObject = {specialtyId:specialtyId, name:objFoundInAllSpecialties.name} //Just add the id/name (without any subspecialties), so that subspecialties wont be checked by default
    //        tmpUserSelectedSpecialties.push(specObject);
    //        this.setState({userSelectedSpecialties: tmpUserSelectedSpecialties});
    //     }
    //     else{
    //       var removedSelectedSpecialties = this.removeObjectByKey(tmpUserSelectedSpecialties,"specialtyId", specialtyId);
    //       this.setState({userSelectedSpecialties: removedSelectedSpecialties});
    //     }
    //
    // }

    openField = (e) => {
      // Clicks the hidden link that has the class 'accordion-title'
      // which is used as the trigger to open and close the 'accordion-content'
      if(e.target.name == "specialties"){
        $('.specialty-open-link.accordion-title').trigger('click');
      }
      if(e.target.name == "titles"){
        $('.title-open-link.accordion-title').trigger('click');
      }

      // Prevents default click event
      return false;
    }

    updateSpecialty = (specialty) => {
      // Reset subSpecialty when switching to another specialty
      if(specialty === "Other"){
        this.setState({specialty: {specialtyId:1, name:this.state.otherSpecialty, subSpecialties:[]}})
        if(this.state.subspecialty && (this.state.subspecialty.subSpecialtyId != 1)){
          this.setState({subspecialty: undefined})
        }
      }else{
        if((this.state.specialty != undefined) && (this.state.specialty.specialtyId != specialty.specialtyId) && (this.state.subspecialty && (this.state.subspecialty.subSpecialtyId != 1))){
          this.setState({subspecialty: undefined})
        }
        this.setState({specialty: specialty})
      }
      // this.props.formActions.change('UserProfileForm', 'specialties', e.target.value)
      return false;
    }

    updateSubspecialty = (subspecialty) => {
      if(subspecialty == "Other"){
        this.setState({subspecialty: {subSpecialtyId: 1, subSpecialtyName: this.state.otherSubspecialty}})
      }else{
        this.setState({subspecialty: subspecialty})
      }
      // this.props.formActions.change('UserProfileForm', 'specialties', e.target.value)
      return false;
    }

    updateOtherInput = (e) => {
      if(e.target.name == "otherSpecialty"){
        this.setState({specialty: {specialtyId:1, name:e.target.value, subSpecialties:[]}})
      }
      if(e.target.name == "otherSubspecialty"){
        this.setState({subspecialty: {subSpecialtyId:1, subSpecialtyName:e.target.value}})
      }
      // return false;
    }

 render(){
      //console.log("yyy",this.state.userSelectedSpecialties)

      const normalizePhone = (value, previousValue) => {
        if (!value) {
          return value
        }
        const onlyNums = value.replace(/[^\d]/g, '')
        if (!previousValue || value.length > previousValue.length) {
          // typing forward
          if (onlyNums.length === 3) {
            return onlyNums + '-'
          }
          if (onlyNums.length === 6) {
            return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3) + '-'
          }
        }
        if (onlyNums.length <= 3) {
          return onlyNums
        }
        if (onlyNums.length <= 6) {
          return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3)
        }
        return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 6) + '-' + onlyNums.slice(6, 10)
      }

      const handleSubmit = this.props.handleSubmit; //injected by reduxform
      //var userProfile = JSON.parse(sessionStorage.userProfile) //this is needed as userProfile is stringyfied and stored
      //var userProfile = this.props.userProfile
      var initialValues = this.props.initialValues
      var {userProfilePic} = this.props
      if(userProfilePic == undefined){
        userProfilePic = "assets/img/dock-logo-white.png";
      }

      var {userTitles} = this.props
      if(userTitles == undefined || userTitles == null){
        userTitles = []
      }

      var {userSpecialties} = this.props
      if(userSpecialties == undefined || userSpecialties == null){
        userSpecialties = []
      }

      var {allTitles} = this.props
      if(allTitles == undefined || allTitles == null){
        allTitles = []
      }
      var {allSpecialties} = this.props
      if(allSpecialties == undefined || allSpecialties == null){
        allSpecialties = []
      }
      return(
        <div className="wrapper top-buffer">

            <div className="columns small-12">
              <div className="row">

                {/* Profile Image */}
                <div className="columns large-12 text-center">
                  <div className="update-photo" data-open="update-profile-photo">
                    {this.props.userProfile && this.props.userProfile.profileThumbnailPictureHash ?
                      <img className="member-photo circle xlarge" src={process.env.HEYDOC_SERVICES_BASE_URL +"user/profilePicture/"+this.props.userProfile.userId+"/"+this.props.userProfile.profilePictureHash} alt={this.props.userProfile.firstName + " " + this.props.userProfile.lastName}/> :
                      <span className="member-initials circle xlarge">{this.props.userProfile.initials}</span>
                    }
                    {/* <MemberInitials member={initialValues.userProfile} extraClass="xlarge"/> */}
                    {/* <img className="member-photo circle xlarge" src={userProfilePic} alt="name of user"/> */}
                    <span className="update circle xlarge">Update picture</span>
                  </div>
                  {/* <h5 className="top-buffer">{initialValues.firstName} {initialValues.lastName}</h5> */}
                </div>
                {/* Profile Image Modal */}
                <div className="reveal text-center" id="update-profile-photo" data-reveal="">
                  <h5 className="margin-bottom">Update profile photo</h5>
                  <p onClick={this.onClickRemovePicture}>Remove photo</p>
                  <p>
                    <input type="file" hidden name="file" id="file" className="inputfile" onChange={(e) => this.handleImageChange(e)}/>
                    <label id="upload-photo-text" htmlFor="file">Upload photo</label>
                  </p>

                  {/* <p>Take photo</p> */}
                  <button className="close-button" id="profileImageClose" data-close="" aria-label="Close modal" type="button">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <form onSubmit = {handleSubmit(this.onSubmit.bind(this))} className="inline-label top-buffer expand white-bg">
                  <div className="column large-12 top-buffer">
                    <span className="item-title">General Information</span>
                  </div>
                  {/* <!-- First name --> */}
                  <Field name='firstName' type='text' component={BasicField} label='First Name' bufferClassName='top-buffer-small'/>

                  {/* <!-- Last name --> */}
                  <Field name='lastName' type='text' component={BasicField} label='Last Name'/>

                  {/* <!-- Title --> */}
                  <div className="column large-12 input-group no-icon input-dropdown">
                    <div className="form-floating-label input-wrapper has-value">
                      <input className="input-group-field" type="text" data-toggle="add-titles" value={this.state.predefinedTitlesDisabled ? this.state.otherTitleDescription : this.state.selectedTitles} />
                      <label>Title</label>
                    </div>
                    <div className="dropdown-pane" id="add-titles" data-dropdown data-close-on-click="true">
                      <fieldset className="large-12 columns">
                        <ul className="no-bullet columns-2" id="title-checkboxes">
                            {this.createTitleCheckboxes(allTitles)}
                        </ul>
                      </fieldset>
                    </div>
                  </div>
                  {/* <h5>{this.state.specialty ? this.state.specialty.name : 'no specialty'}</h5> */}

                  {/* <!-- SPECIALTY --> */}
                  <div className="column large-12 input-group no-icon input-dropdown">
                    {/* <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-list"></use></svg></span> */}
                    <div className={"form-floating-label input-wrapper " + (this.state.specialty ? 'has-value' : '')}>
                      <input className="input-group-field" type="text" data-toggle="specialty" value={this.state.specialty && this.state.specialty.name}/>
                      <label>Specialty</label>
                    </div>

                    <div className="dropdown-pane" id="specialty" data-dropdown data-close-on-click="true">
                      <fieldset className="large-12 columns">
                        {allSpecialties.map(specialty => {
                          if(specialty.name === "Other"){
                            return(
                              <label key={specialty.name}>
                                <Field onChange={(e) => this.updateSpecialty("Other")} name="specialty" component="input" type="radio" value={specialty.name} checked={this.state.specialty && this.state.specialty.specialtyId === specialty.specialtyId} />{' '}{specialty.name}
                                <input onChange={(e) => this.updateOtherInput(e)} className="other" type="text" name="otherSpecialty" value={this.state.otherSpecialty}/>
                              </label>
                            )
                          }else{
                            return(
                              <label key={specialty.name}>
                                <Field onChange={(e) => this.updateSpecialty(specialty)} name="specialty" component="input" type="radio" value={specialty.name} checked={this.state.specialty && this.state.specialty.specialtyId === specialty.specialtyId} />{' '}{specialty.name}
                              </label>
                            )
                          }
                        })}
                      </fieldset>
                    </div>
                  </div>

                  {/* <h5>{this.state.subspecialty ? this.state.subspecialty.subSpecialtyId : 'no subspecialty'}</h5> */}
                  {/* <!-- SUBSPECIALTY --> */}
                  <div className="column large-12 input-group no-icon input-dropdown">
                    {/* <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-list"></use></svg></span> */}
                    <div className={"form-floating-label input-wrapper " + (this.state.subspecialty ? 'has-value' : '')}>
                      <input className="input-group-field" type="text" data-toggle="subspecialties" value={this.state.subspecialty ? this.state.subspecialty.subSpecialtyName : ''}/>
                      <label>Subspecialty</label>
                    </div>

                    <div className="dropdown-pane" id="subspecialties" data-dropdown data-close-on-click="true">
                      <fieldset className="large-12 columns">
                        <label key="Other Subspecialty">
                          <Field onChange={(e) => this.updateSubspecialty("Other")} name="subspecialty" component="input" type="radio" value="Other" checked={this.state.subspecialty && this.state.subspecialty.subSpecialtyId == 1}/>{' '}Other
                          <input onChange={(e) => this.updateOtherInput(e)} className="other" type="text" name="otherSubspecialty" value={this.state.otherSubspecialty}/>
                        </label>
                        {this.state.specialty && this.state.specialty.subSpecialties.map(subspecialty => {
                          if(subspecialty.name != "Other"){
                            return(
                              <label key={subspecialty.subSpecialtyName}>
                                <Field onChange={(e) => this.updateSubspecialty(subspecialty)} name="subspecialty" component="input" type="radio" value={subspecialty.subSpecialtyName} checked={this.state.subspecialty && this.state.subspecialty.subSpecialtyId === subspecialty.subSpecialtyId} />{' '}{subspecialty.subSpecialtyName}
                              </label>
                            )
                          }
                        })}
                      </fieldset>
                    </div>
                  </div>

                  <div className="column large-12 top-buffer">
                    <span className="item-title">Contact</span>
                  </div>

                  <Field name='organizationName' type='text' component={BasicField} label='Organization' disabled='true' bufferClassName='top-buffer-small'/>
                  <Field name='email' type='text' component={BasicField} label='Email' disabled='true'/>
                  <Field name='accountPhoneNumber' type='text' component={BasicField} label='Mobile' normalize={normalizePhone} disabled/>
                  <Field name='workPhoneNumber' type='text' component={BasicField} label='Work Phone' normalize={normalizePhone}/>
                  {/* <Field name='faxNumber' type='text' component={BasicField} label='Fax Number' normalize={normalizePhone}/> */}
                  {/* <Field name='homePhoneNumber' type='text' component={BasicField} label='Home Phone' normalize={normalizePhone}/> */}


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
                          <Field className="switch-input" id="emailSwitch" type="checkbox" name="emailPref" component="input"/>
                          <label className="switch-paddle" htmlFor="emailSwitch">
                            <span className="show-for-sr">Download Kittens</span>
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
                          <Field className="switch-input" id="pushSwitch" type="checkbox" name="pushPref" component="input"/>
                          <label className="switch-paddle" htmlFor="pushSwitch">
                            <span className="show-for-sr">Download Kittens</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Save --> */}
                  <div className="column large-12 text-center top-buffer">
                    <button type="submit" className="button medium secondary">Save</button>
                  </div>
                </form>

              </div>
            </div>
          </div>
      );
    }
}

const selector = formValueSelector('UserProfileForm')

function mapStateToProps(state) {
  const specialty = selector(state, 'specialty')

  var userTitlesCB = {};
  var userSpecialtiesCB = {};
  var userSubSpecialtiesCB = {};
  var userManualSpecialties = {};
  var userOtherTitle = {};
  var isManual = false;

  var userTitles = state.userState.userProfile.titles
  var userSpecialties = state.userState.userProfile.specialties

  if(userTitles != null){
    userTitles.map((title) =>{
      if(title.titleId == 1){
        userOtherTitle["otherTitle"] = title.name
      }
      var CBName_Title = "TitleCB" + title.titleId
      userTitlesCB[CBName_Title] = true
    })
  }

  if(userSpecialties != null){
    userSpecialties.map((specialty) =>{
      if(specialty.specialtyId ==1){
        isManual = true
        userManualSpecialties["manualSpecialty"] = specialty.name
        if(specialty.subSpecialties != null){
          specialty.subSpecialties.map((subspecialty) =>{
              userManualSpecialties["manualSubSpecialty"] = subspecialty.subSpecialtyName
          })
        }
      }
    })

    if(!isManual){
      userSpecialties.map((specialty) =>{
        var CBName_Specialty = "SpecialtyCB" + specialty.specialtyId
        userSpecialtiesCB[CBName_Specialty] = true

        if(specialty.subSpecialties != null){
          specialty.subSpecialties.map((subspecialty) =>{
            var CBName_SubSpecialty = "SubSpecialtyCB" + specialty.specialtyId + "-" +subspecialty.subSpecialtyId;
            userSubSpecialtiesCB[CBName_SubSpecialty] = true
          })
        }
      })
    }


  }

  //console.log(userSubSpecialtiesCB)
  var initialValues = {
    firstName: state.userState.userProfile.firstName,
    lastName: state.userState.userProfile.lastName,
    accountPhoneNumber: convertToValidPhoneNumber(state.userState.userProfile.accountPhoneNumber),
    workPhoneNumber: convertToValidPhoneNumber(state.userState.userProfile.workPhoneNumber),
    faxNumber: convertToValidPhoneNumber(state.userState.userProfile.faxNumber),
    homePhoneNumber: convertToValidPhoneNumber(state.userState.userProfile.homePhoneNumber),
    email: state.userState.userProfile.email,
    organizationName: state.userState.userProfile.organizationName,
    emailPref: state.userState.userNotificationPrefs.email,
    pushPref: state.userState.userNotificationPrefs.push,
    userProfile:state.userState.userProfile,
    specialties:state.userState.userProfile.specialtyList
    }  //this automatically causes REDUX to load the form from state

  initialValues = Object.assign({}, initialValues, userTitlesCB)
  initialValues = Object.assign({}, initialValues, userSpecialtiesCB)
  initialValues = Object.assign({}, initialValues, userSubSpecialtiesCB)
  initialValues = Object.assign({}, initialValues, userManualSpecialties)
  initialValues = Object.assign({}, initialValues, userOtherTitle)

  //console.log(initialValues)

  var stateObj = {
    userProfilePic:state.userState.userProfilePic,
    userProfile: state.userState.userProfile,
    allSpecialties:state.userState.allSpecialties,
    allTitles:state.userState.allTitles,
    userSpecialties:state.userState.userProfile.specialties,
    userTitles:state.userState.userProfile.titles,
    userNotificationPrefs: state.userState.userNotificationPrefs,
    manualSpecialtiesTab: isManual
    };

    stateObj.initialValues = initialValues
    //console.log(Object.assign({}, stateObj, userTitlesCB))
    return stateObj;
}

function convertToValidPhoneNumber(text) {
  if(text != undefined){
    var result = [];
    text = text.replace(/^\d{2}-?\d{3}-?\d{3}-?\d{3}$/, "");
    while (text.length >= 6){
        result.push(text.substring(0, 3));
        text = text.substring(3);
    }
    if (text.length > 0) result.push(text);
    return result.join("-");
  }else{
    return "";
  }
}

function validate(values){
  const errors = {};

  if(!values.firstName){
    errors.firstName = 'Please enter First Name';
  }

  if(!values.lastName){
    errors.lastName = 'Please enter Last Name';
  }

  // if(!values.specialties){
  //   errors.specialties = 'Please select or enter a specialty';
  // }

  // if(!values.titles){
  //   errors.titles = 'Please select or enter a title';
  // }

  var homePhoneNumber = values.homePhoneNumber
  if(homePhoneNumber){
    if(!validatePhoneNumbers(homePhoneNumber)){
      errors.homePhoneNumber = 'Please enter 10 digit home phone number';
    }
  }

  var faxNumber = values.faxNumber
  if(faxNumber){
    if(!validatePhoneNumbers(faxNumber)){
      errors.faxNumber = 'Please enter 10 digit fax number';
    }
  }

  var workPhoneNumber = values.workPhoneNumber
  if(workPhoneNumber){
    if(!validatePhoneNumbers(workPhoneNumber)){
      errors.workPhoneNumber = 'Please enter 10 digit work phone number';
    }
  }

  var accountPhoneNumber = values.accountPhoneNumber
  if(accountPhoneNumber){
    if(!validatePhoneNumbers(accountPhoneNumber)){
      errors.accountPhoneNumber = 'Please enter 10 digit mobile phone number';
    }
  }else if (!accountPhoneNumber) {
    errors.accountPhoneNumber = 'Mobile number is required'
  }

  return errors;
}

function validatePhoneNumbers(phoneNumber){
  var match = phoneNumber.match(/^\d{3}-\d{3}-\d{4}$/gm);
  if(match = null){
    return false;
  }
  else
  {
    if(phoneNumber.length != 12){
      return false;
    }
  }
  return true;
}

//export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer);

function mapDispatchToProps(dispatch){
  return{
    formActions: bindActionCreators({change}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'UserProfileForm',
    validate,
    enableReinitialize : true  //If your initialValues prop gets updated, your form will update too.
})(UserProfileContainer));
