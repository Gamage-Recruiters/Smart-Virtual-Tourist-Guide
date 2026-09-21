import { useNavigate } from "react-router-dom";
// Import images for the logo and flag
import Logo from "../../assets/HotelOwner/logo.png";
import sriflag from "../../assets/HotelOwner/sriflag.jpg";

// Import Redux hooks and actions for state management
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice"; // Ensure this path matches your project structure

// Import the Notification Bell component to show real-time alerts
import NotificationBell from "../../components/notifications/NotificationBell";

export default function Header({ hasHotel = true }) {
  // Initialize router navigation and Redux action dispatcher
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle navigation clicks safely
  const handleNavClick = (e, path) => {
    e.preventDefault();
    // Stop navigation if the owner hasn't registered a hotel yet
    if (!hasHotel) return;
    navigate(path);
  };

  // Function to securely log out the user
  const handleLogout = () => {
    // 1. Clear authentication tokens and user data from the browser's local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    // 2. Clear the user from Redux state (this automatically disconnects the Socket.io connection)
    dispatch(logout());

    // 3. Redirect the user back to the login page
    navigate("/login");
  };

  return (
    <header
      className="bg-white/95 backdrop-blur-sm shadow-md py-2 h-28 overflow-visible"
      style={{
        borderBottom: "1px solid #F5F7FA",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div className="max-w-11xl mx-auto flex items-center justify-between h-full gap-4 px-4">
        {/* Left side: System Logo and Title */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={Logo}
            alt="Sri Lanka Tourism Logo"
            className="h-35 w-auto cursor-pointer"
            style={{ zIndex: 2, transform: "translateZ(0)" }}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700 tracking-[0.04em]">
              Smart Virtual Tourist Guide
            </p>
            <p
              className="mt-1 font-black text-2xl tracking-[0.24em] text-transparent bg-clip-text"
              style={{
                backgroundImage: `url(${sriflag})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                WebkitBackgroundClip: "text",
              }}
            >
              Sri Lanka
            </p>
          </div>
        </div>

        {/* Right side: Navigation Menu, Notification Bell, and Logout Button */}
        <div className="flex items-center gap-4">
          {/* Main Navigation Links (Hidden on small screens) */}
          <nav className="hidden lg:flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-800">
            <button
              type="button"
              onClick={(e) => handleNavClick(e, "/view-rooms-packages")}
              className={`whitespace-nowrap transition ${hasHotel ? "hover:text-sky-800 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
            >
              Add Rooms &amp; Packages
            </button>
            <button
              type="button"
              onClick={(e) => handleNavClick(e, "/view-availability-calendar")}
              className={`whitespace-nowrap transition ${hasHotel ? "hover:text-sky-800 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
            >
              Calendar
            </button>
            <button
              type="button"
              onClick={(e) => handleNavClick(e, "/manage-availability")}
              className={`whitespace-nowrap transition ${hasHotel ? "hover:text-sky-800 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
            >
              Manage Availability
            </button>
            <button
              type="button"
              onClick={(e) => handleNavClick(e, "/view-reservations")}
              className={`whitespace-nowrap transition ${hasHotel ? "hover:text-sky-800 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
            >
              View Booking
            </button>
            <button
              type="button"
              onClick={(e) => handleNavClick(e, "/financial-analysis")}
              className={`whitespace-nowrap transition ${hasHotel ? "hover:text-sky-800 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
            >
              Revenue Analyze
            </button>
          </nav>

          {/* Notification Bell Component */}
          <div className="flex items-center ml-2 mr-2">
            <NotificationBell />
          </div>

          {/* Logout Action Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
