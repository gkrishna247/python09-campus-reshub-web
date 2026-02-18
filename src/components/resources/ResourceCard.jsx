import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Chip, Box, CardActionArea } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import { RESOURCE_TYPES } from "../../utils/constants";


export const ResourceCard = ({ resource }) => {
    const navigate = useNavigate();

    const getTypeColor = (type) => {
        switch (type) {
            case RESOURCE_TYPES.LAB:
                return "primary";
            case RESOURCE_TYPES.CLASSROOM:
                return "success";
            case RESOURCE_TYPES.EVENT_HALL:
                return "secondary";
            default:
                return "default";
        }
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea onClick={() => navigate(`/resources/${resource.id}`)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <CardContent sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="div" fontWeight="bold">
                            {resource.name}
                        </Typography>
                        <Chip
                            label={resource.type.replace('_', ' ')}
                            color={getTypeColor(resource.type)}
                            size="small"
                            variant="outlined"
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb, color: 'text.secondary' }}>
                        <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">Capacity: {resource.capacity}</Typography>
                    </Box>

                    {resource.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb, color: 'text.secondary' }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">{resource.location}</Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={resource.resource_status}
                            color={resource.resource_status === 'AVAILABLE' ? "success" : "error"}
                            size="small"
                        />
                        <Typography variant="caption" sx={{ alignSelf: 'center', ml: 'auto' }}>
                            Total: {resource.total_quantity}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
