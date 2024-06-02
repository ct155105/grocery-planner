import React from "react";


export default function GorceryItem({ label, children }: { label: string, children?: React.ReactNode }) {
  return (
    <div className="flex bg-gradient-to-tr from-white from-50% to-blue-500 text-slate-950 items-center p-5">
        <div className="mr-auto">
            {label}
        </div>
        <div>
            {children}
        </div>
    </div>
  );
}
