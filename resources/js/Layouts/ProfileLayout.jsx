import React from "react";
import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
    return (
        <div
            className="min-h-screen bg-gray-50 flex flex-col font-cairo"
            dir="rtl"
        >
            <main className="grow">
                <Outlet />
            </main>
        </div>
    );
}
