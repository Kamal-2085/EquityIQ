import React from "react";
import { Link } from "react-router-dom";

const ProfileMenu = ({
  user,
  profileMenuRef,
  onLogout,
  onProfileImageClick,
  isUploading,
  displayName,
}) => {
  const getInitial = (name) => {
    if (!name) return "?";
    const firstChar = name.trim().charAt(0);
    return firstChar ? firstChar.toUpperCase() : "?";
  };

  const name = user?.name || "User";
  const email = user?.email || "";
  const avatarFallback = displayName || name;

  return (
    <div
      ref={profileMenuRef}
      className="fixed right-4 top-16 z-50 w-72 rounded-xl border border-gray-200 bg-white shadow-xl"
    >
      <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center overflow-hidden">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            getInitial(avatarFallback)
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500 mt-1">{email}</p>
        </div>
      </div>

      <div className="py-2">
        <Link
          to="/account-balance"
          className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
        >
          <span>Account Balance</span>
          <span className="text-gray-900 font-medium">₹0</span>
        </Link>
        <button
          type="button"
          onClick={onProfileImageClick}
          disabled={isUploading}
          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Update profile Image"}
        </button>
        <button
          type="button"
          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          24 x 7 Customer Support
        </button>
        <button
          type="button"
          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Update KYC
        </button>
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onLogout}
          className="text-sm font-medium text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
