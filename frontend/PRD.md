# PRODUCT REQUIREMENTS DOCUMENT

## EXECUTIVE SUMMARY

**Product Name:** RemindMe

**Product Vision:** RemindMe helps busy individuals never miss a deadline by providing simple, intelligent task reminders delivered via email. The app combines visual urgency indicators with proactive email notifications to keep users on track with their commitments.

**Core Purpose:** Solves the problem of missed deadlines and forgotten tasks by providing a centralized system for tracking tasks with customizable email reminders and visual urgency cues.

**Target Users:** Busy individuals who juggle multiple responsibilities and need reliable reminders to stay organized and meet their deadlines consistently.

**Key MVP Features:**
- User Authentication - System/Configuration
- Task Management with Due Dates - User-Generated Content
- Email Reminder Notifications - Communication
- Task Tags & Color-Coded Urgency - Configuration
- Recurring Tasks - User-Generated Content
- Task Completion Tracking - User-Generated Content

**Platform:** Web application (responsive design, accessible via browser on desktop, tablet, and mobile devices)

**Complexity Assessment:** Moderate
- State Management: Backend database (MongoDB) with frontend state
- External Integrations: Email service (SendGrid/similar) - reduces complexity
- Business Logic: Moderate (recurring task scheduling, reminder timing calculations, tag-based color coding)

**MVP Success Criteria:**
- Users complete full task lifecycle: create, view, edit, mark complete, delete
- Email reminders sent successfully at configured times
- Recurring tasks generate new instances automatically
- Tag-based color coding displays correctly
- Responsive design functions on mobile, tablet, and desktop
- Users create average of 5+ tasks in first week

---

## 1. USERS & PERSONAS

**Primary Persona:**
- **Name:** "Alex the Multitasker"
- **Context:** Works full-time while managing personal projects, family commitments, and social obligations. Frequently switches between devices throughout the day.
- **Goals:** Stay on top of all deadlines without constantly checking lists; receive timely reminders before tasks are due; quickly see which tasks need immediate attention.
- **Pain Points:** Misses deadlines because they forget to check task lists; overwhelmed by too many tasks without clear prioritization; needs reminders that reach them wherever they are (email accessible on all devices).

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core MVP Features (Priority 0)

**FR-001: User Authentication**
- **Description:** Secure user registration, login, password reset, and session management
- **Entity Type:** System/Configuration
- **Operations:** Register, Login, View profile, Edit profile, Reset password, Logout
- **Key Rules:** Secure password hashing, JWT-based sessions, email verification for registration
- **Acceptance:** Users can register with email/password, login securely, reset forgotten passwords, and manage their profile

**FR-002: Task Management**
- **Description:** Create, view, edit, delete, and list tasks with titles, descriptions, due dates/times, and tags
- **Entity Type:** User-Generated Content
- **Operations:** Create, View, Edit, Delete, List/Search, Archive, Mark Complete
- **Key Rules:** Due date/time required, title minimum 3 characters, tasks soft-deleted (archived for 30 days)
- **Acceptance:** Users can manage complete task lifecycle and see all tasks sorted by due date with visual urgency indicators

**FR-003: Email Reminder Notifications**
- **Description:** Automated email reminders sent before task due times based on user-configured reminder offset
- **Entity Type:** Communication
- **Operations:** Create reminder settings, View reminder history, Edit reminder timing
- **Key Rules:** Default reminder 15 minutes before due time, users can customize per task, emails sent via external service
- **Acceptance:** Users receive email reminders at configured times before tasks are due, can customize reminder timing per task

**FR-004: Task Tags & Color-Coded Urgency**
- **Description:** Assign tags to tasks, tags determine visual color coding for urgency display
- **Entity Type:** Configuration
- **Operations:** Create tags, View tags, Edit tags, Delete tags, Assign to tasks
- **Key Rules:** Each tag has associated color (no purple), color determines task display urgency, multiple tags per task allowed
- **Acceptance:** Users can create custom tags with colors, assign tags to tasks, see color-coded visual indicators based on tags

**FR-005: Recurring Tasks**
- **Description:** Create tasks that automatically generate new instances on specified intervals (daily, weekly, monthly)
- **Entity Type:** User-Generated Content
- **Operations:** Create recurring pattern, View recurring series, Edit pattern, Delete series, Skip instance
- **Key Rules:** New instance created when previous marked complete or due date passes, maintains tag and reminder settings
- **Acceptance:** Users can set tasks to recur on intervals, system automatically creates new instances, users can manage recurring series

