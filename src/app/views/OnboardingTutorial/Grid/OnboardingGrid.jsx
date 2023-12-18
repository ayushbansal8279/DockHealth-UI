import React, { useContext } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  TableCell,
} from '@mui/material';
import { MontserratTypography } from 'styles/theme-montserrat';
import { OutfitTypography } from 'styles/theme-outfit';
import Avatar from 'components/user/Avatar/Avatar';
import Circle from 'img/circle.svg';
import Spacing from 'components/common/Spacing';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { CircleIcon, BlankCellContent, AvatarIconContainer } from './styled';
import OnboardingContext from '../OnboardingContext/OnboardingContext';

const OnboardingGrid = () => {
  const STANDARD_TASK_HEIGHT = 35;

  const { tasks, list, groupName } = useContext(OnboardingContext);

  const rows = tasks.length > 0 ? tasks : Array.from({ length: 6 });

  return (
    <TableContainer component={Paper}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          padding: '20px',
          width: '100%',
        }}
      >
        <div>
          <OutfitTypography variant="h2" weight="700">
            {list?.listName}
          </OutfitTypography>
          <Spacing vertical={3} />
        </div>

        <AvatarIconContainer>
          <Avatar color="#68B1F7" />
          <Avatar color="#5E70E9" />
          <Avatar color="#68B1F7" />
        </AvatarIconContainer>
      </div>

      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {groupName && (
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  paddingLeft: '10px',
                  paddingBottom: '10px',
                  alignItems: 'baseline',
                }}
              >
                <RotatableChevron />
                <OutfitTypography variant="h4" align="center" weight="700">
                  {groupName}
                </OutfitTypography>
              </div>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              // eslint-disable-next-line react/no-array-index-key
              key={`row-${index}]}`}
              sx={{
                height: STANDARD_TASK_HEIGHT,
                '&:last-child td': { whiteSpace: 'nowrap', width: ` 1%` },
                '&:first-child td': { width: `50px` },
              }}
            >
              <TableCell
                sx={{ border: 1, borderColor: '#E5E9F2' }}
                style={{ height: 'inherit' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div>
                    <CircleIcon src={Circle} isCompleted={false} />
                  </div>
                  {row?.description && row?.description !== '' ? (
                    <>{row?.description}</>
                  ) : (
                    <BlankCellContent />
                  )}
                </div>
              </TableCell>
              <TableCell
                sx={{ border: 1, borderColor: '#E5E9F2', height: 'inherit' }}
                align="right"
              >
                {' '}
                <BlankCellContent />
              </TableCell>
              <TableCell
                sx={{ border: 1, borderColor: '#E5E9F2', height: 'inherit' }}
                align="right"
              >
                {' '}
                <BlankCellContent />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OnboardingGrid;
