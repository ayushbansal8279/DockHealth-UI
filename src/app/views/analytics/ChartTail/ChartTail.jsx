import { Box } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useState } from 'react';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Container, Title } from './styled';

const ChartTail = props => {
  const { name, children } = props;
  const [maximized, setMaximized] = useState(false);

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
                  },
                },
              ]}
            >
              <MoreVert color="primary" />
            </OptionsMenu>
          </Box>
        </Title>
        <Box flex={1}>{children}</Box>
      </Box>
    </Container>
  );
};

export default ChartTail;
