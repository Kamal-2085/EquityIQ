import React from "react";

const HeroSection = ({ title, subtitle, icon, selector }) => {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-4">
      {selector ? <div className="self-start">{selector}</div> : null}
      <div className="flex items-center gap-2">
        {icon}
        <div>
          {title ? (
            <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
          ) : null}
          {subtitle ? (
            <p className="text-xs text-gray-400">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
