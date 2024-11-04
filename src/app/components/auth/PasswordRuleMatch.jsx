import { RuleItem, RulesList, Separator } from './styled';
import { OutfitTypography } from 'styles/theme-outfit';
import Spacing from 'components/common/Spacing';

const PASSWORD_RULES = [
    { label: '8 characters', isValid: (password) => password.length >= MIN_PASSWORD_LENGTH },
    { label: '1 number', isValid: (password) => /\d/.test(password) },
    { label: '1 capital letter', isValid: (password) => /[A-Z]/.test(password) },
    { label: '1 lowercase letter', isValid: (password) => /[a-z]/.test(password) },
    { label: '1 special character', isValid: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password) }
];

const MIN_PASSWORD_LENGTH = 8;
  
function PasswordRuleMatch({ password }) {
return (
    <>
    {
        password.length > 0
            ? (
                <>
                    <OutfitTypography variant="h5">
                        Password Requirements
                    </OutfitTypography>
                    <Spacing vertical={2} />
                    <RulesList>
                        {PASSWORD_RULES.map((rule, index) => (
                        <RuleItem key={index} isValid={rule.isValid(password)} isTouched={password.length > 0}>
                            {rule.label}
                            {index < PASSWORD_RULES.length - 1 && <Separator>•</Separator>}
                        </RuleItem>
                        ))}
                    </RulesList>
                </>
            )
            : null
    }
    </>
);
}

export default PasswordRuleMatch;