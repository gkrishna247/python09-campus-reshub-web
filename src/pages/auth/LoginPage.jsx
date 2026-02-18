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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../hooks/useAuth";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const user = await login(email, password);
            // Redirect based on approval status
            if (user.approval_status === "APPROVED") {
                navigate("/dashboard");
            } else {
                navigate("/approval-status");
            }
        } catch (err) {
            console.error("Login Error:", err);
            // Check for specific error structure from API
            // Our api.ts normalizes error to { status: 'error', message, errors: [] }
            // Or if network error
            if (err.message === "Account is inactive") {
                setError("Your account is inactive. Please contact support.");
            } else if (err.status === 401 || err.detail === "No active account found with the given credentials") {
                // DRF SimpleJWT returns { detail: ... }
                setError("Invalid email or password.");
            } else {
                setError(err.message || err.detail || "An error occurred during login.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
                Sign In
            </Typography>

            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
                <Link component={RouterLink} to="/register" variant="body2">
                    {"Don't have an account? Register"}
                </Link>
            </Box>
        </Box>
    );
};
