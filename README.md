# RoomHub: Student Housing & Roommate Finder

A full-stack web application enabling university students to find roommates and housing near their campus. Built as an MVP (Minimum Viable Product) with React/Redux frontend and Django REST API backend, featuring JWT authentication, real-time messaging, image uploads, and advanced search/filtering capabilities.

## 🏠 Project Overview

RoomHub addresses the common challenge university students face when searching for off-campus housing and compatible roommates. The platform provides a streamlined experience for posting listings, browsing available rooms, connecting with potential roommates, and managing housing preferences.

**Current Status**: MVP (Minimum Viable Product) - Core functionality implemented with room for future enhancements.

## ✨ Key Features

- **User Authentication & Profiles**: JWT-based authentication with email verification and detailed user profiles
- **Room Listings**: Create, browse, and manage housing listings with image uploads
- **Real-time Messaging**: Direct communication between users through an integrated messaging system
- **Advanced Search & Filtering**: Find listings based on location, price, preferences, and amenities
- **Favorites System**: Save and organize preferred listings
- **Responsive Design**: Mobile-friendly interface built with Bootstrap
- **Image Management**: Upload and display photos for listings and user profiles

## 🛠 Tech Stack

### Frontend
- **React 18.2.0** - Modern UI framework
- **Redux** - State management with Redux Toolkit
- **React Router** - Client-side routing
- **Bootstrap** - Responsive CSS framework
- **Axios** - HTTP client for API communication

### Backend
- **Django 5.0.2** - Python web framework
- **Django REST Framework** - API development
- **JWT Authentication** - Secure token-based authentication
- **SQLite** - Database (development)
- **Pillow** - Image processing
- **Email Verification** - Account activation system

### Testing & Quality
- **Django Test Suite** - Comprehensive API testing (471+ lines)
- **React Testing Library** - Frontend component testing

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd RoomHub_Web_App
   ```

To install the dependencies, open two separate terminals (one in the "backend" directory and the other in the "frontend" directory). During the backend setup, itt is important to apply initial database migrations.

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory with your email credentials:
   ```env
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

5. **Run the Application**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   python manage.py runserver
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📁 Project Structure

```
RoomHub_Web_App/
├── backend/
│   ├── api/
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API endpoints
│   │   ├── serializers.py     # Data serialization
│   │   ├── tests.py           # Test suite
│   │   └── urls.py            # URL routing
│   ├── RoomHub/               # Django settings
│   ├── templates/             # Email templates
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── screens/           # Page components
│   │   ├── actions/           # Redux actions
│   │   ├── reducers/          # Redux reducers
│   │   └── constants/         # Application constants
│   └── package.json           # Node.js dependencies
└── README.md
```

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run backend tests
cd backend
python manage.py test

# Run frontend tests
cd frontend
npm test
```

## 🤝 Team Members & Contributors

This project was developed as part of CS-GY 6063 at NYU Tandon School of Engineering.

**Original Team:**

- Alec Pippas (Github: alecpippas)  - Backend Views, Database, Testing, Docs, SCRUM
- Faiyaad Hossain (Github: Fyd-Hssn) - Frontend Components, UI/UX, System Design
- Arthur Kumthongdee (Github: vorrapard) - Backend, Project Management, Requirements
- Jeremy Freeman (Github: jwf295) - Frontend Searh, Web Design, Testing


**Original Repository**: [Link to original team repository]

## 📋 Future Enhancements

As an MVP, this project has several areas for potential expansion:

- **Real-time Notifications**: Push notifications for new messages and listing updates
- **Advanced Matching Algorithm**: AI-powered roommate compatibility scoring
- **Payment Integration**: Secure payment processing for deposits/rent
- **Mobile App**: Native iOS/Android applications
- **Enhanced Search**: Location-based search with map integration
- **Review System**: User reviews and ratings for listings and roommates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions about this portfolio project, please reach out through my professional channels.

---

## 📋 Project Documentation

This project includes comprehensive documentation demonstrating professional software development practices:

- **Detailed Project Proposal** - Complete requirements analysis, system design, and technical specifications
- **User Stories & Use Cases** - Detailed user requirements and feature specifications  
- **Technical Architecture** - Database design, API specifications, and system architecture
- **Development Timeline** - Project planning and milestone tracking

**Documentation Files:**
- `RoomHub-Detailed Project Proposal.pdf` - Complete project specification and design document

---

**Note**: This portfolio showcases a collaborative full-stack development project with comprehensive planning and documentation. The detailed project proposal demonstrates professional software development practices including requirements analysis, system design, and technical planning.