**FR-006: Task Completion Tracking**
- **Description:** Mark tasks as complete, view completed task history, track completion statistics
- **Entity Type:** User-Generated Content
- **Operations:** Mark complete, View completed list, Unmark (reopen), Archive completed
- **Key Rules:** Completed tasks move to separate view, completion timestamp recorded, completed tasks archived after 30 days
- **Acceptance:** Users can mark tasks complete, view completion history, see completion statistics on dashboard

---

## 3. USER WORKFLOWS

### 3.1 Primary Workflow: Create Task and Receive Reminder

**Trigger:** User needs to track a new deadline
**Outcome:** Task created with email reminder scheduled, user receives timely notification before due date

**Steps:**
1. User clicks "New Task" button on dashboard
2. System displays task creation form with fields: title, description, due date/time, tags, reminder timing, recurring pattern
3. User fills required fields (title, due date/time), optionally adds description, selects/creates tags, sets reminder timing (defaults to 15 minutes before), optionally sets recurring pattern
4. System validates inputs, saves task to database, schedules email reminder based on due time minus reminder offset
5. User sees task appear in task list with color-coded urgency indicator based on assigned tags
6. System sends email reminder at scheduled time (due time minus reminder offset)
7. User receives email, clicks link to view task in app, marks task complete

### 3.2 Key Supporting Workflows

**Register Account:** User navigates to registration → enters email/password → verifies email → logs in automatically

**Edit Task:** User clicks task in list → clicks edit button → modifies fields → saves → sees updated task with new urgency indicator

**Delete Task:** User selects task → clicks delete → confirms deletion → task soft-deleted (archived)

**Create Tag:** User opens tag management → clicks "New Tag" → enters name and selects color → saves → tag available for task assignment

**Set Recurring Pattern:** During task creation/edit → toggles "Recurring" → selects interval (daily/weekly/monthly) → saves → system schedules recurring instances

**Mark Complete:** User clicks checkbox on task → task moves to completed section → if recurring, new instance created automatically

**View Completed Tasks:** User clicks "Completed" tab → sees list of completed tasks with completion timestamps → can unmark or archive

---

## 4. BUSINESS RULES

### 4.1 Entity Lifecycle Rules

| Entity | Type | Who Creates | Who Edits | Who Deletes | Delete Action |
|--------|------|-------------|-----------|-------------|---------------|
| User | System | Self (registration) | Self | Self | Hard delete account + all tasks |
| Task | User-Generated | Task owner | Task owner | Task owner | Soft delete (30-day archive) |
| Tag | Configuration | Task owner | Task owner | Task owner | Hard delete (unassigns from tasks) |
| Reminder | Communication | System (auto) | Task owner (timing) | System (auto) | Auto-deleted after sent |
| Recurring Pattern | Configuration | Task owner | Task owner | Task owner | Stops future instances |

### 4.2 Data Validation Rules

| Entity | Required Fields | Key Constraints |
|--------|-----------------|-----------------|
| User | email, password | Email unique, password min 8 chars |
| Task | title, dueDate, dueTime, ownerId | Title min 3 chars, due date/time future, max 200 tasks per user |
| Tag | name, color, ownerId | Name min 2 chars, color not purple, max 20 tags per user |
| Recurring Pattern | interval, taskId | Interval: daily/weekly/monthly, end date optional |

### 4.3 Access & Process Rules
- Users can only view, edit, and delete their own tasks and tags
- Email reminders sent only if task not marked complete and due time not passed
- Recurring task instances created when previous instance completed or due date passes
- Completed tasks automatically archived after 30 days
- Deleted (archived) tasks permanently removed after 30 days
- Tag colors determine visual urgency: user-defined mapping, no purple allowed
- Default reminder timing: 15 minutes before due time (user can customize per task)
- Maximum 200 active tasks per user (excludes completed/archived)

---

## 5. DATA REQUIREMENTS

### 5.1 Core Entities

**User**
- **Type:** System/Configuration | **Storage:** Backend (MongoDB)
- **Key Fields:** id, email, passwordHash, name, createdAt, emailVerified, preferences
- **Relationships:** has many Tasks, has many Tags
- **Lifecycle:** Full CRUD with email verification, password reset, account deletion (cascades to tasks/tags)

**Task**
- **Type:** User-Generated Content | **Storage:** Backend (MongoDB)
- **Key Fields:** id, title, description, dueDate, dueTime, ownerId, status (pending/completed/archived), completedAt, reminderOffset (minutes), tags (array), recurringPatternId, createdAt, updatedAt
- **Relationships:** belongs to User, has many Tags (via array), belongs to RecurringPattern (optional)
- **Lifecycle:** Full CRUD + Mark Complete + Archive + Soft Delete (30-day retention)

