<a id="readme-top"></a>

# API/STUDENTS

This folder contains the following apis

| Method   | Endpoint                     | Description                     |
|----------|------------------------------|---------------------------------|
| `GET`    | `/api/students/term`         | Get all Term students           |
| `GET`    | `/api/students/term/:id`     | Get a single Term student       |
| `POST`   | `/api/students/term/`        | Upload Term students            |
| `GET`    | `/api/students/interim`      | Get all Interim students        |
| `GET`    | `/api/students/interim/:id`  | Get a single Interim student    |
| `POST`   | `/api/students/interim/`     | Upload Interim students         |

## Detailed Endpoint Descriptions

### Term Students

#### GET `/api/students/term`
- **Description:** Retrieves all term students with their availability slots.
- **Query Parameters:**
  - `year` (optional): Academic year (format: "2024")
  - `term_or_break` (optional): Specific term to filter ("Fall Term", "Spring Break")


#### GET `/api/students/term/:id`
- **Description:** Retrieves a single term student by ID with all their availability slots.
- **URL Parameters:**
  - `id`: The unique identifier of the student


#### POST `/api/students/term/`
- **Description:** Uploads and processes term students from an Excel file.
- **Request Body:** FormData containing:
  - `file`: Excel file with student data
  - `year`: Academic year
  - `term_or_break`: Term period identifier
- **Data Processing:**
    - [**Reminder**] The file must have the following headers otherwise it won't work:
        - Preferred Name
        - Email
        - Working
        - Jobs
        - Preferred Desk
        - Preferred Hours Per Week
        - Preferred Hours In A Row
        - Seniority
        - Assigned Shifts
        - Max Shifts
        - Date Headers: Format --> Monday 8am-10am
  1. Parses student information 
  2. Sets working status (scheduled, sub, not working)
  3. Processes availability slots from time slot columns
  4. Upserts students to database with conflict resolution on email, year, and term
  5. Creates availability slot records for each student


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Interim Students

#### GET `/api/students/interim`
- **Description:** Retrieves all interim students with their availability slots.
- **Query Parameters:**
  - `year` (optional): Academic year (format: "2024")
  - `term_or_break` (optional): Specific term to filter ("Fall Term", "Spring Break")

#### GET `/api/students/interim/:id`
- **Description:** Retrieves a single interim student by ID with all their availability slots.
- **URL Parameters:**
  - `id`: The unique identifier of the student

#### POST `/api/students/interim/`
- **Description:** Uploads and processes interim students from an Excel file.
- **Request Body:** FormData containing:
  - `file`: Excel file with student data
  - `year`: Academic year
  - `term_or_break`: Term period identifier
- **Data Processing:**
  - [**Reminder**] The file must have the following headers otherwise it won't work:
    - Preferred Name
    - Email
    - Working
    - Jobs
    - Preferred Desk
    - Preferred Hours Per Week
    - Preferred Hours In A Row
    - Seniority
    - Assigned Shifts
    - Max Shifts
    - Date Headers: Format --> Sat 3/15 8am-10am
  1. Process each student
  2. Sets working status (scheduled, sub, not working)
  3. Processes availability slots from time slot columns with specific dates
  4. Upserts students to database with conflict resolution on email, year, and term
  5. Creates availability slot records with date information for each student

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Database Schema

The student API endpoints interact with the following database tables:

### Term Students Tables
- **term_students**:
```sql
    CREATE TABLE term_students (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        preferred_name VARCHAR(255),
        email VARCHAR(255),
        isWorking boolean,
        isSub boolean,
        jobs VARCHAR(255),
        preferred_desk VARCHAR(255),
        preferred_hours_per_week INTEGER,
        preferred_hours_in_a_row INTEGER,
        seniority INT default 0,
        assigned_shifts INT DEFAULT 0,
        max_shifts INT DEFAULT 0,
        year VARCHAR(20),
        term_or_break VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_student UNIQUE (email, year, term_or_break)
    );
```
  
- **term_student_availability_slots**:
```sql
    CREATE TABLE term_student_availability_slots (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        term_student_id UUID REFERENCES term_students(id) ON DELETE CASCADE,
        day_of_week VARCHAR(10) NOT NULL,
        time_slot VARCHAR(50) NOT NULL,
        availability_status VARCHAR(50) NOT NULL,
        scheduled_status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
```

### Interim Students Tables
- **interim_students**: 
```sql
    CREATE TABLE interim_students (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        preferred_name VARCHAR(255),
        email VARCHAR(255),
        isWorking boolean,
        isSub boolean,
        jobs VARCHAR(255),
        preferred_desk VARCHAR(255),
        preferred_hours_per_week INTEGER,
        preferred_hours_in_a_row INTEGER,
        seniority INT default 0,
        assigned_shifts INT DEFAULT 0,
        max_shifts INT DEFAULT 0,
        year VARCHAR(10),
        term_or_break VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_interim_student UNIQUE (email, year, term_or_break)
    );
```
  
- **interim_student_availability_slots**:
```sql
    CREATE TABLE interim_student_availability_slots (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        student_id UUID REFERENCES interim_students(id) ON DELETE CASCADE,
        day_of_week VARCHAR(20),
        time_slot VARCHAR(50),
        date DATE, 
        availability_status VARCHAR(50),
        scheduled_status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Excel Templates

### Term Student Template

Reference the [Term Student Excel Template](/src/excels/term_students.xlsx) to ensure your data uploads correctly.

Key requirements:
- First row must contain headers exactly as specified above
- "Working" column values should be one of: "Scheduled", "Sub", "Not Working"
- Date headers must follow the format: "Monday 8am-10am"
- Multiple jobs should be separated by commas

Example:
| Preferred Name | Email                                 | Working                     | Jobs      | Preferred Desk | ... | Monday 8am-10am | Monday 10am-12pm |
|----------------|---------------------------------------|-----------------------------|-----------|----------------|-----|-----------------|------------------|
| Kasuti M       | emmanuel.k.makau.jr.26@dartmouth.edu  | Working (scheduled shifts)  | Jmc...    | Jmc            | ... | 1st Choice      | 2nd Choice       |

### Interim Student Template

Refernce the [Interim Student Excel Template](/src/excels/break_students.xlsx) to ensure your data uploads correctly.

Key requirements:
- First row must contain headers exactly as specified above
- "Working" column values should be one of: "Scheduled", "Sub", "Not Working"
- Date headers must follow the format: "Sat 3/15 8am-10am" (specific date with time slot)
- Multiple jobs should be separated by commas

Example:
| Preferred Name | Email                                 | Working                    | Jobs    | Preferred Desk | ... | Mon 3/10 8am-10am | Tue 3/11 10am-12pm |
|----------------|---------------------------------------|----------------------------|---------|----------------|-----|-------------------|--------------------|
| Kasuti M       | emmanuel.k.makau.jr.26@dartmouth.edu  | Working (scheduled shifts) |Jmc...   | Jmc            | ... | Not Available     | 2nd Choice         |

<p align="right">(<a href="#readme-top">back to top</a>)</p>