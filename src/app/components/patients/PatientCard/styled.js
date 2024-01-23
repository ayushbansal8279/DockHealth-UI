import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import PinIcon from 'img/pin.svg';

export const PatientCellWrapper = styled.span``;

export const PatientCardContainer = styled.div`
  width: 436px;
  background-color: ${palette.white};
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
  font-family: inherit;
  color: ${palette.mediumGrey};
`;

export const PatientInfoSection = styled.div`
  padding: ${spacing.smallPlus};
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const PatientName = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  font-family: 'Montserrat', sans-serif;
  color: ${palette.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PatientLinkText = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  color: ${palette.brightBlue};
  white-space: nowrap;
`;

export const EditPatientButton = styled.button`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  color: ${palette.brightBlue};
  white-space: nowrap;
`;

export const PatientNotesSection = styled.div`
  max-height: 330px;
  padding: ${spacing.smallPlus};
  overflow-y: auto;
`;

export const PatientNote = styled.div`
  width: 100%;
`;
export const PatientNotesWrapper = styled.div`
  width: 100%;
  background: ${palette.white};
  padding: 2px;
`;

export const PinnedNotesWrapper = styled.div`
  position: relative;
  background-color: ${palette.coolGrey4};
  border: 1px solid ${palette.coolGrey3};
  padding: 5px;

  &:before {
    content: url(${PinIcon});
    position: absolute;
    top: 9px;
    right: 6px;
  }
`;

export const NoteDescription = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

export const NoteInfo = styled(NoteDescription)`
  color: ${palette.coolGrey2};
`;

export const NoteDivider = styled.hr`
  width: 100%;
  margin: 0;
  border-width: 1px;
  border-color: ${palette.coolGrey2};
`;

export const Divider = styled.hr`
  margin: 0;
  border-color: ${palette.coolGrey3};
  border-width: 3px;
`;

export const PatientInfo = styled.div``;

export const CustomFieldPatientInfo = styled.div`
  display: flex;
  &:not(:last-child):after {
    content: '|';
    margin: 0 ${spacing.smallPlus};
    color: ${palette.coolGrey2};
  }
`;

export const InfoItem = styled.p`
  display: inline-block;
  margin-bottom: 0;
  color: inherit;

  & a {
    color: inherit;
  }

  &:not(:last-child):after {
    content: '|';
    margin: 0 ${spacing.smallPlus};
    color: ${palette.coolGrey2};
  }
`;

export const PatientMRNAnchor = styled.a`
  color: ${palette.brightBlue} !important;
`;

export const NotesTitle = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
`;

// skeleton loader
const SKELETON_LOADER_BACKGROUND = palette.coolGrey3;

export const SkeletonLoaderTextRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
`;

export const SkeletonLoaderText = styled.div`
  flex: 1;
  height: 19px;
  background-color: ${SKELETON_LOADER_BACKGROUND};
`;
