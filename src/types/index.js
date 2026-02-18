/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} email - Email
 * @property {string} name - Name
 * @property {string|null} phone - Phone
 * @property {string} role - Role (STUDENT/FACULTY/STAFF/ADMIN)
 * @property {string} account_status - Account status (ACTIVE/INACTIVE)
 * @property {string} approval_status - Approval status (PENDING/APPROVED/REJECTED)
 * @property {string|null} rejection_reason - Rejection reason
 * @property {boolean} is_email_verified - Email verification flag
 * @property {string} created_at - Created timestamp
 * @property {string} updated_at - Updated timestamp
 * @property {string|null} last_login - Last login timestamp
 */

/**
 * @typedef {Object} UserMinimal
 * @property {number} id - User ID
 * @property {string} email - Email
 * @property {string} name - Name
 * @property {string} role - Role
 * @property {string} account_status - Account status
 * @property {string} approval_status - Approval status
 */

/**
 * @typedef {Object} TokenPayload
 * @property {number} user_id - User ID
 * @property {string} email - Email
 * @property {string} role - Role
 * @property {string} account_status - Account status
 * @property {string} approval_status - Approval status
 * @property {number} exp - Expiry epoch seconds
 * @property {number} iat - Issued-at epoch seconds
 * @property {string} jti - Token ID
 * @property {string} token_type - Token type
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} access - Access token
 * @property {string} refresh - Refresh token
 * @property {UserMinimal} user - User minimal data
 */

/**
 * @typedef {Object} ApiResponse
 * @property {string} status - success
 * @property {*} data - Payload
 * @property {string|null} message - Optional message
 */

/**
 * @typedef {Object} ApiError
 * @property {string} status - error
 * @property {Array<{field?: string, message?: string}>} errors - Validation errors
 * @property {string} message - Error message
 */

/**
 * @typedef {Object} PaginatedData
 * @property {Array<*>} results - Current page results
 * @property {number} count - Total records
 * @property {string|null} next - Next page URL
 * @property {string|null} previous - Previous page URL
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} name - Name
 * @property {string} email - Email
 * @property {string} [phone] - Phone
 * @property {string} password - Password
 * @property {string} confirm_password - Confirm password
 * @property {string} role - Role (STUDENT/FACULTY/STAFF)
 */

/**
 * @typedef {Object} RoleChangeRequest
 * @property {number} id - Request ID
 * @property {UserMinimal} user - Request owner
 * @property {string} current_role - Current role
 * @property {string} requested_role - Requested role
 * @property {string} status - Request status
 * @property {string|null} rejection_reason - Rejection reason
 * @property {UserMinimal|null} reviewed_by - Reviewer
 * @property {string|null} reviewed_at - Review timestamp
 * @property {string} created_at - Created timestamp
 */

/**
 * @typedef {Object} Resource
 * @property {number} id - Resource ID
 * @property {string} name - Resource name
 * @property {string} type - Type (LAB/CLASSROOM/EVENT_HALL)
 * @property {number} capacity - Capacity
 * @property {number} total_quantity - Total quantity
 * @property {string|null} location - Location
 * @property {string|null} description - Description
 * @property {string} resource_status - Resource status
 * @property {string} approval_type - Approval type
 * @property {{id:number, name:string}} managed_by - Assigned staff
 * @property {boolean} is_deleted - Soft delete flag
 * @property {string} created_at - Created timestamp
 * @property {string} updated_at - Updated timestamp
 */

/**
 * @typedef {Object} CreateResourceData
 * @property {string} name - Name
 * @property {string} type - Type
 * @property {number} capacity - Capacity
 * @property {number} total_quantity - Quantity
 * @property {string} [location] - Location
 * @property {string} [description] - Description
 * @property {string} resource_status - Status
 * @property {string} approval_type - Approval type
 * @property {number} managed_by - Staff ID
 */

/**
 * @typedef {Object} ResourceAdditionRequest
 * @property {number} id - Request ID
 * @property {UserMinimal} requested_by - Request owner
 * @property {string} proposed_name - Proposed name
 * @property {string} proposed_type - Proposed type
 * @property {number} proposed_capacity - Proposed capacity
 * @property {number} proposed_total_quantity - Proposed quantity
 * @property {string|null} proposed_location - Proposed location
 * @property {string|null} proposed_description - Proposed description
 * @property {string} proposed_approval_type - Proposed approval type
 * @property {string} justification - Justification
 * @property {string} status - Status
 * @property {string|null} rejection_reason - Rejection reason
 * @property {UserMinimal|null} reviewed_by - Reviewer
 * @property {string|null} reviewed_at - Review timestamp
 * @property {{id:number, name:string}|null} created_resource - Created resource
 * @property {string} created_at - Created timestamp
 */

/**
 * @typedef {Object} CreateResourceRequestData
 * @property {string} proposed_name - Proposed name
 * @property {string} proposed_type - Proposed type
 * @property {number} proposed_capacity - Capacity
 * @property {number} proposed_total_quantity - Quantity
 * @property {string} [proposed_location] - Location
 * @property {string} [proposed_description] - Description
 * @property {string} proposed_approval_type - Approval type
 * @property {string} justification - Justification
 */

