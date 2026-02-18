import { Box, TextField, MenuItem, FormControl, Select, InputLabel, InputAdornment, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { RESOURCE_TYPES } from "../../utils/constants";


export const ResourceFilters = ({
    search,
    onSearchChange,
    type,
    onTypeChange,
    minCapacity,
    onMinCapacityChange,
}) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by name or location..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={type}
                            label="Type"
                            onChange={(e) => onTypeChange(e.target.value)}
                        >
                            <MenuItem value="">All Types</MenuItem>
                            <MenuItem value={RESOURCE_TYPES.LAB}>Lab</MenuItem>
                            <MenuItem value={RESOURCE_TYPES.CLASSROOM}>Classroom</MenuItem>
                            <MenuItem value={RESOURCE_TYPES.EVENT_HALL}>Event Hall</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Min Capacity"
                        placeholder="Min capacity"
                        value={minCapacity}
                        onChange={(e) => onMinCapacityChange(e.target.value)}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
