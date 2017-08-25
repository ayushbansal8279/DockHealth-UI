import axios from 'axios';

export function findAllUsersByOrganizationId() {
  // loading()
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/findAllUsersByOrganizationId')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
}

export function getUserById(userId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/'+userId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
}

export function invitePersonToOrganization(person) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'organization/invitePersonToOrganization', person)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
}

export function resendInviteToOrganization(person) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'organization/resendInviteToOrganization', person)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
}

export function changeUserRoleForOrg(markedUserId,role) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'organization/changeUserRoleForOrg/'
                      +"?markedUserId=" +markedUserId
                      + "&role=" + role)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
  }

export function cancelInviteToOrganization(markedUserEmail) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'organization/cancelInviteToOrganization/'
                      +"?markedUserEmail=" +markedUserEmail)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
  }

export function removeUserFromOrganization(removedUserId) {
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'user/removeUserFromOrganization'
                      +"?removedUserId=" +removedUserId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
  }


// export function getUserAvatar(user) {
//   return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/profilePicture/'+user.userId+'?UserPictureType=PROFILE', {responseType: 'arraybuffer'})
//     .then(response => {
//       let binaryImage = new Buffer(response.data, 'binary').toString('base64'); //base64 encoding of binary image data
//       let image = `data:${response.headers['content-type'].toLowerCase()};base64,${binaryImage}`;
//       return image;
//     }).catch(response => {
//       console.log("User does not have a profile picture yet")
//     })
// }

export function getUserAvatar(user, pictureType) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'user/profilePicture/1?UserPictureType=PROFILE',{responseType: 'arraybuffer'}) // this lets axios know that response type is not JSON but binary data
    .then(response => {
      let binaryImage = new Buffer(response.data, 'binary').toString('base64'); //base64 encoding of binary image data
      let image = `data:${response.headers['content-type'].toLowerCase()};base64,${binaryImage}`;
      return image;
    })
    .catch(response => {
      console.log("User does not have a profile picture yet")
    })
}
