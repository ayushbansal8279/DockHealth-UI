import { Box } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import React, { useState } from 'react';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Container, Title } from './styled';

const ChartTail = (props) => {
  const { name, children, onMaximize } = props;
  const [maximized, setMaximized] = useState(false);

  // eslint-disable-next-line react/destructuring-assignment
  if (props.maximized !== null && props.maximized !== name) {
    return null;
  }

  return (
    <Container maximized={maximized}>
      <Box display="flex" flexDirection="column" height="100%">
        <Title>
          {name}
          <Box display="inline-block" margin="-16px -40px 0px 0px">
            <OptionsMenu
              options={[
                {
                  name: maximized ? 'Minimize' : 'Maximize',
                  onClick: () => {
                    setMaximized(!maximized);
                    if (maximized) {
                      onMaximize(null);
                    } else {
                      onMaximize(name);
                    }
                  },
                },
              ]}
            >
              <MoreVert color="primary" />
            </OptionsMenu>
          </Box>
        </Title>
        <Box flex={1} key={maximized}>
          {children}
        </Box>
      </Box>
    </Container>
  );
};

export default ChartTail;
