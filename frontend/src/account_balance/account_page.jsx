import React from "react";
import Left from "./left.jsx";
import Right from "./right.jsx";

const AccountPage = () => {
  return (
    <section className="w-full flex justify-center py-20">
      <div className="w-full max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Left />
          <Right />
        </div>
      </div>
    </section>
  );
};

export default AccountPage;
