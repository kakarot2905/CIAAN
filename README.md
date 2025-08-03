# LinkDein - Mini LinkedIn-like Community Platform

A professional networking platform built with Next.js, Node.js, and MongoDB. Connect with professionals and share your thoughts with the community.

## Features

### 🔐 User Authentication

- **Register/Login**: Secure email and password authentication
- **Profile Management**: Name, email, and bio customization
- **JWT-based Sessions**: Secure token-based authentication

### 📝 Public Post Feed

- **Create Posts**: Share text-based posts with the community
- **Home Feed**: View all posts with author names and timestamps
- **Real-time Updates**: Posts appear immediately after creation

### 👤 Profile Pages

- **Personal Profile**: View your own profile and posts
- **User Profiles**: Visit other users' profiles and see their posts
- **Profile Information**: Display user details, bio, and join date

### 🎨 Modern UI

- **Responsive Design**: Works on desktop and mobile devices
- **Professional Styling**: Clean, modern interface with Tailwind CSS
- **Loading States**: Smooth loading indicators and error handling
- **Dark Mode**: Toggle between light and dark themes
- **Search Functionality**: Search for posts and users in real-time
- **Trending Posts**: Discover the most popular posts
- **Like System**: Like and unlike posts with real-time updates
- **Comment System**: Add comments to posts with real-time updates
- **Share Posts**: Share posts via native sharing or copy to clipboard
- **Notifications**: Real-time notification system with unread counts

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Backend**: Node.js with Express (Next.js API routes)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with HTTP-only cookies
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd linkdein
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/linkdein
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system. If using a local installation:

   ```bash
   mongod
   ```

   Or use MongoDB Atlas (cloud):

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkdein
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Getting Started

1. **Register**: Create a new account with your name, email, and password
2. **Login**: Sign in with your credentials
3. **Create Posts**: Share your thoughts with the community
4. **Explore**: View other users' profiles and posts

### Features Walkthrough

#### Authentication

- Visit `/register` to create a new account
- Visit `/login` to sign in
- Use the navigation bar to access your profile or logout

#### Creating Posts

- Once logged in, you'll see a post creation form on the home page
- Write your post (up to 500 characters)
- Click "Post" to share with the community

#### Viewing Profiles

- Click on any user's name in a post to view their profile
- Visit `/profile` to see your own profile
- Profiles show user information, bio, and all their posts

#### Navigation

- **Home**: View the main feed of all posts
- **Profile**: Access your personal profile
- **User Menu**: Logout or view your account info

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Posts

- `GET /api/posts` - Get all posts (optional: ?userId=id for user's posts)
- `POST /api/posts` - Create new post (requires authentication)
- `POST /api/posts/[id]/like` - Like/unlike a post (requires authentication)
- `GET /api/posts/trending` - Get trending posts

### Comments

- `GET /api/posts/[id]/comments` - Get comments for a post
- `POST /api/posts/[id]/comments` - Add comment to a post (requires authentication)

### Users

- `GET /api/users/[id]` - Get user profile and posts

### Search

- `GET /api/search?q=query` - Search for posts and users

### Notifications

- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/[id]/read` - Mark notification as read
- `POST /api/notifications/read-all` - Mark all notifications as read

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── posts/         # Post management
│   │   └── users/         # User profiles
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── profile/           # Profile pages
│   └── page.js            # Home page
├── components/             # React components
│   ├── Navigation.js       # Main navigation
│   ├── LoginForm.js        # Login form
│   ├── RegisterForm.js     # Registration form
│   ├── CreatePost.js       # Post creation
│   └── PostCard.js         # Individual post display
├── contexts/               # React contexts
│   └── AuthContext.js      # Authentication state
└── lib/                    # Utilities
    ├── auth.js             # API client utilities
    └── db.js               # Database connection
```

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Environment Variables

| Variable      | Description               | Default                              |
| ------------- | ------------------------- | ------------------------------------ |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/linkdein` |
| `JWT_SECRET`  | Secret key for JWT tokens | `your-secret-key`                    |

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Tokens**: Secure authentication with HTTP-only cookies
- **Input Validation**: Form validation and sanitization
- **Error Handling**: Comprehensive error handling and user feedback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on the repository.
