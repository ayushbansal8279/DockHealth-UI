import styled from 'styled-components';
import PropTypes from 'prop-types';

import Tag from './Tag';

const SquareTag = styled(Tag)`
  border-radius: 2px;
  padding: 1px 4px 2px 3px;
  background: ${({ background }) => background};
`;

SquareTag.propTypes = {
  background: PropTypes.string,
};

SquareTag.defaultProps = {
  background: '#2a4a70',
};

export default SquareTag;
