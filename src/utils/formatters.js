import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const formatDate = (dateString) => {
    if (!dateString) return "";
    return dayjs(dateString).tz("Asia/Kolkata").format("MMM DD, YYYY");
};

export const formatTime = (timeString) => {
    if (!timeString) return "";
    // Handle "HH:mm:ss" or "HH:mm"
    // We can treat it as a time on today's date for formatting
    // But dayjs parsing of just time string might depend on current date.
    // Best to prepend a dummy date or use custom format if dayjs supports partial parsing.
    // Or just manual parsing if simple.
    // Using dayjs with custom format string:
    return dayjs(`2000-01-01T${timeString}`).format("hh:mm A");
};

export const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    return dayjs(dateTimeString).tz("Asia/Kolkata").format("MMM DD, YYYY hh:mm A");
};

export const formatRelativeTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    return dayjs(dateTimeString).fromNow();
};
