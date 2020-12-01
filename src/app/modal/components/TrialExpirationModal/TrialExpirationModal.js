import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/common/Button/Button';
import TrialExpirationCover from 'img/modals/trial-expiration-cover';
import CircleCompleted from 'img/circle-completed';
import { ModalWrapper, ModalContent, ModalContentItem } from './styled';

const TrialExpirationModal = ({ closeModal }) => {
  return (
    <ModalWrapper>
      <img src={TrialExpirationCover} alt="trial-cover" />
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
            Streamline and improve patient care
          </ModalContentItem>
        </div>

        <Link to="/settings/subscriptions">
          <Button color="red" onClick={closeModal} size="small">
            SUBSCRIBE
          </Button>
        </Link>
      </ModalContent>
    </ModalWrapper>
  );
};

export default TrialExpirationModal;
