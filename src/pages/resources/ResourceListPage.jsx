import { useState, useEffect, useCallback } from "react";
import { Box, Grid, Typography, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, TablePagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ResourceCard } from "../../components/resources/ResourceCard";
import { ResourceFilters } from "../../components/resources/ResourceFilters";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { resourceService } from "../../services/resourceService";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { ROLES, RESOURCE_TYPES, APPROVAL_TYPES } from "../../utils/constants";
import { userService } from "../../services/userService";
// Inline debounce hook since it wasn't specified in plan but required by prompt "debounced 300ms"
function useDebounceValue(value, delay): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export const ResourceListPage = () => {
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();

    // State
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounceValue(search, 300);
    const [type, setType] = useState("");
    const [minCapacity, setMinCapacity] = useState("");

    // Create Dialog
    const [openCreate, setOpenCreate] = useState(false);
    const [createData, setCreateData] = useState({
        name: "",
        type: RESOURCE_TYPES.LAB,
        capacity: "30",
        total_quantity: "1",
        location: "",
        description: "",
        resource_status: "AVAILABLE",
        approval_type: APPROVAL_TYPES.AUTO_APPROVE,
        managed_by: "" // ID as string
    });
    const [staffUsers, setStaffUsers] = useState([]);

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const response = await resourceService.getResources({
                search: debouncedSearch,
                type: type || undefined,
                min_capacity: minCapacity ? parseInt(minCapacity) : undefined,
                page: page + 1 // API uses 1-based indexing usually? DRF uses 1-based.
            });
            setResources(response.data.results);
            setTotalCount(response.data.count);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, type, minCapacity, page]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    // Fetch staff for create dialog
    useEffect(() => {
        if (openCreate && user?.role === ROLES.ADMIN) {
            // Fetch staff users
            userService.getUsers({ role: ROLES.STAFF }).then(res => {
                setStaffUsers(res.data.results);
            });
        }
    }, [openCreate, user]);

    const handleCreateSubmit = async () => {
        try {
            await resourceService.createResource({
                name: createData.name,
                type: createData.type,
                capacity: parseInt(createData.capacity),
                total_quantity: parseInt(createData.total_quantity),
                location: createData.location,
                description: createData.description,
                resource_status: createData.resource_status,
                approval_type: createData.approval_type,
                managed_by: parseInt(createData.managed_by)
            });
            showSnackbar("Resource created successfully!", "success");
            setOpenCreate(false);
            fetchResources();
            // Reset form
            setCreateData({
                name: "", type, capacity, total_quantity, location, description, resource_status, approval_type, managed_by: ""
            });
        } catch (error) {
            showSnackbar(error.message || "Failed to create resource.", "error");
        }
    };

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Resources
                </Typography>
                <ResourceFilters
                    search={search} onSearchChange={setSearch}
                    type={type} onTypeChange={setType}
                    minCapacity={minCapacity} onMinCapacityChange={setMinCapacity}
                />
            </Box>

            {loading ? (
                <LoadingSpinner />
            ) : resources.length === 0 ? (
                <EmptyState title="No resources found" message="Try adjusting your filters." />
            ) : (
                <Grid container spacing={3}>
                    {resources.map((resource) => (
                        <Grid size={{ xs: 12, sm, md, lg: 3 }} key={resource.id}>
                            <ResourceCard resource={resource} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Pagination - assuming API returns count */}
            {totalCount > 0 && (
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={10} // fixed for now as API might not support dynamic size easily without param
                    rowsPerPageOptions={[]} // hide options
                />
            )}

            {user?.role === ROLES.ADMIN && (
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ position: 'fixed', bottom, right: 24 }}
                    onClick={() => setOpenCreate(true)}
                >
                    <AddIcon />
                </Fab>
            )}

            {/* Create Dialog */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ pt: 1, display, flexDirection, gap: 2 }}>
                        <TextField
                            label="Name" fullWidth required
                            value={createData.name} onChange={(e) => setCreateData({ ...createData, name)}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select value={createData.type} label="Type" onChange={(e) => setCreateData({ ...createData, type)}>
                                <MenuItem value={RESOURCE_TYPES.LAB}>Lab</MenuItem>
                                <MenuItem value={RESOURCE_TYPES.CLASSROOM}>Classroom</MenuItem>
                                <MenuItem value={RESOURCE_TYPES.EVENT_HALL}>Event Hall</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Capacity" type="number" fullWidth required
                                value={createData.capacity} onChange={(e) => setCreateData({ ...createData, capacity)}
                            />
                            <TextField
                                label="Total Quantity" type="number" fullWidth required
                                value={createData.total_quantity} onChange={(e) => setCreateData({ ...createData, total_quantity)}
                            />
                        </Box>
                        <TextField
                            label="Location" fullWidth
                            value={createData.location} onChange={(e) => setCreateData({ ...createData, location)}
                        />
                        <TextField
                            label="Description" fullWidth multiline rows={3}
                            value={createData.description} onChange={(e) => setCreateData({ ...createData, description)}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select value={createData.resource_status} label="Status" onChange={(e) => setCreateData({ ...createData, resource_status)}>
                                <MenuItem value="AVAILABLE">Available</MenuItem>
                                <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Approval Type</InputLabel>
                            <Select value={createData.approval_type} label="Approval Type" onChange={(e) => setCreateData({ ...createData, approval_type)}>
                                <MenuItem value="AUTO_APPROVE">Auto Approve</MenuItem>
                                <MenuItem value="STAFF_APPROVE">Staff Approve</MenuItem>
                                <MenuItem value="ADMIN_APPROVE">Admin Approve</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Managed By (Staff)</InputLabel>
                            <Select value={createData.managed_by} label="Managed By (Staff)" onChange={(e) => setCreateData({ ...createData, managed_by)}>
                                {staffUsers.map(u => (
                                    <MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateSubmit} disabled={!createData.name || !createData.managed_by}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
