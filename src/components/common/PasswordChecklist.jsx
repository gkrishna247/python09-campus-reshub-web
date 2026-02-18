import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { validatePassword } from "../../utils/validators";


export const PasswordChecklist = ({ password, confirmPassword }) => {
    const checks = validatePassword(password);
    const passwordsMatch = confirmPassword !== undefined ? password === confirmPassword && password.length > 0 : true;

    const renderItem = (isValid, text) => (
        <ListItem dense sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
                {isValid ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
            </ListItemIcon>
            <ListItemText
                primary={text}
                primaryTypographyProps={{
                    variant: "caption",
                    color: isValid ? "text.primary" : "text.secondary"
                }}
            />
        </ListItem>
    );

    return (
        <List dense sx={{ mt: 1, mb: 2 }}>
            {renderItem(checks.hasMinLength, "At least 8 characters")}
            {renderItem(checks.hasUppercase, "At least 1 uppercase letter")}
            {renderItem(checks.hasLowercase, "At least 1 lowercase letter")}
            {renderItem(checks.hasDigit, "At least 1 digit")}
            {renderItem(checks.hasSpecialChar, "At least 1 special character")}
            {confirmPassword !== undefined && renderItem(passwordsMatch, "Passwords match")}
        </List>
    );
};