/**
 * @typedef {Object} WeeklySchedule
 * @property {number} [id] - Schedule row ID
 * @property {number} [resource_id] - Resource ID
 * @property {number} day_of_week - Day index
 * @property {string} [day_name] - Day name
 * @property {string} start_time - Start time
 * @property {string} end_time - End time
 * @property {boolean} is_working - Working day flag
 */

/**
 * @typedef {Object} CalendarOverride
 * @property {number} id - Override ID
 * @property {string} override_date - Override date
 * @property {string} override_type - HOLIDAY/WORKING_DAY
 * @property {string|null} description - Description
 * @property {UserMinimal} created_by - Creator
 * @property {string} created_at - Created timestamp
 */

/**
 * @typedef {Object} CreateCalendarOverrideData
 * @property {string} override_date - Override date
 * @property {string} override_type - HOLIDAY/WORKING_DAY
 * @property {string} [description] - Description
 */

/**
 * @typedef {Object} AvailabilitySlot
 * @property {string} start_time - Start time
 * @property {string} end_time - End time
 * @property {number} total_quantity - Total quantity
 * @property {number} booked_quantity - Booked quantity
 * @property {number} available_quantity - Available quantity
 * @property {string} status - Slot status
 */

/**
 * @typedef {Object} AvailabilityResponse
 * @property {number} resource_id - Resource ID
 * @property {string} date - Date string
 * @property {boolean} is_working_day - Working day flag
 * @property {Array<AvailabilitySlot>} slots - Slots
 */

/**
 * @typedef {Object} Booking
 * @property {number} id - Booking ID
 * @property {UserMinimal} user - Booking owner
 * @property {{id:number, name:string, type:string, location:string|null}} resource - Resource details
 * @property {string} booking_date - Booking date
 * @property {string} start_time - Start time
 * @property {string} end_time - End time
 * @property {number} quantity_requested - Quantity
 * @property {string} status - Booking status
 * @property {boolean} is_special_request - Special request flag
 * @property {string|null} special_request_reason - Special request reason
 * @property {string|null} cancellation_reason - Cancellation reason
 * @property {UserMinimal|null} cancelled_by - Canceled by
 * @property {string|null} cancelled_at - Cancellation timestamp
 * @property {UserMinimal|null} approved_by - Approved by
 * @property {string|null} approved_at - Approval timestamp
 * @property {UserMinimal|null} rejected_by - Rejected by
 * @property {string|null} rejection_reason - Rejection reason
 * @property {string} created_at - Created timestamp
 * @property {string} updated_at - Updated timestamp
 */

/**
 * @typedef {Object} CreateBookingData
 * @property {number} resource_id - Resource ID
 * @property {string} booking_date - Booking date
 * @property {string} start_time - Start time
 * @property {number} quantity_requested - Quantity
 * @property {boolean} is_special_request - Special request flag
 * @property {string} [special_request_reason] - Special request reason
 */

/**
 * @typedef {Object} UserNotification
 * @property {number} id - Notification ID
 * @property {number} user_id - User ID
 * @property {string} message_type - Message type
 * @property {string} title - Title
 * @property {string} body - Body
 * @property {string|null} related_entity_type - Related entity type
 * @property {number|null} related_entity_id - Related entity ID
 * @property {boolean} is_read - Read flag
 * @property {boolean} is_email_sent - Email sent flag
 * @property {string} created_at - Created timestamp
 */

/**
 * @typedef {Object} AuditLog
 * @property {number} id - Log ID
 * @property {UserMinimal|null} actor - Actor object
 * @property {string|null} actor_email - Actor email
 * @property {string} action - Action name
 * @property {string} target_entity_type - Target type
 * @property {number|null} target_entity_id - Target ID
 * @property {*} previous_state - Previous state
 * @property {*} new_state - New state
 * @property {*} metadata - Metadata
 * @property {string|null} ip_address - IP address
 * @property {string} timestamp - Timestamp
 */

/**
 * @typedef {Object} StatisticsResponse
 * @property {string} range - Time range
 * @property {{total:number, by_role:{STUDENT:number,FACULTY:number,STAFF:number,ADMIN:number}, active:number, inactive:number}} users - User metrics
 * @property {{total:number, by_type:{LAB:number,CLASSROOM:number,EVENT_HALL:number}}} resources - Resource metrics
 * @property {{total_in_range:number,pending:number,approved:number,rejected:number,cancelled:number}} bookings - Booking metrics
 * @property {{registrations:number,bookings:number,resource_requests:number,role_changes:number}} pending_approvals - Pending approvals
 * @property {Array<{id:number,name:string,booking_count:number}>} most_booked_resources - Most booked resources
 */

/**
 * @typedef {Object} PasswordChecks
 * @property {boolean} hasMinLength - Min length check
 * @property {boolean} hasUppercase - Uppercase check
 * @property {boolean} hasLowercase - Lowercase check
 * @property {boolean} hasDigit - Digit check
 * @property {boolean} hasSpecialChar - Special char check
 */
