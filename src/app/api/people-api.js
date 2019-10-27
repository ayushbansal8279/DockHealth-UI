import axios from './axios-heydoc';

export function findAllUsersByOrganizationId() {
  // loading()
  return axios.get('user/findAllUsersByOrganizationId')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function getUserById(userId) {
  return axios.get('user/'+userId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function invitePersonToOrganization(person) {
  return axios.put('organization/invitePersonToOrganization', person)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function resendInviteToOrganization(person) {
  return axios.put('organization/resendInviteToOrganization', person)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function changeUserRoleForOrg(markedUserId,role) {
  return axios.put('organization/changeUserRoleForOrg/'
                      +"?markedUserId=" +markedUserId
                      + "&role=" + role)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
  }

export function cancelInviteToOrganization(markedUserEmail) {
  return axios.put('organization/cancelInviteToOrganization/'
                      +"?markedUserEmail=" +encodeURIComponent(markedUserEmail))
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
  }

export function removeUserFromOrganization(removedUserId) {
  return axios.delete('user/removeUserFromOrganization'
                      +"?removedUserId=" +removedUserId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
  }


// export function getUserAvatar(user) {
//   return axios.get('user/profilePicture/'+user.userId+'?UserPictureType=PROFILE', {responseType: 'arraybuffer'})
//     .then(response => {
//       let binaryImage = new Buffer(response.data, 'binary').toString('base64'); //base64 encoding of binary image data
//       let image = `data:${response.headers['content-type'].toLowerCase()};base64,${binaryImage}`;
//       return image;
//     }).catch(response => {
//       console.log("User does not have a profile picture yet")
//     })
// }

export function getUserAvatar(user, pictureType) {
  return axios.get('user/profilePicture/1?UserPictureType=PROFILE',{responseType: 'arraybuffer'}) // this lets axios know that response type is not JSON but binary data
    .then(response => {
      let binaryImage = new Buffer(response.data, 'binary').toString('base64'); //base64 encoding of binary image data
      let image = `data:${response.headers['content-type'].toLowerCase()};base64,${binaryImage}`;
      return image;
    })
    .catch(response => {
      console.log("User does not have a profile picture yet")
    })
}