**Tag**
- **Type:** Configuration | **Storage:** Backend (MongoDB)
- **Key Fields:** id, name, color (hex code), ownerId, createdAt, updatedAt
- **Relationships:** belongs to User, assigned to many Tasks
- **Lifecycle:** Full CRUD + Unassign from tasks on delete

**RecurringPattern**
- **Type:** Configuration | **Storage:** Backend (MongoDB)
- **Key Fields:** id, taskId, interval (daily/weekly/monthly), endDate (optional), lastInstanceDate, createdAt, updatedAt
- **Relationships:** belongs to Task (parent task), generates many Tasks (instances)
- **Lifecycle:** Create + View + Edit + Delete (stops future instances)

**ReminderLog**
- **Type:** System Data | **Storage:** Backend (MongoDB)
- **Key Fields:** id, taskId, sentAt, recipientEmail, status (sent/failed), errorMessage
- **Relationships:** belongs to Task
- **Lifecycle:** View + Export only (created by system, read-only for users)

### 5.2 Data Storage Strategy
- **Primary Storage:** Backend database (MongoDB) for all entities
- **Capacity:** Standard MongoDB limits (sufficient for MVP scale)
- **Persistence:** All data persists in database, accessible across devices
- **Audit Fields:** All entities include createdAt, updatedAt, createdBy (ownerId)
- **Caching:** Frontend caches task list and tags for performance, syncs on changes

---

## 6. INTEGRATION REQUIREMENTS

**Email Service (SendGrid or similar):**
- **Purpose:** Send reminder emails to users before task due times
- **Type:** Backend API calls (HTTP)
- **Data Exchange:** Sends task details (title, description, due time, link to task), receives delivery status
- **Trigger:** Scheduled job checks tasks due within next hour, sends reminders based on reminderOffset
- **Error Handling:** Log failed sends to ReminderLog, retry once after 5 minutes, notify user of persistent failures

---

## 7. VIEWS & NAVIGATION

### 7.1 Primary Views

**Dashboard** (`/`) - Upcoming tasks sorted by due date, color-coded by tags, quick stats (tasks due today, overdue, completed this week), "New Task" button

**Task List View** (`/tasks`) - All active tasks with search/filter by tag/status, sort by due date/created date, color-coded urgency indicators, create button, leads to detail view

**Task Detail View** (`/tasks/:id`) - Full task info (title, description, due date/time, tags, reminder timing, recurring pattern), edit/delete/complete actions, reminder history

**Task Form View** (`/tasks/new` or `/tasks/:id/edit`) - Create/edit form with title, description, date/time picker, tag selector, reminder timing input, recurring pattern options, save/cancel buttons

**Completed Tasks** (`/completed`) - List of completed tasks with completion timestamps, filter by date range, unmark/archive actions

**Tag Management** (`/tags`) - List of user's tags with colors, create/edit/delete tag actions, color picker (excludes purple)

**Settings** (`/settings`) - Profile management, email preferences, default reminder timing, data export, account deletion

### 7.2 Navigation Structure

**Main Nav:** Dashboard | Tasks | Completed | Tags | Settings | User Menu (profile, logout)
**Default Landing:** Dashboard (after login)
**Mobile:** Hamburger menu, responsive layout with touch-friendly buttons, swipe actions for complete/delete

---

## 8. MVP SCOPE & CONSTRAINTS

### 8.1 MVP Success Definition

The MVP is successful when:
- ✅ Users complete full task lifecycle: create, view, edit, mark complete, delete
- ✅ Email reminders sent successfully at configured times before due dates
- ✅ Recurring tasks automatically generate new instances
- ✅ Tag-based color coding displays correctly with bright, modern colors (no purple)
- ✅ Responsive design functions properly on mobile, tablet, and desktop
- ✅ Data persists across sessions and devices
- ✅ Users create average of 5+ tasks in first week
- ✅ 80% of users check app at least once daily
- ✅ 70% of tasks marked complete within 24 hours of due date

### 8.2 In Scope for MVP

Core features included:
- FR-001: User Authentication (register, login, password reset, profile management)
- FR-002: Task Management (full CRUD, list, search, archive)
- FR-003: Email Reminder Notifications (scheduled emails before due times)
- FR-004: Task Tags & Color-Coded Urgency (custom tags with colors, visual indicators)
- FR-005: Recurring Tasks (daily, weekly, monthly intervals)
- FR-006: Task Completion Tracking (mark complete, view history, statistics)

### 8.3 Technical Constraints

