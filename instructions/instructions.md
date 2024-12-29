# Project Requirements Document: Car Driving Analysis Application

## 1. Overview

This document outlines the requirements for a web application that allows users to analyze their car driving data. Users will upload JSON files containing their driving records, and the application will provide insights, visualizations, and comparisons of their driving patterns.

## 2. Goals

*   Provide users with a simple way to upload and manage their car driving data.
*   Generate meaningful insights from the uploaded data, such as distance, time, average speed, etc.
*   Visualize driving routes on an interactive map with speed-based color coding.
*   Enable users to compare their driving data across different trips.

## 3. Target Audience

This application is intended for individuals who want to gain a better understanding of their driving habits and potentially improve their driving efficiency.

## 4. Core Functionalities

### 4.1 File Management

*   **4.1.1 Upload:**
    *   Users can upload one or multiple car driving data files (JSON format) simultaneously.
    *   Uploaded files are stored in an SQLite database.
    *   File metadata (name, upload date, potentially other relevant data) is also stored.
*   **4.1.2 Database Interaction:**
    *   The application will use SQLite as the database to store uploaded files and their metadata.
    *   Developers should use a suitable SQLite library for Node.js (e.g., `better-sqlite3`) to interact with the database.
*   **4.1.3 File Listing:**
    *   Users can view a list of all uploaded files.
    *   The list should display file names and potentially other relevant metadata (e.g., upload date).
*   **4.1.4 File Actions:**
    *   **Delete:** Users can delete a selected file from the database.
    *   **Download:** Users can download a selected file from the database.
    *   **View:** Users can view a raw selected file from the database.
    *   **Rename:** Users can change the name of a selected file.

### 4.2 Data Analysis

*   **4.2.1 File Selection:** Users can select a file from the list for analysis.
*   **4.2.2 Insights:** Upon selecting a file, the application will display the following insights:
    *   **Driver Name:** (Extracted from JSON data)
    *   **Tyre Type:** (Extracted from JSON data)
    *   **Driving Distance:** (Calculated from the data)
    *   **Driving Time:** (Calculated from the data)
    *   **Average Speed:** (Calculated from the data)

### 4.3 Map Visualization

*   **4.3.1 Map Display:**
    *   The application will use Leaflet to display an interactive map.
    *   The selected driving route will be plotted on the map as a line.
*   **4.3.2 Markers and Information:**
    *   Optionally, users can choose to display markers along the route.
    *   Hovering over a marker will show:
        *   Driving Distance (at that point)
        *   Driving Time (at that point)
        *   Current Speed (at that point)
*   **4.3.3 Speed-Based Coloring:**
    *   The line on the map will be color-coded based on speed changes:
        *   **Green:** Speed is increasing.
        *   **Red:** Speed is decreasing.
        *   **(Optional):** Consider using a gradient or different shades of green/red to represent the magnitude of the speed change.

### 4.4 Trip Comparison

*   **4.4.1 Selection:**
    *   Users can choose to compare the currently selected trip with a previous trip.
    *   A list of previously uploaded trips will be presented for selection.
*   **4.4.2 Comparison Insights:**
    *   The same insights as in 4.2.2 will be displayed for *both* the current and the selected comparison trip.
    *   Consider visually highlighting the differences (e.g., percentage change in distance, time, average speed).
*   **4.4.3 Speed Change Chart:**
    *   A line chart will be displayed showing the speed changes over time for both trips.
    *   The chart should clearly distinguish the two trips (e.g., different line colors or styles).
*   **4.4.4 Comparative Map View:**
    *   Both trips will be displayed on the map simultaneously, following the same visualization rules as in 4.3.
    *   Use different colors or line styles to differentiate the two trips on the map.

## 5. Technology Stack

*   **Frontend:** Next.js 14 (with App Router), Tailwind CSS, Leaflet
*   **Backend:** Next.js API Routes, SQLite
*   **Charting (Optional):**  A suitable charting library (e.g., `react-chartjs-2`, `Recharts`) for the speed comparison chart.

## 6. File Structure

```
.
├── README.md
├── app
│   ├── api
│   │   └── upload
│   │       └── route.ts      // Handles file uploads, database storage
│   ├── driving
│   │   └── [fileId]         // Dynamic route for analyzing a specific file
│   │       ├── compare      // Compare page
│   │       │   └── page.tsx
│   │       └── page.tsx     // File analysis and map display
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             // Home page, file listing, upload button
├── components
│   ├── FileList.tsx         // Component to display list of files with actions
│   ├── Map.tsx              // Leaflet map component
│   ├── Insights.tsx         // Component to display driving insights
│   ├── LineChart.tsx        // Component for speed change chart
│   └── ui                    // Shadcn/ui components
│       └── button.tsx
├── lib
│   ├── db.ts                // Database interactions (SQLite)
│   ├── utils.ts             // Utility functions (data processing, calculations, etc.)
│   └── data-processing.ts   // Functions for processing JSON and preparing data for insights/map
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public                  // Static assets
│   └── favicon.ico
├── tailwind.config.ts
└── tsconfig.json
```

## 7. Detailed Component/File Breakdown

### 7.1 `app/` (Next.js App Router)

