# MiFi Order Management Application

A comprehensive React-based web application for managing MiFi (Mobile WiFi) and GSM Chip card orders, configurations, and inventory. This application provides a complete solution for telecommunications order management with features for GSM Chip card configuration, HLR management, batch processing, and file generation.

## 🚀 Features

### Core Functionality
- **Order Management**: Create, update, and track MiFi/GSM Chip card orders
- **GSM Chip Configuration**: Manage GSM Chip types, categories, manufacturers, prefixes, and connection types
- **HLR Management**: Configure and manage Home Location Register (HLR) settings
- **Range Management**: Handle serial number, batch number, and IMSI number ranges
- **File Generation**: Generate and process manufacturer files and OTA (Over-The-Air) files
- **Batch Processing**: Upload and process CSV files for bulk operations
- **Resource Inventory**: Track and manage resource categories and inventory

### User Interface Features
- **Dynamic Forms**: Flexible form generation based on JSON schemas
- **Dynamic Tables**: Configurable data tables with sorting, filtering, and pagination
- **Search & Filter**: Advanced search capabilities across multiple fields
- **Dashboard**: Overview of order statistics and system metrics
- **Responsive Design**: Mobile-friendly interface using Material-UI components
- **Role-based Access**: Permission-based routing and feature access
- **Internationalization**: Multi-language support with i18next

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Core UI framework
- **Vite 5.2** - Build tool and development server
- **React Router DOM 6.23** - Client-side routing
- **Redux Toolkit 2.1** - State management
- **Material-UI (MUI) 5.15** - Component library
- **React Hook Form 7.45** - Form validation and management
- **Yup 1.2** - Schema validation

### Additional Libraries
- **Axios 1.7** - HTTP client
- **date-fns / dayjs / moment** - Date manipulation
- **react-dropzone** - File upload handling
- **react-pdf** - PDF document viewing
- **jspdf** - PDF generation
- **lodash** - Utility functions
- **i18next** - Internationalization framework

## 📋 Prerequisites

- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (or yarn/pnpm)
- **Backend API**: Access to the RMS API and File Generator API services

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mifi-order-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Environment
   VITE_NODE_ENV=development

   # OAuth/SSO Configuration
   VITE_OAUTH_CLIENT_ID=your_client_id
   VITE_OAUTH_SERVICE_PROVIDER=your_service_provider
   VITE_OAUTH_URI=https://your-oauth-server.com
   VITE_OAUTH_PATH_URI=oauth2/authorize
   VITE_OAUTH_RESPONSE_TYPE=code
   VITE_OAUTH_REDIRECT_URI=http://localhost:3100/auth
   VITE_OAUTH_SCOPE=openid
   VITE_OAUTH_STATE=openid
   VITE_REDIRECT_STATE=refreshToken
   VITE_REFRESH_METHOD=token
   VITE_OAUTH_PATH_SUFFIX=oauth2

   # API Configuration
   VITE_API_URL=https://your-api-server.com
   VITE_BASE_URL=https://your-base-server.com
   VITE_APP_THEME=default

   # File Generator API
   VITE_PROD_FILE_GENERATOR_API_URL=https://prod-file-gen.com
   VITE_DEV_FILE_GENERATOR_API_URL=http://localhost:8082
   VITE_PROD_FILE_GENERATOR_WEB_SOCKET_URL=wss://prod-websocket.com
   VITE_DEV_FILE_GENERATOR_WEB_SOCKET_URL=ws://localhost:8082

   # Client Configuration
   VITE_CLIENT=mtn
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The application will start on `http://localhost:3100`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

### Clean Build Cache
```bash
npm run clean-build-cache
```

## 📁 Project Structure

