<a id="readme-top"></a>

# API/ASSIGNMENT

This folder contains the following apis

| Method   | Endpoint                               | Description                     |
|----------|----------------------------------------|---------------------------------|
| `GET`    | `/api/assignments/term`                | Gets Term shift assignment      |
| `POST`   | `/api/assignments/term`                | Assigns Term shifts             |
|----------|----------------------------------------|---------------------------------|
| `GET`    | `/api/assignments/interim`             | Gets Interim shift assignment   |
| `POST`   | `/api/assignments/interim`             | Assigns Interim shifts          |
|----------|----------------------------------------|---------------------------------|

## Detailed Endpoint Descriptions

### Term Assigments

#### GET `/api/assignment/term`

Retrieves all term shift assignments with detailed information.

**Query Parameters:**
- `year` (optional): Academic year (format: "2024")
- `term_or_break` (optional): Specific term to filter ("Fall Term")
- `desk` (optional): Filter by specific desk name ("Jmc", "Circ)


#### POST `/api/assignment/term`

Creates a new term shift assignment with associated slots and shifts.

**Request Body:**
```json
{
    "desk_name": "string",
    "term_or_break": "string",
    "year": "string",
    "round_number": "number",
    "set_to_max_shifts": "boolean",
    "shifts_to_assign": "number",
    "consider_preferred_desk": "boolean"
}
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Interim Desks

#### GET `/api/assignment/interim`

Retrieves all interim shift assignments with detailed information.

**Query Parameters:**
- `year` (optional): Academic year (format: "2024")
- `term_or_break` (optional): Specific term to filter ("Spring Break")
- `desk` (optional): Filter by specific desk name ("Jmc", "Circ)


#### POST `/api/assignment/interim`

Creates a new interim shift assignment with detailed information.

**Request Body:**
```json
{
    "desk_name": "string",
    "term_or_break": "string",
    "year": "string",
    "round_number": "number",
    "set_to_max_shifts": "boolean",
    "shifts_to_assign": "number",
    "consider_preferred_desk": "boolean"
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Database Schema

Used the table below
- **student_assignments**:
```sql
CREATE TABLE student_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year VARCHAR(4) NOT NULL,
    term_or_break VARCHAR(50) NOT NULL,
    desk_name VARCHAR(255) NOT NULL,
    round_number INTEGER,
    set_to_max_shifts BOOLEAN DEFAULT FALSE,
    shifts_to_assign INTEGER,
    consider_preferred_desk BOOLEAN DEFAULT FALSE,
    log_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

