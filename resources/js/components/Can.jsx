import React from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Component to conditionally render content based on permissions.
 * Usage: <Can permission="paper.create"> <button>Create Paper</button> </Can>
 */
const Can = ({ permission, children, fallback = null }) => {
    const { can, loading } = useAuth();

    if (loading) return null;

    return can(permission) ? children : fallback;
};

export default Can;
