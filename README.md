# Demo
[Visit the Demo](https://the-transporter-inky.vercel.app)

![Transporter UI Demo](/transporter.gif)

**Dashboard data is produced by the Transpoter Telemetry iOS app. See details: [Transpoter Telemetry](https://github.com/denizardaslan/transporter-telemetry)**

# The Transporter - Car Driving Analysis Application

A modern web application that helps users analyze and visualize their car driving data through interactive maps, insights, and trip comparisons.

## Features

- 📤 **File Management**
  - Upload multiple driving data files (JSON format)
  - View, download, rename, and delete uploaded files
  - SQLite database storage for efficient data management

- 📊 **Data Analysis**
  - Comprehensive driving insights including:
    - Driver information
    - Tyre type
    - Driving distance
    - Total time
    - Average speed
  - Interactive route visualization on maps
  - Speed-based color coding for route segments

- 🗺️ **Map Visualization**
  - Interactive maps powered by Leaflet
  - Route plotting with speed-based color coding
    - Green: Speed increasing
    - Red: Speed decreasing
  - Optional markers with detailed information on hover

- 📈 **Trip Comparison**
  - Compare two trips side by side
  - Visual comparison of driving metrics
  - Speed change charts
  - Simultaneous route display on map

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Leaflet
- **Backend**: Next.js API Routes
- **Database**: SQLite
- **Charts**: React charting library for speed comparisons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/the-transporter.git
cd the-transporter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── driving/          # Dynamic routes for analysis
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── FileList.tsx      # File management
│   ├── Map.tsx          # Map visualization
│   ├── Insights.tsx     # Data insights
│   └── ui/              # UI components
├── lib/                  # Utility functions
│   ├── db.ts            # Database operations
│   ├── utils.ts         # Helper functions
│   └── data-processing.ts # Data processing logic
└── public/              # Static assets
```

## API Routes

- `POST /api/upload` - Upload new driving data files
- `GET /api/upload` - Download a file
- `DELETE /api/upload` - Delete a file
- `PUT /api/upload` - Rename a file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Leaflet for the mapping capabilities
- All contributors who help improve this project

# the-transporter-ios
https://github.com/denizardaslan/transporter-telemetry
