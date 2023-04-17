import { styled } from "@mui/material/styles"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import Box from "../../Primitive/Box/Box"


export const Container = styled(Box)`
  position: relative;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 15px;
  width: 100%;
  min-height: ${props => props.type === "textarea" ? "75px" : "100%"};
  padding-bottom: ${props => props.type === "textarea" ? "5px" : "0"};
`

export const Content = styled(Box)`
  position: relative;
`

export const Input = styled(ContentEditable)`
  font: inherit;
  outline: none;
  
  p {
    margin-bottom: 0;
  }
`

export const Placeholder = styled(Box)`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  font: inherit;
  color: rgb(132, 146, 164);
`