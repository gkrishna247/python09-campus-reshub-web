import { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, TablePagination, Chip } from "@mui/material";
import { auditService } from "../../services/auditService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import dayjs from "dayjs";

export const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await auditService.getAuditLogs({ page: page + 1, search);
            setLogs(res.data.results);
            setTotalCount(res.data.count);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, search]);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Audit Logs</Typography>
                <TextField
                    placeholder="Search logs..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>

            {loading ? <LoadingSpinner /> : (
                <Paper>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Action</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>IP Address</TableCell>
                                    <TableCell>Details</TableCell>
                                    <TableCell>Entity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{dayjs(log.timestamp).format("MMM D, YYYY HH:mm:ss")}</TableCell>
                                        <TableCell><Chip label={log.action} size="small" variant="outlined" /></TableCell>
                                        <TableCell>{log.actor_name} ({log.actor_role})</TableCell>
                                        <TableCell>{log.ip_address}</TableCell>
                                        <TableCell>{log.details}</TableCell>
                                        <TableCell>{log.target_entity} (ID)</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={(_e, p) => setPage(p)}
                        rowsPerPage={10}
                        rowsPerPageOptions={[]}
                    />
                </Paper>
            )}
        </Box>
    );
};
