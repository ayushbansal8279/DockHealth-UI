import PropTypes from 'prop-types';
import styled from 'styled-components';

const Flag = styled.div`
  background-color: ${({ priority }) =>
    priority === 'HIGH' ? '#fb7c06' : 'transparent'};
  flex-shrink: 0;
  height: 100%;
  width: 5px;
  ${props =>
    props.absolute &&
    `
    bottom: 0;
    left: 0;
    position: absolute;
    top: 0;
  `}
`;

Flag.propTypes = {
  priority: PropTypes.oneOf(['HIGH', 'LOW', null]),
};

Flag.defaultProps = {
  priority: null,
};

export default Flag;
