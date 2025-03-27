<a id="readme-top"></a>

# API/DESKS

This folder contains the following apis

| Method   | Endpoint                               | Description                     |
|----------|----------------------------------------|---------------------------------|
| `GET`    | `/api/desks/term`                      | Gets Term Desks                 |
| `POST`   | `/api/desks/term`                      | Creates a Term Desk             |
| `GET`    | `/api/desks/term/export`               | Exports Term Calendar           |
| `GET`    | `/api/desks/term/availableStudents`    | Get available Term Students     |
|----------|----------------------------------------|---------------------------------|
| `GET`    | `/api/desks/interim`                   | Gets Interim Desk               |
| `POST`   | `/api/desks/interim`                   | Creates a Interim Desk          |
| `GET`    | `/api/desks/interim/export`            | Exports Interim Calendar        |
| `GET`    | `/api/desks/interim/availableStudents` | Get available Interim Students  |
|----------|----------------------------------------|---------------------------------|

## Detailed Endpoint Descriptions

### Term Desks

#### GET `/api/desks/term`

Retrieves all term desk assignments with detailed information.

**Query Parameters:**
- `year` (optional): Academic year (format: "2024")
- `term_or_break` (optional): Specific term to filter ("Fall Term", "Spring Break")
- `desk` (optional): Filter by specific desk name ("Jmc", "Circ)


#### POST `/api/desks/term`

Creates a new term desk assignment with associated slots and shifts.

**Request Body:**
```json
{
    "desk_name": "string",
    "term_or_break": "string",
    "year": "string",
    "opening_time": "string",
    "closing_time": "string",
    "term_slots": [
        {
            "day_of_week": "string",
            "is_open": "boolean",
            "shifts": [
                {
                    "start_time": "string",
                    "end_time": "string",
                    "max_students": "number"
                }
            ]
        }
    ]
}
```

#### GET `/api/desks/term/export`

Exports term desk schedule as an Excel file.

**Query Parameters:**
- `year` (optional): Academic year (format: "2024")
- `term_or_break` (optional): Specific term to filter ("Fall Term", "Spring Break")
- `desk` (required): Desk name to export ("Jmc", "Circ)


#### GET `/api/desks/term/availableStudents`

Gets students available for a specific term desk shift.

**Query Parameters:**
- `shiftId` (required): ID of the term shift
- `termOrBreak` (required): Term filter (e.g., "Fall", "Spring")
- `desk` (required): Desk name filter

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Interim Desks

#### GET `/api/desks/interim`

Retrieves all interim desk assignments with detailed information.

**Query Parameters:**
- `year` (optional): Academic year (format: "2024")
- `term_or_break` (optional): Specific term to filter ("Fall Term", "Spring Break")
- `desk` (optional): Filter by specific desk name ("Jmc", "Circ")

#### POST `/api/desks/interim`

Creates a new interim desk assignment with associated slots and shifts.

**Request Body:**
```json
{
    "desk_name": "string",
    "term_or_break": "string",
    "year": "string",
    "opening_time": "string",
    "closing_time": "string",
    "interim_slots": [
        {
            "date": "string",
            "shifts": [
                {
                    "start_time": "string",
                    "end_time": "string",
                    "max_students": "number"
                }
            ]
        }
    ]
}
```

#### GET `/api/desks/interim/export`

Exports interim desk schedule as an Excel file.

**Query Parameters:**
- `year` (optional): Academic year (format: "2025")
- `term_or_break` (optional): Specific term to filter ("Fall Term", "Spring Break")
- `desk` (required): Desk name to export ("Jmc")


#### GET `/api/desks/interim/availableStudents`

Gets students available for a specific interim desk shift.

**Query Parameters:**
- `shiftId` (required): ID of the interim shift
- `termOrBreak` (required): Term break filter (e.g., "Fall Break", "Winter Break")
- `desk` (required): Desk name filter


## Integration with Students API

The desk API integrates with the student API in the following ways:
- Term and Interim desk endpoints query student availability from the student database
- The `/availableStudents` endpoints filter students based on their job preferences and availability status
- Students are assigned to shifts based on their availability status (1st or 2nd choice)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Database Schema

The student API endpoints interact with the following database tables:

### Term Desk Tables
- **term_desks**:
```sql
CREATE TABLE term_desks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    desk_name VARCHAR(255) NOT NULL,
    term_or_break VARCHAR(50) NOT NULL,
    year VARCHAR(4) NOT NULL,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(desk_name, year, term_or_break)
);
```
- **term_slots**:
```sql
CREATE TABLE term_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    desk_id UUID REFERENCES term_desks(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

- **term_shifts**:
```sql
CREATE TABLE term_shifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    term_slot_id UUID REFERENCES term_slots(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_students INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    students_detailed TEXT[] DEFAULT ARRAY['Open']
);
```

### Interim Desk Tables
- **interim_desks**:
```sql
CREATE TABLE interim_desks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    desk_name VARCHAR(255) NOT NULL,
    term_or_break VARCHAR(50) NOT NULL,
    year VARCHAR(4) NOT NULL,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(desk_name, year, term_or_break)
);
```

- **interim_slots**:
```sql
CREATE TABLE interim_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    interim_desk_id UUID REFERENCES interim_desks(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- **interim_shifts**:
```sql
CREATE TABLE interim_shifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    interim_slot_id UUID REFERENCES interim_slots(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_students INTEGER NOT NULL DEFAULT 1,
    students_detailed TEXT[] DEFAULT ARRAY['Open'],
    student_assign_details TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Test Payloads

### Term Request Payload

Reference the [Term Student Payload Example](/src/test/term_desk_payloads.ts) to match the expected term desk payload.

### Interim Request Payload

Refernce the [Interim Student Payload Example](/src/test/interim_desk_payload.ts) to match the expected interim desk payload.


<p align="right">(<a href="#readme-top">back to top</a>)</p>