```
mifi-order-management-app/
├── public/                     # Static assets
├── src/
│   ├── assets/                # Images, fonts, and icons
│   ├── auth/                  # Authentication logic
│   │   ├── AuthContext.jsx   # Auth context provider
│   │   ├── authService.js    # Auth API calls
│   │   └── utils.js          # Auth utility functions
│   ├── common/                # Reusable common components
│   │   ├── customLoader/     # Loading spinner
│   │   ├── svgIcon/          # SVG icon wrapper
│   │   ├── toastMessage/     # Toast notifications
│   │   └── visible/          # Visibility wrapper
│   ├── components/            # UI components
│   │   ├── dashboard/        # Dashboard views
│   │   ├── DynamicForm/      # Dynamic form generator
│   │   ├── dynamicTable/     # Dynamic table component
│   │   ├── header/           # Header navigation
│   │   ├── hook-form/        # React Hook Form components
│   │   ├── sideMenu/         # Sidebar navigation
│   │   ├── table/            # Custom table components
│   │   └── ...               # Other UI components
│   ├── config/               # Configuration files
│   ├── constant/             # Application constants
│   ├── contexts/             # React context providers
│   │   ├── AppInitConfigContext.jsx
│   │   ├── CompositeProvider.jsx
│   │   ├── MasterDataContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   │   ├── appConfigPage/   # App configuration
│   │   ├── rangeSettingPage/ # Range settings
│   │   ├── GSM Chip-components/   # GSM Chip management components
│   │   └── GSM ChipOrdersPage/   # GSM Chip orders page
│   ├── redux/                # Redux state management
│   │   ├── app/             # Store configuration
│   │   └── features/        # Redux slices
│   ├── routes/               # Routing configuration
│   ├── services/             # API services
│   │   ├── ApiService.js    # API endpoints
│   │   ├── auth-common.js   # Common auth functions
│   │   └── http-common.js   # HTTP client configuration
│   ├── theme/                # MUI theme configuration
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Root component
│   └── main.jsx              # Application entry point
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Authentication

The application uses OAuth 2.0 / OpenID Connect for authentication with the following flow:

1. **Authorization Code Flow**: User is redirected to OAuth provider
2. **Token Exchange**: Authorization code is exchanged for access and refresh tokens
3. **Token Refresh**: Automatic token refresh using refresh tokens
4. **Protected Routes**: Role-based access control for different features

### Session Management
- Access tokens stored in localStorage
- Automatic token refresh on expiry
- Graceful handling of 401/412 responses
- Automatic logout on token revocation

## 📊 Key Components

### GSM Chip Order Management
- Create and manage GSM Chip card orders
- Track order status and history
- Configure order parameters (category, prefix, quantity)
- Generate manufacturer files

### Configuration Management
- **GSM Chip Types**: Define different GSM Chip card types
- **GSM Chip Categories**: Categorize GSM Chip cards (e.g., MiFi, Regular)
- **GSM Chip Manufacturers**: Manage manufacturer information
- **GSM Chip Prefixes**: Configure IMSI prefixes
- **Connection Types**: Define connection types (2G, 3G, 4G, 5G)

### HLR Configuration
- Configure Home Location Register settings
- Manage HLR-batch mappings
- Set up IMSI number ranges
- Configure serial number ranges
- Handle batch number ranges

### File Operations
- **Upload**: Upload OTA out files and manufacturer ZIP files
- **Generate**: Create CSV files from JSON data
- **Download**: Export order data and configuration files
- **Process**: Bulk process CSV files for RMS system

## 🎨 UI/UX Features

- **Material Design**: Modern, clean interface using Material-UI
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme Support**: Configurable theme options
- **Loading States**: Clear loading indicators for async operations
- **Error Handling**: User-friendly error messages with toast notifications
- **Form Validation**: Real-time validation with helpful error messages
- **Search & Filter**: Advanced filtering on all data tables
- **Pagination**: Efficient data loading with pagination
- **Sorting**: Multi-column sorting on tables

## 🔧 Development

### Code Style
- ESLint configuration for code quality
- React best practices
- Component-based architecture
- Hooks-first approach

### State Management
- Redux Toolkit for global state
- React Context for feature-specific state
- Local component state for UI state

### API Integration
- Centralized API service layer
- Axios interceptors for request/response handling
- Automatic token injection
- Error handling middleware

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Error Boundaries**: React error boundaries to catch component errors
- **API Error Handling**: Centralized error handling for API calls
- **Toast Notifications**: User-friendly error messages
- **Fallback UI**: Custom error pages (404, 500)
- **Logging**: Console logging for debugging

## 🔒 Security Features

- **OAuth 2.0 Authentication**: Secure authentication flow
- **Token-based Authorization**: JWT token validation
- **HTTPS Enforcement**: Upgrade insecure requests
- **Content Security Policy**: CSP headers configured
- **XSS Protection**: X-XSS-Protection headers
- **CORS Handling**: Proper CORS configuration
- **Frame Protection**: X-Frame-Options headers

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 API Endpoints

The application integrates with the following main API endpoints:

### GSM Chip Management API (`/rms-api/api/GSM Chip-management/v1/`)
- `/GSM Chip-order` - GSM Chip order operations
- `/GSM Chip-type` - GSM Chip type management
- `/GSM Chip-category` - Category management
- `/GSM Chip-manufacturer` - Manufacturer management
- `/GSM Chip-prefix` - Prefix configuration
- `/GSM Chip-connection-type` - Connection type settings
- `/GSM Chip-hlr` - HLR configuration
- `/hlr-batch-mapping` - Batch mapping
- `/hlr-imsi-number-range` - IMSI range management
- `/hlr-serial-number-range` - Serial number ranges
- `/hlr-batch-range` - Batch number ranges

### File Generator API (`/GSM Chip-file-gen/api/file-generator/`)
- `/outfile/upload-ota-out-file/` - Upload OTA files
- `/outfile/upload-manufacturer-zip/` - Upload manufacturer files
- `/json-to-csv/convert/` - Convert JSON to CSV
- `/infile/{orderId}/` - Generate infile for order

### User Management API (`/mifi-api/mifi-order/v1/`)
- `/UserGroup/{type}` - User group information
- `/getTokenAuth/getToken` - Token exchange

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Support

For support and questions, please contact the development team or create an issue in the project repository.

## 🔄 Version History

- **v0.0.0** - Initial development version

## 📚 Additional Documentation

For more detailed documentation on specific features, please refer to:
- Authentication flow documentation
- API integration guide
- Component usage guide
- State management patterns
- Form configuration guide

---

**Note**: This application is designed for internal use within telecommunications operations. Ensure all environment variables and API endpoints are properly configured before deployment.
