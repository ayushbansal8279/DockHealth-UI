import PropTypes from 'prop-types';
import styled from 'styled-components';
import palette from '../../palette';

const Flag = styled.div`
  align-self: stretch;
  background-color: ${({ priority }) =>
    priority === 'HIGH' ? palette.orangeJulius : 'transparent'};
  flex-shrink: 0;
  transition: background-color 0.25s linear;
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
