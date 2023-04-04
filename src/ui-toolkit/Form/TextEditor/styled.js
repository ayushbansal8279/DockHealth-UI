import { styled } from "@mui/material/styles"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import Box from "../../Primitive/Box/Box"


export const Container = styled(Box)`
  position: relative;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 15px;
  min-height: ${props => props.type === "textarea" ? "125px" : "100%"};
  padding-bottom: ${props => props.type === "textarea" ? "5px" : "0"};
`

export const Content = styled(Box)`
  position: relative;
`

export const Input = styled(ContentEditable)`
  font: inherit;
  padding: 10px 15px;
  outline: none;
  
  p {
    margin-bottom: 0;
  }
`

export const Placeholder = styled(Box)`
  position: absolute;
  top: 10px;
  left: 15px;
  font: inherit;
  color: rgb(132, 146, 164);
`