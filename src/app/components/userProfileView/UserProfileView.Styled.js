import styled from 'styled-components';

export const FormContainer = styled.form`
  &.invisible {
    display: none;
  }
`;

export const ViewContainer = styled.div`
  position: relative;
`;

export const SectionSubtypography = styled.div`
  font-size: 14px;
`;

export const SectionTypography = styled(SectionSubtypography)`
  font-weight: bold;
`;

export const SubmitButton = styled.button.attrs({
  type: 'submit',
})`
  align-items: center;
  background-color: #125375;
  border-radius: 0;
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 20px;
  font-weight: bold;
  height: 75px;
  justify-content: center;
  transition: filter 0.2s ease-out;
  width: 100%;

  &[disabled] {
    cursor: progress;
    filter: brightness(0.75);
  }
`;

export const AvatarContainer = styled.div`
  align-items: center;
  border: 2px solid #007cab;
  border-radius: 50%;
  display: flex;
  height: 90px;
  justify-content: center;
  width: 90px;
`;
