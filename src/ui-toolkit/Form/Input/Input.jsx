import TextEditor from "../TextEditor/TextEditor"
import * as S from "./styled"


export default function Input(props) {
    return (
        <S.Container>
            <TextEditor type="input" {...props} />
        </S.Container>
    )
}