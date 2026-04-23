import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

export default function ProfileLayout() {
    // We wrap ProfileLayout inside MainLayout to keep the header/footer
    // but we can add specific profile styling here if needed
    return (
        <div className="min-h-screen" style={{ background: '#f0fafa' }} dir="rtl">
            <main className="container mx-auto py-10 px-4">
                <Outlet />
            </main>
        </div>
    );
}
