import React, { useState, useEffect, useRef } from "react";
import img2 from "/img2.png?url";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import img8 from "../assets/img8.png";
import img9 from "../assets/img9.png";
import img10 from "../assets/img10.webp";
import img11 from "../assets/img11.png";
import img12 from "../assets/img12.avif";
import img13 from "../assets/img13.png";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../auth/apiClient";
import { useAuth } from "../auth/AuthProvider";
import ProfileMenu from "../components/ProfileMenu.jsx";
const Navbar = () => {
  const [menubar, Setmenubar] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        Setmenubar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu is open on mobile

  // Background freezes

  // Menu feels like a real app
  useEffect(() => {
    if (menubar && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menubar]);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const raw = localStorage.getItem("equityiq_user");
      if (!raw) {
        setUser(null);
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        const storedUser = parsed?.user;
        const expiresAt =
          parsed?.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000;
        if (!expiresAt || !storedUser || Date.now() > expiresAt) {
          localStorage.removeItem("equityiq_user");
          setUser(null);
          return;
        }
        // Fetch latest user data from backend
        try {
          const res = await api.get(
            `/auth/me?email=${encodeURIComponent(storedUser.email)}`,
          );
          if (res.data?.user) {
            setUser(res.data.user);
            // Keep the original expiresAt from login, do not reset on user fetch
            const raw = localStorage.getItem("equityiq_user");
            const parsed = raw ? JSON.parse(raw) : null;
            const expiresAt =
              parsed?.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000;
            localStorage.setItem(
              "equityiq_user",
              JSON.stringify({ user: res.data.user, expiresAt }),
            );
            return;
          }
        } catch (e) {
          // fallback to stored user if fetch fails
        }
        // fallback to stored user if fetch fails
        setUser(storedUser);
      } catch {
        localStorage.removeItem("equityiq_user");
        setUser(null);
      }
    };
    fetchAndSetUser();
    const handleUserUpdate = () => fetchAndSetUser();
    window.addEventListener("equityiq_user_updated", handleUserUpdate);
    return () =>
      window.removeEventListener("equityiq_user_updated", handleUserUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!profileOpen) return;
      if (profileMenuRef.current?.contains(event.target)) return;
      if (profileButtonRef.current?.contains(event.target)) return;
      setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const getInitial = (name) => {
    if (!name) return "?";
    const firstChar = name.trim().charAt(0);
    return firstChar ? firstChar.toUpperCase() : "?";
  };

  const { setAccessToken } = useAuth();
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // ignore errors
    }
    localStorage.removeItem("equityiq_user");
    window.dispatchEvent(new Event("equityiq_user_updated"));
    setAccessToken(null);
    // clear api client token
    try {
      const { clearAccessToken } = await import("../auth/apiClient");
      clearAccessToken();
    } catch {}
    setProfileOpen(false);
    toast.success("User logged out successfully");
  };

  const handleProfileImageClick = () => {
    if (!user) return;
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!user?.id) {
      toast.error("Please log in again to update your profile");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", user.id);

    try {
      setIsUploading(true);
      const prevRaw = localStorage.getItem("equityiq_user");
      const prevAvatar = prevRaw ? JSON.parse(prevRaw)?.user?.avatarUrl : null;

      const res = await api.put("/auth/profile-image", formData);

      if (res.data?.user) {
        // Keep the original expiresAt from login, do not reset on profile update
        const raw = localStorage.getItem("equityiq_user");
        const parsed = raw ? JSON.parse(raw) : null;
        const expiresAt =
          parsed?.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000;
        const payload = { user: res.data.user, expiresAt };
        localStorage.setItem("equityiq_user", JSON.stringify(payload));
        window.dispatchEvent(new Event("equityiq_user_updated"));
        // Re-fetch user data to ensure all fields (like balance) are up-to-date
        await fetchAndSetUser();
      }

      // On success (200) consider update done
      toast.success("Profile image updated");
      setProfileOpen(false);
    } catch (error) {
      // If backend returned an error but localStorage/user was updated, treat as success
      const rawNow = localStorage.getItem("equityiq_user");
      const newAvatar = rawNow ? JSON.parse(rawNow)?.user?.avatarUrl : null;
      if (newAvatar) {
        console.warn("Upload returned error but avatar updated locally", error);
        toast.success("Profile image updated");
        setProfileOpen(false);
      } else {
        console.error("Profile image upload failed:", error);
        toast.error(
          error.response?.data?.message || error.message || "Upload failed",
        );
      }
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleProtectedClick = (event) => {
    if (user) return;
    event.preventDefault();
    event.stopPropagation();
    toast.error("Please Signup/Login First");
  };

  const isLoggedIn = !!localStorage.getItem("equityiq_user");

  const handleSignupClick = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      toast.error("You are already Logged in. Please Logout first");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" aria-label="Go to homepage">
              <img
                src={img2}
                alt="EquityIQ logo"
                className="h-6 cursor-pointer"
              />
            </a>
          </div>

          {/* Desktop Navigation - Hidden on mobile, visible on medium screens and up */}
          <div className="hidden md:flex">
            <ul className="flex items-center gap-8 text-sm font-medium text-gray-600">
              <Link to="/signup" onClick={handleSignupClick}>
                <li className="cursor-pointer hover:text-blue-600 transition">
                  Signup
                </li>
              </Link>
              <Link to="/about">
                <li className="cursor-pointer hover:text-blue-600 transition">
                  About
                </li>
              </Link>
              <Link to="/products">
                <li className="cursor-pointer hover:text-blue-600 transition">
                  Products
                </li>
              </Link>
              <Link to="/pricing">
                <li className="cursor-pointer hover:text-blue-600 transition">
                  Pricing
                </li>
              </Link>
              <Link to="/support">
                <li className="cursor-pointer hover:text-blue-600 transition">
                  Support
                </li>
              </Link>
            </ul>
          </div>

          {/* Hamburger Menu - Always visible */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              className="text-xl cursor-pointer hover:text-blue-600 transition"
              onClick={() => Setmenubar(!menubar)}
              aria-label="Toggle menu"
            >
              {menubar ? <IoMdClose size={24} /> : <CiMenuBurger size={24} />}
            </button>
            {user && (
              <button
                ref={profileButtonRef}
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="h-9 w-9 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center cursor-pointer overflow-hidden"
                aria-label="Open profile menu"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitial(user?.name)
                )}
              </button>
            )}
          </div>

          {/* Desktop Hamburger for mega menu - Hidden on mobile, visible on medium screens and up */}
          <div className="hidden md:flex items-center gap-3">
            <button
              className="text-xl cursor-pointer hover:text-blue-600 transition"
              onClick={() => Setmenubar(!menubar)}
              aria-label="Toggle products menu"
            >
              {menubar ? <IoMdClose size={24} /> : <CiMenuBurger size={24} />}
            </button>
            {user && (
              <button
                ref={profileButtonRef}
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="h-9 w-9 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center cursor-pointer overflow-hidden"
                aria-label="Open profile menu"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitial(user?.name)
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {profileOpen && user && (
        <ProfileMenu
          user={user}
          profileMenuRef={profileMenuRef}
          onLogout={handleLogout}
          onProfileImageClick={handleProfileImageClick}
          isUploading={isUploading}
          displayName={user?.name}
        />
      )}

      {/* Mobile Menu - Full screen overlay */}
      {menubar && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white overflow-y-auto">
          <div className="px-6 py-4">
            {/* Navigation Items */}
            <ul className="space-y-4 text-sm font-medium text-gray-600">
              <Link to="/signup">
                <li className="cursor-pointer hover:text-blue-600 transition py-3 border-b border-gray-100">
                  Signup
                </li>
              </Link>
              <Link to="/about">
                <li className="cursor-pointer hover:text-blue-600 transition py-3 border-b border-gray-100">
                  About
                </li>
              </Link>
              <Link to="/products">
                <li className="cursor-pointer hover:text-blue-600 transition py-3 border-b border-gray-100">
                  Products
                </li>
              </Link>
              <Link to="/pricing">
                <li className="cursor-pointer hover:text-blue-600 transition py-3 border-b border-gray-100">
                  Pricing
                </li>
              </Link>
              <Link to="/support">
                <li className="cursor-pointer hover:text-blue-600 transition py-3">
                  Support
                </li>
              </Link>
            </ul>

            {/* Separator */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Mobile Mega Menu Grid */}
            <div className="pb-6">
              {/* Top products row */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <Link
                  to="/pulse"
                  onClick={handleProtectedClick}
                  className="text-center space-y-2 cursor-pointer"
                >
                  <img src={img8} alt="Pulse" className="h-8 mx-auto" />
                  <h3 className="font-medium text-gray-900 text-sm">Pulse</h3>
                  <p className="text-xs text-gray-500">Trading platform</p>
                </Link>

                <div
                  className="text-center space-y-2 cursor-pointer"
                  onClick={handleProtectedClick}
                >
                  <img src={img9} alt="Dashboard" className="h-8 mx-auto" />
                  <h3 className="font-medium text-gray-900 text-sm">
                    Dashboard
                  </h3>
                  <p className="text-xs text-gray-500">Backoffice</p>
                </div>

                <div
                  className="text-center space-y-2 cursor-pointer"
                  onClick={handleProtectedClick}
                >
                  <img src={img10} alt="Kite Connect" className="h-8 mx-auto" />
                  <h3 className="font-medium text-gray-900 text-sm">
                    EquityIQ Connect
                  </h3>
                  <p className="text-xs text-gray-500">Trading APIs</p>
                </div>

                <div
                  className="text-center space-y-2 cursor-pointer"
                  onClick={handleProtectedClick}
                >
                  <img src={img11} alt="WealthIQ" className="h-8 mx-auto" />
                  <h3 className="font-medium text-gray-900 text-sm">
                    WealthIQ
                  </h3>
                  <p className="text-xs text-gray-500">Mutual funds</p>
                </div>
              </div>

              {/* Bottom sections */}
              <div className="space-y-8">
                {/* Utilities */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">
                    Utilities
                  </h2>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="py-1">
                      <Link
                        className="block hover:text-blue-600 cursor-pointer"
                        to="/calculator"
                      >
                        Calculators
                      </Link>
                    </li>
                    <li className="hover:text-blue-600 cursor-pointer py-1">
                      Brokerage calculator
                    </li>
                    <li className="hover:text-blue-600 cursor-pointer py-1">
                      Margin calculator
                    </li>
                    <li className="hover:text-blue-600 cursor-pointer py-1">
                      SIP calculator
                    </li>
                  </ul>
                </div>

                {/* Updates */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">
                    Updates
                  </h2>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="hover:text-blue-600 cursor-pointer py-1">
                      EquityIQ Insights
                    </li>
                    <li className="hover:text-blue-600 cursor-pointer py-1">
                      Circulars / Bulletin
                    </li>
                    <li className="hover:text-blue-600 cursor-pointer py-1">
                      IPOs
                    </li>
                    <li className="hover:text-blue-600 cursor-pointer py-1">
                      Markets
                    </li>
                  </ul>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">
                    Education
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer py-2"
                      onClick={handleProtectedClick}
                    >
                      <img src={img12} alt="Academy" className="h-7" />
                      <h3 className="text-sm font-medium text-gray-700">
                        Academy
                      </h3>
                    </div>

                    <div
                      className="flex items-center gap-3 cursor-pointer py-2"
                      onClick={handleProtectedClick}
                    >
                      <img src={img13} alt="Trading Q&A" className="h-7" />
                      <h3 className="text-sm font-medium text-gray-700">
                        EquityIQ Circle
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Mega Menu */}
      {menubar && (
        <div className="hidden md:block fixed top-16 left-0 w-full bg-white shadow-lg border-t z-40">
          <div className="max-w-7xl mx-auto px-8 py-10">
            {/* Top products row */}
            <div className="grid grid-cols-4 gap-10 mb-12">
              <Link
                to="/pulse"
                onClick={handleProtectedClick}
                className="text-center space-y-2 cursor-pointer"
              >
                <img src={img8} alt="Pulse" className="h-10 mx-auto" />
                <h3 className="font-medium text-gray-900">Pulse</h3>
                <p className="text-sm text-gray-500">Trading platform</p>
              </Link>

              <div
                className="text-center space-y-2 cursor-pointer"
                onClick={handleProtectedClick}
              >
                <img src={img9} alt="Dashboard" className="h-10 mx-auto" />
                <h3 className="font-medium text-gray-900">Dashboard</h3>
                <p className="text-sm text-gray-500">Backoffice</p>
              </div>

              <div
                className="text-center space-y-2 cursor-pointer"
                onClick={handleProtectedClick}
              >
                <img
                  src={img10}
                  alt="EquityIQ Connect"
                  className="h-10 mx-auto"
                />
                <h3 className="font-medium text-gray-900">EquityIQ Connect</h3>
                <p className="text-sm text-gray-500">Trading APIs</p>
              </div>

              <div
                className="text-center space-y-2 cursor-pointer"
                onClick={handleProtectedClick}
              >
                <img src={img11} alt="WealthIQ" className="h-10 mx-auto" />
                <h3 className="font-medium text-gray-900">WealthIQ</h3>
                <p className="text-sm text-gray-500">Mutual funds</p>
              </div>
            </div>

            {/* Bottom sections */}
            <div className="flex">
              {/* Utilities */}
              <div className="ml-21">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Utilities
                </h2>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li>
                    <Link
                      to="/calculator"
                      className="block hover:text-blue-600 cursor-pointer"
                    >
                      Calculators
                    </Link>
                  </li>
                  <li className="hover:text-blue-600 cursor-pointer">
                    Brokerage calculator
                  </li>
                  <li className="hover:text-blue-600 cursor-pointer">
                    Margin calculator
                  </li>
                  <li className="hover:text-blue-600 cursor-pointer">
                    SIP calculator
                  </li>
                </ul>
              </div>

              {/* Updates */}
              <div className="ml-51">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Updates
                </h2>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="hover:text-blue-600 cursor-pointer">
                    EquityIQ Insights
                  </li>
                  <li className="hover:text-blue-600 cursor-pointer">
                    Circulars / Bulletin
                  </li>
                  <li className="hover:text-blue-600 cursor-pointer">IPOs</li>
                  <li className="hover:text-blue-600 cursor-pointer">
                    Markets
                  </li>
                </ul>
              </div>

              {/* Education */}
              <div className="ml-43">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Education
                </h2>
                <div className="flex gap-8">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={handleProtectedClick}
                  >
                    <img src={img12} alt="Academy" className="h-8" />
                    <h3 className="text-sm font-medium text-gray-700">
                      Academy
                    </h3>
                  </div>

                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={handleProtectedClick}
                  >
                    <img src={img13} alt="Trading Q&A" className="h-8" />
                    <h3 className="text-sm font-medium text-gray-700">
                      EquityIQ Circle
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleProfileImageChange}
      />
    </>
  );
};

export default Navbar;
