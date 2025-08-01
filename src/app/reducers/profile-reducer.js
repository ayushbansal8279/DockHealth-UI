import {
  INITIALIZE_PROFILE_STATE,
  INITIALIZE_PROFILE_TYPE_STATE,
} from 'actions/action-types';
import * as ActionTypes from '../actions/action-types';
const initialState = {
  currentProfileTypeIdentifier: null,
  profileTypeName: null,
  currentProfileIdentifier: null,
  attachments: null,
  profileTaskAttachments: null,
  isFetchingAttachments: false,
  currentFolderIdentifier : null,
};

const ProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_PROFILE_TYPE_STATE: {
      const { identifier, name } = action.currentProfileType;
      return {
        ...state,
        currentProfileTypeIdentifier: identifier,
        profileTypeName: name,
      };
    }
    case INITIALIZE_PROFILE_STATE: {
      return {
        ...state,
        currentProfileIdentifier: action.profileIdentifier,
      };
    }

    case ActionTypes.GET_CURRENT_PROFILE_ATTACHMENTS: {
      return { ...state, isFetchingAttachments: true };
    }

    case ActionTypes.GET_CURRENT_PROFILE_ATTACHMENTS_SUCCESS: {
      return {
        ...state,
        attachments: action.attachments,
        profileTaskAttachments: action.profileTaskAttachments,
        isFetchingAttachments: false,
      };
    }

    case ActionTypes.GET_CURRENT_PROFILE_ATTACHMENTS_FAILURE: {
      return {
        ...state,
        attachments: null,
        isFetchingAttachments: false,
      };
    }

    case ActionTypes.UPDATE_PROFILE_ATTACHMENT_SUCCESS: {
      const { attachment: updatedAttachment } = action;
      return {
        ...state,
        attachments:
          state.attachments?.map((a) =>
            a.attachmentIdentifier === updatedAttachment.attachmentIdentifier
              ? { ...a, ...updatedAttachment }
              : a,
          ) ?? null,
      };
    }

    case ActionTypes.ADD_PROFILE_ATTACHMENT_SUCCESS: {
      return {
        ...state,
        attachments: [...(state.attachments || []), action.attachment],
      };
    }

    case ActionTypes.MOVE_PROFILE_ATTACHMENT_SUCCESS: {
      const { attachment: movedAttachment } = action;
      return {
        ...state,
        attachments:
          state.attachments?.filter(
            ({ attachmentIdentifier }) =>
              attachmentIdentifier !== movedAttachment.attachmentIdentifier,
          ) ?? null,
      };
    }

    case ActionTypes.ADD_PROFILE_ATTACHMENT_FOLDER_SUCCESS: {
      return {
        ...state,
        attachments: [...(state.attachments || []), action.folder],
      };
    }

    case ActionTypes.DELETE_PROFILE_ATTACHMENT: {
      const { identifier } = action;
      return {
        ...state,
        attachments:
          state.attachments?.filter(
            ({ attachmentIdentifier }) => attachmentIdentifier !== identifier,
          ) || null,
      };
    }

    case ActionTypes.INITIALIZE_PROFILE_ATTACHMENTS_FOLDER: {
          return {
            ...state,
            currentFolderIdentifier: action.folderIdentifier,
          };
        }
    
        // case ActionTypes.CLEAR_PATIENT_ATTACHMENTS_FOLDER: {
        //   return {
        //     ...state,
        //     currentFolderIdentifier: null,
        //   };
        // }

    default: {
      return state;
    }
  }
};

export default ProfileReducer;