- **Data Storage:** Backend database (MongoDB) for users, tasks, tags, recurring patterns, reminder logs
- **Concurrent Users:** Expected 100-500 users for MVP phase
- **Performance:** Page loads <2s, task list renders <1s, email reminders sent within 1 minute of scheduled time
- **Browser Support:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** Responsive design, iOS Safari and Android Chrome support, touch-friendly interactions
- **Offline:** Not supported - requires internet connection for all operations
- **Email Delivery:** Dependent on external email service reliability (SendGrid/similar)

### 8.4 Known Limitations

**For MVP:**
- Email reminders only (no SMS or push notifications)
- Recurring patterns limited to daily, weekly, monthly (no custom intervals like "every 3 days")
- Maximum 200 active tasks per user (performance constraint)
- Maximum 20 tags per user
- Completed tasks archived after 30 days (not configurable)
- No task sharing or collaboration features
- No task attachments or file uploads
- No calendar view (list view only)
- No mobile app (web-only, responsive design)

**Future Enhancements:**
- V2 will add SMS and push notifications for reminders
- Advanced recurring patterns (custom intervals, specific days of week)
- Calendar view with drag-and-drop rescheduling
- Task sharing and collaboration
- File attachments and notes
- Mobile native apps (iOS/Android)
- Increased task limits for premium users
- Integration with calendar apps (Google Calendar, Outlook)

---

## 9. ASSUMPTIONS & DECISIONS

### 9.1 Platform Decisions
- **Type:** Full-stack web application (frontend + backend)
- **Storage:** Backend database (MongoDB) for all persistent data
- **Auth:** JWT-based authentication with email verification
- **Email:** External email service (SendGrid or similar) for reminder delivery

### 9.2 Entity Lifecycle Decisions

**Task:** Full CRUD + Archive + Mark Complete
- **Reason:** User-generated content requiring full control, soft delete for recovery, completion tracking essential for productivity app

**Tag:** Full CRUD + Unassign on delete
- **Reason:** Configuration entity users customize, hard delete acceptable as tags are lightweight and recreatable

**RecurringPattern:** Create + View + Edit + Delete (stops future instances)
- **Reason:** Configuration for task generation, editing pattern affects future instances only, deletion stops recurrence

**ReminderLog:** View + Export only
- **Reason:** System-generated audit trail, read-only for users, helps debug email delivery issues

**User:** Full CRUD + Account deletion (cascades)
- **Reason:** System entity with full user control, account deletion removes all associated data for privacy

### 9.3 Key Assumptions

1. **Users prefer email reminders over in-app notifications**
   - Reasoning: Email accessible across all devices without requiring app to be open, aligns with target user's multi-device workflow

2. **Tag-based color coding provides sufficient urgency visualization**
   - Reasoning: User-defined tags with colors allow flexible categorization (work/personal/urgent), more intuitive than system-calculated urgency scores

3. **15-minute default reminder timing is optimal**
   - Reasoning: Provides enough advance notice to prepare for task without being too early to forget again, user can customize per task

4. **Recurring tasks generate new instances automatically**
   - Reasoning: Reduces manual effort for repetitive tasks (pay rent, weekly meetings), aligns with "never miss a deadline" value proposition

5. **200 active tasks per user is sufficient for MVP**
   - Reasoning: Target users are busy but not managing enterprise-scale projects, limit ensures performance while accommodating typical use cases

### 9.4 Clarification Q&A Summary

**Q:** What specific visual theme or style do you envision for "RemindMe"?
**A:** Eye-appealing with bright colors (no purple), modern styling with animations, user-friendly and easy to use
**Decision:** UI will use bright, modern color palette excluding purple, incorporate smooth animations for interactions (task creation, completion, transitions), prioritize clean, intuitive layouts with clear visual hierarchy

**Q:** Regarding the in-app notifications, should the reminder trigger exactly at the due time, or would you like users to be able to set a "pre-reminder"?
**A:** Email notifications (not in-app), users can set reminder before time, 15 minutes default
**Decision:** Implemented email-based reminders with configurable offset per task, default 15 minutes before due time, users can customize timing during task creation/editing

**Q:** Do you need any categorization for tasks (like "Work" vs. "Personal" or Tags) for the MVP?
**A:** Yes, tags with color-coded reminder alerts based on tags
**Decision:** Implemented tag system where users create custom tags with associated colors, tags determine visual urgency indicators on tasks, multiple tags per task allowed

**Q:** Should users be able to set recurring tasks in the MVP?
**A:** Yes, recurring tasks in MVP
**Decision:** Implemented recurring task patterns (daily, weekly, monthly) that automatically generate new task instances when previous instance completed or due date passes, maintains tag and reminder settings across instances

---

**PRD Complete - Ready for Development**