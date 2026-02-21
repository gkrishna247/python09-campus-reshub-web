
export interface User {
    id: number;
    email: string;
    name: string;
    phone: string | null;
    role: "STUDENT" | "FACULTY" | "STAFF" | "ADMIN";
    account_status: "ACTIVE" | "INACTIVE";
    approval_status: "PENDING" | "APPROVED" | "REJECTED";
    rejection_reason: string | null;
    is_email_verified: boolean;
    created_at: string;
    updated_at: string;
    last_login: string | null;
}

export interface UserMinimal {
    id: number;
    email: string;
    name: string;
    role: string;
    account_status: string;
    approval_status: string;
}

export interface TokenPayload {
    user_id: number;
    email: string;
    role: string;
    account_status: string;
    approval_status: string;
    exp: number;
    iat: number;
    jti: string;
    token_type: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: UserMinimal;
}

export interface ApiResponse<T> {
    status: "success";
    data: T;
    message: string | null;
}

export interface ApiError {
    status: "error";
    errors: Array<{ field?: string; message: string }>;
    message: string;
}

export interface PaginatedData<T> {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
}

export interface RegisterData {
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirm_password: string;
    role: "STUDENT" | "FACULTY" | "STAFF";
}

export interface RoleChangeRequest {
    id: number;
    user: UserMinimal;
    current_role: string;
    requested_role: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejection_reason: string | null;
    reviewed_by: UserMinimal | null;
    reviewed_at: string | null;
    created_at: string;
}

export interface Resource {
    id: number;
    name: string;
    type: "LAB" | "CLASSROOM" | "EVENT_HALL";
    capacity: number;
    total_quantity: number;
    location: string | null;
    description: string | null;
    resource_status: "AVAILABLE" | "UNAVAILABLE";
    approval_type: "AUTO_APPROVE" | "STAFF_APPROVE" | "ADMIN_APPROVE";
    managed_by: { id: number; name: string };
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateResourceData {
    name: string;
    type: string;
    capacity: number;
    total_quantity: number;
    location?: string;
    description?: string;
    resource_status: string;
    approval_type: string;
    managed_by: number;
}

export interface ResourceAdditionRequest {
    id: number;
    requested_by: UserMinimal;
    proposed_name: string;
    proposed_type: string;
    proposed_capacity: number;
    proposed_total_quantity: number;
    proposed_location: string | null;
    proposed_description: string | null;
    proposed_approval_type: string;
    justification: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejection_reason: string | null;
    reviewed_by: UserMinimal | null;
    reviewed_at: string | null;
    created_resource: { id: number; name: string } | null;
    created_at: string;
}

export interface CreateResourceRequestData {
    proposed_name: string;
    proposed_type: string;
    proposed_capacity: number;
    proposed_total_quantity: number;
    proposed_location?: string;
    proposed_description?: string;
    proposed_approval_type: string;
    justification: string;
}

export interface WeeklySchedule {
    id?: number;
    resource_id?: number;
    day_of_week: number;
    day_name?: string;
    start_time: string;
    end_time: string;
    is_working: boolean;
}

export interface CalendarOverride {
    id: number;
    override_date: string;
    override_type: "HOLIDAY" | "WORKING_DAY";
    description: string | null;
    created_by: UserMinimal;
    created_at: string;
}

export interface CreateCalendarOverrideData {
    override_date: string;
    override_type: "HOLIDAY" | "WORKING_DAY";
    description?: string;
}

export interface AvailabilitySlot {
    start_time: string;
    end_time: string;
    total_quantity: number;
    booked_quantity: number;
    available_quantity: number;
    status: "AVAILABLE" | "FULLY_BOOKED" | "NON_WORKING";
}

export interface AvailabilityResponse {
    resource_id: number;
    date: string;
    is_working_day: boolean;
    slots: AvailabilitySlot[];
}

export interface Booking {
    id: number;
    user: UserMinimal;
    resource: { id: number; name: string; type: string; location: string | null };
    booking_date: string;
    start_time: string;
    end_time: string;
    quantity_requested: number;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    is_special_request: boolean;
    special_request_reason: string | null;
    cancellation_reason: string | null;
    cancelled_by: UserMinimal | null;
    cancelled_at: string | null;
    approved_by: UserMinimal | null;
    approved_at: string | null;
    rejected_by: UserMinimal | null;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateBookingData {
    resource_id: number;
    booking_date: string;
    start_time: string;
    quantity_requested: number;
    is_special_request: boolean;
    special_request_reason?: string;
}

export interface UserNotification {
    id: number;
    user_id: number;
    message_type: string;
    title: string;
    body: string;
    related_entity_type: string | null;
    related_entity_id: number | null;
    is_read: boolean;
    is_email_sent: boolean;
    created_at: string;
}

export interface AuditLog {
    id: number;
    actor: UserMinimal | null;
    actor_email: string | null;
    action: string;
    target_entity_type: string;
    target_entity_id: number | null;
    previous_state: any;
    new_state: any;
    metadata: any;
    ip_address: string | null;
    timestamp: string;
}

export interface StatisticsResponse {
    range: string;
    users: {
        total: number;
        by_role: { STUDENT: number; FACULTY: number; STAFF: number; ADMIN: number };
        active: number;
        inactive: number;
    };
    resources: {
        total: number;
        by_type: { LAB: number; CLASSROOM: number; EVENT_HALL: number };
    };
    bookings: {
        total_in_range: number;
        pending: number;
        approved: number;
        rejected: number;
        cancelled: number;
    };
    pending_approvals: {
        registrations: number;
        bookings: number;
        resource_requests: number;
        role_changes: number;
    };
    most_booked_resources: Array<{ id: number; name: string; booking_count: number }>;
}
