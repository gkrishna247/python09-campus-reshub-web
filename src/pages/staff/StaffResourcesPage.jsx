import { useState, useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { ResourceCard } from "../../components/resources/ResourceCard";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { resourceService } from "../../services/resourceService";
import { useAuth } from "../../hooks/useAuth";

export const StaffResourcesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            try {
                // Fetch resources (we might need a specific endpoint for managed resources later)
                // For now, fetch all and filter client side as per original logic intent
                // Since 'type' and 'search' were undefined in the original broken code, I'll omit them or use state if needed.
                // The original code had `type` and `search` variables but they were not defined in component scope!
                // I will assume simple fetch for now.
                const res = await resourceService.getResources({ page: 1 });

                if (user) {
                    const managed = res.data.results.filter(r => r.managed_by.id === user.id);
                    setResources(managed);
                }
            } catch (error) {
                console.error("Failed to fetch resources", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, [user]);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">My Managed Resources</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/staff/request-resource")}
                >
                    Request New Resource
                </Button>
            </Box>

            {loading ? (
                <LoadingSpinner />
            ) : resources.length === 0 ? (
                <EmptyState
                    title="No Managed Resources"
                    message="You are not managing any resources. Request to add one."
                    action={{ label: "Request Resource", to: "/staff/request-resource" }}
                />
            ) : (
                <Grid container spacing={3}>
                    {resources.map((resource) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={resource.id}>
                            <ResourceCard resource={resource} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};