*   **`app/api/upload/route.ts`:**
    *   **Responsibilities:**
        *   Handles `POST` requests for file uploads.
        *   Parses incoming `FormData`.
        *   Saves file content and metadata to the SQLite database using functions from `lib/db.ts`.
        *   Handles `DELETE` requests for file deletion.
        *   Handles `GET` requests for file download.
        *   Handles `PUT` requests for file name change.
    *   **Example (Conceptual):**

    ```typescript
    // In app/api/upload/route.ts
    import { processAndSaveFile } from '@/lib/data-processing';

    export async function POST(request: Request) {
      const formData = await request.formData();
      const file = formData.get('file'); 
      // ... other metadata from formData ...

      if (file) {
        await processAndSaveFile(file); // save file to db
      }
    }
    ```

*   **`app/driving/[fileId]/page.tsx`:**
    *   **Responsibilities:**
        *   Fetches data for the selected file (using `fileId` from the route parameters) from the database (using functions in `lib/db.ts`).
        *   Processes the data using functions from `lib/data-processing.ts`.
        *   Renders the `Insights` and `Map` components, passing the processed data.
        *   Conditionally renders markers on the map based on user preference.

*   **`app/driving/[fileId]/compare/page.tsx`:**
    *   **Responsibilities:**
        *   Fetches data for the selected file (`fileId`) AND the chosen comparison file.
        *   Processes both datasets using functions from `lib/data-processing.ts`.
        *   Renders the `Insights` component twice (for each trip), potentially with a comparison-focused UI.
        *   Renders the `LineChart` component with data from both trips.
        *   Renders two instances of the `Map` component (or a single map with two routes).

*   **`app/page.tsx` (Home Page):**
    *   **Responsibilities:**
        *   Contains the form or component for file uploads (calls `/api/upload`).
        *   Fetches the list of uploaded files from the database and passes it to `FileList.tsx`.

### 7.2 `components/`

*   **`components/FileList.tsx`:**
    *   **Responsibilities:**
        *   Receives the list of files (as an array of objects) as a prop.
        *   Displays the file list with file names (and other metadata).
        *   Handles user actions:
            *   **Analyze:** Navigates to `/driving/[fileId]`.
            *   **Delete:** Calls an API route (e.g., `/api/delete/[fileId]`) to delete the file.
            *   **Download:** Calls an API route (e.g., `/api/upload/`) to download the file.
            *   **View:** Calls an API route (e.g., `/api/view/[fileId]`) to view the file.
            *   **Rename:** Calls an API route (e.g., `/api/rename/[fileId]`) to rename the file.

*   **`components/Map.tsx`:**
    *   **Responsibilities:**
        *   Receives processed data (lat/lng coordinates, speed values) as a prop.
        *   Initializes and renders the Leaflet map.
        *   Plots the route as a polyline, applying color coding based on speed.
        *   Handles marker rendering and popup information on hover (if enabled).

*   **`components/Insights.tsx`:**
    *   **Responsibilities:**
        *   Receives calculated insights (driver name, distance, time, etc.) as props.
        *   Displays the insights in a user-friendly format.

*   **`components/LineChart.tsx`:**
    *   **Responsibilities:**
        *   Receives speed data for both trips as props.
        *   Renders a line chart using a charting library, clearly distinguishing the two trips' data.

### 7.3 `lib/`

*   **`lib/db.ts`:**
    *   **Responsibilities:**
        *   Provides functions to interact with the SQLite database:
            *   `insertFileData(filename, metadata, content)`
            *   `getAllFiles()`
            *   `getFileById(fileId)`
            *   `deleteFileById(fileId)`
            *   `updateFileName(fileId, newName)`
        *   Uses an SQLite library (e.g., `better-sqlite3`) to handle the low-level database operations.

*   **`lib/utils.ts`:**
    *   **Responsibilities:**
        *   Contains general utility functions:
            *   Unit conversions (e.g., km to miles)
            *   Date/time formatting
            *   Any other helper functions needed across the application.

*   **`lib/data-processing.ts`:**
    *   **Responsibilities:**
        *   `parseJSONData(jsonData)`: Parses the raw JSON data from the file.
        *   `calculateDistance(coordinates)`: Calculates the total driving distance from an array of coordinates.
        *   `calculateDrivingTime(coordinates)`: Calculates the total driving time.
        *   `calculateAverageSpeed(distance, time)`: Calculates the average speed.
        *   `calculateCurrentSpeed(coordinates, index)`: calculate current speed.
        *   `prepareMapData(coordinates, speedData)`: Transforms the data into a format suitable for `Map.tsx` (e.g., adding color data based on speed changes).
        *   `prepareInsightsData(jsonData)`: Extracts and formats data for `Insights.tsx`.
        *   `processAndSaveFile(file)`: process file and save to database.

## 8. Error Handling

*   Implement appropriate error handling in API routes (e.g., return 400 for bad requests, 500 for server errors).
*   Handle potential errors when interacting with the database or processing data.
*   Display user-friendly error messages in the UI when errors occur.

## 9. Testing

*   Write unit tests for functions in `lib/db.ts`, `lib/utils.ts`, and `lib/data-processing.ts`.
*   Consider writing integration tests for API routes and end-to-end tests for user flows.

## 10. Future Enhancements

*   **User Accounts:** Add user authentication and authorization to allow users to manage their own data securely.
*   **Advanced Analytics:** Provide more sophisticated data analysis, such as fuel efficiency calculations, driving style analysis, etc.
*   **Customization:** Allow users to customize map appearance, units, and other preferences.
*   **Live Tracking:** Explore the possibility of integrating with real-time location data for live tracking and analysis.

This detailed PRD should provide a solid foundation for your development team. Remember that communication and collaboration are key throughout the development process. Regularly review progress, address any ambiguities, and adapt the plan as needed. Good luck!
