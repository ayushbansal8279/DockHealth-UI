import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import TrialExpirationCover from 'img/modals/trial-expiration-cover.png';
import CircleCompleted from 'img/circle-completed.svg';
import {
  ModalWrapper,
  ModalContent,
  ModalContentItem,
  ModalIconContainer,
  ModalMainIcon,
} from './styled';

const TrialExpirationModal = ({ closeModal }) => {
  return (
    <ModalWrapper>
      <ModalIconContainer>
        <ModalMainIcon
          src={TrialExpirationCover}
          alt="trial-cover"
          style={{ width: '300px' }}
        />
        <Typography color="textPrimary" variant="h3">
          YOUR FREE TRIAL HAS ENDED
        </Typography>
      </ModalIconContainer>
      <ModalContent>
        <div>
          <ModalContentItem>
            <img src={CircleCompleted} alt="circle-completed" />
            Keep your team collaborating
          </ModalContentItem>
          <ModalContentItem>
            <img src={CircleCompleted} alt="circle-completed" />
            Quickly and easily track everyone&apos;s to-dos
          </ModalContentItem>
          <ModalContentItem>
            <img src={CircleCompleted} alt="circle-completed" />
            Streamline and improve patient/client care
          </ModalContentItem>
        </div>

        <Link to="/settings/subscriptions">
          <Button color="primary-red" onClick={closeModal} size="small">
            SUBSCRIBE
          </Button>
        </Link>
      </ModalContent>
    </ModalWrapper>
  );
};

export default TrialExpirationModal;
