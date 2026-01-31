import React from "react";
import { Toaster } from "react-hot-toast";
import Home_page from "./landing_page/home/Home_page.jsx";
import About_page from "./landing_page/about/About_page.jsx";
import Pricing_page from "./landing_page/pricing/Pricing_page.jsx";
import Products_page from "./landing_page/products/Products_page.jsx";
import Signup_page from "./landing_page/signup/Signup_page.jsx";
import Support_page from "./landing_page/support/Support_page.jsx";
import { Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "./landing_page/Navbar.jsx";
import Footer from "./landing_page/Footer.jsx";
import Not_found from "./landing_page/Not_found.jsx";
import TermsAndConditions from "./landing_page/TermsAndConditions.jsx";
import Investor from "./landing_page/investor.jsx";
import Philosopies from "./landing_page/philosophies/Philosopies_page.jsx";
import Contact from "./contact_page/Contact.jsx";
import Privacy from "./landing_page/Privacy.jsx";
import ScrollToTop from "./landing_page/scroll.jsx";
import Calculator_page from "./calculators/Calculator_page.jsx";
import Login_page from "./login/Login_page.jsx";
import InvestorCharterPage from "./landing_page/investor_charter/Investor-charter_page.jsx";
import Disclosure from "./landing_page/disclosure.jsx";
import PulseLayout from "./Pulse/PulseLayout.jsx";
import PulseDashboard from "./Pulse/pluse_dashboard/dashboard_page.jsx";
import AccountPage from "./account_balance/account_page.jsx";
import AddAccount from "./components/AddAccount.jsx";
import Forgot_password_page from "./forgot_passwod/Forgot_password_page.jsx";
import Update_user_password from "./forgot_passwod/Update_user_password.jsx";
import Transaction_history_page from "./transaction_history/Transaction_history_page.jsx";
import Policies from "./policies/Policies.jsx";
const LandingLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);
const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Home_page />} />
          <Route path="/about" element={<About_page />} />
          <Route path="/pricing" element={<Pricing_page />} />
          <Route path="/products" element={<Products_page />} />
          <Route path="/signup" element={<Signup_page />} />
          <Route path="/support" element={<Support_page />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/investor" element={<Investor />} />
          <Route path="/philosophies" element={<Philosopies />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/calculator" element={<Calculator_page />} />
          <Route path="/login" element={<Login_page />} />
          <Route path="/investor-charter" element={<InvestorCharterPage />} />
          <Route path="/disclosure" element={<Disclosure />} />
          <Route path="/account-balance" element={<AccountPage />} />
          <Route path="/add-account" element={<AddAccount />} />
          <Route path="/forgot-password" element={<Forgot_password_page />} />
          <Route path="/add-account/transaction-history" element={<Transaction_history_page />} />
          <Route
            path="/forgot-password/update"
            element={<Update_user_password />}
          />
          <Route path="*" element={<Not_found />} />
          <Route path="/policies" element={<Policies />} />
        </Route>

        <Route path="/pulse" element={<PulseLayout />}>
          <Route index element={<PulseDashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
