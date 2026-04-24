import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const can = (permission) => {
        if (!user || !user.all_permissions) return false;
        return user.all_permissions.includes(permission);
    };

    const hasRole = (roleSlug) => {
        if (!user || !user.roles) return false;
        return user.roles.some(role => role.slug === roleSlug);
    };

    return { user, loading, can, hasRole };
};
