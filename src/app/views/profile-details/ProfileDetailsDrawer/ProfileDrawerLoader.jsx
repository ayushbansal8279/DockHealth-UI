import Spacing from '@/app/components/common/Spacing';
import Skeleton from '@mui/material/Skeleton';
import styled from 'styled-components';
import { MoreActinsWrapper } from './styled';
import OptionsMenu from '@/app/components/common/OptionsMenu/OptionsMenu';
import { IconButton } from '@mui/material';
import { ArrowBack,MoreVertIcon } from '@mui/icons-material';

export const HeaderLoader = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      height: 30px;
      width: 75%;
      border-radius: 4px;

      &:not(:last-of-type) {
        margin-bottom: 4px;
      }
    }
  }
`;
export const GroupLoader = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      height: 35px;
      border-radius: 4px;

      &:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
  }
`;

const ProfileDrawerLoader = () => {
  return (
    <div>
      <Spacing vertical={3} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {new Array(1).fill().map((_, index) => (
          <HeaderLoader key={index} />
        ))}
        <MoreActinsWrapper>
          <OptionsMenu customButtonComponent={IconButton}>
            <MoreVertIcon />
          </OptionsMenu>
          <IconButton style={{ width: '34px' }}>
            <ArrowBack />
          </IconButton>
        </MoreActinsWrapper>
      </div>
      <Spacing vertical={5} />
      {new Array(3).fill(1).map((_, index) => (
        <GroupLoader key={index} />
      ))}
    </div>
  );
};

export default ProfileDrawerLoader;
