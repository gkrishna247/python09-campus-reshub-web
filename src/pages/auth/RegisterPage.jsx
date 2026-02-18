import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    Button,
    TextField,
    Typography,
    Link,
    Box,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../hooks/useAuth";
import { PasswordChecklist } from "../../components/common/PasswordChecklist";
import { isPasswordValid } from "../../utils/validators";
import { ROLES } from "../../utils/constants";

export const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: ROLES.STUDENT,
        password: "",
        confirm_password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isFormValid =
        formData.name &&
        formData.email &&
        formData.role &&
        isPasswordValid(formData.password) &&
        formData.password === formData.confirm_password;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const response = await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                confirm_password: formData.confirm_password,
                role: formData.role
            });

            // Check response structure.
            // Usually wrapper: { status: "success", data: { email:..., role, approval_status:... } }
            // Or simply succeeds. 
            // The prompt says "Return the full response... On success: show MUI Alert... Redirect to /login after 3 seconds."

            const user = response.data; // The created user object
            const isAutoApproved = user.approval_status === "APPROVED"; // Or check email domain as per prompt hint

            if (isAutoApproved) {
                setSuccess("Registration successful! Your account has been auto-approved. Redirecting to login...");
            } else {
                setSuccess("Registration successful! Your account is pending approval. Redirecting to login...");
            }

            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (err) {
            console.error("Register Error:", err);
            // Handle validation errors from API which might be { status: "error", errors: [ { field: 'email', message: '...' } ]}
            if (err.errors && Array.isArray(err.errors)) {
                const msgs = err.errors.map((e) => e.message).join(", ");
                setError(msgs || "Registration failed. Please check your inputs.");
            } else {
                setError(err.message || err.detail || "Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
                Create Account
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
            />

            <TextField
                margin="normal"
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
            />

            <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={(e) => handleChange(e)}
                >
                    <MenuItem value={ROLES.STUDENT}>Student</MenuItem>
                    <MenuItem value={ROLES.FACULTY}>Faculty</MenuItem>
                    <MenuItem value={ROLES.STAFF}>Staff</MenuItem>
                </Select>
            </FormControl>

            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <PasswordChecklist
                password={formData.password}
                confirmPassword={formData.confirm_password}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading || !isFormValid || !!success}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
                <Link component={RouterLink} to="/login" variant="body2">
                    {"Already have an account? Sign In"}
                </Link>
            </Box>
        </Box>
    );
};
