import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../NavSideWrapper';
import { StatsCard, ProjectCard, UserCard, IssueCard, CardSection } from './Cards';

import {
    fetchTotalUsers,
    fetchActiveUsers,
    fetchNewUsers,
    fetchUsersByStatus,
    fetchUsersWithProjects,
    fetchUsersWithoutProjects,
    fetchTopUsers,
    fetchTotalProjects,
    fetchActiveProjects,
    fetchOpenProjects,
    fetchClosedProjects,
    fetchProjectsByApprovalStatus,
    fetchNewProjects,
    fetchProjectsByUser,
    fetchProjectsByModel,
    fetchProjectsWithoutUsers,
    fetchAverageProjectsPerUser,
    fetchSummary
} from '../../reduxToolkit/Slices/statsSlices';

const Dashboard = () => {
    const dispatch = useDispatch();
    const stats = useSelector(state => state.stats);

    useEffect(() => {
        // Dispatch all the fetch actions
        dispatch(fetchTotalUsers());
        dispatch(fetchActiveUsers());
        dispatch(fetchNewUsers());
        dispatch(fetchUsersByStatus());
        dispatch(fetchUsersWithProjects());
        dispatch(fetchUsersWithoutProjects());
        dispatch(fetchTopUsers());
        dispatch(fetchTotalProjects());
        dispatch(fetchActiveProjects());
        dispatch(fetchOpenProjects());
        dispatch(fetchClosedProjects());
        dispatch(fetchProjectsByApprovalStatus());
        dispatch(fetchNewProjects());
        dispatch(fetchProjectsByUser());
        dispatch(fetchProjectsByModel());
        dispatch(fetchProjectsWithoutUsers());
        dispatch(fetchAverageProjectsPerUser());
        dispatch(fetchSummary());
    }, [dispatch]);

    const {
        totalUsers,
        activeUsers,
        newUsers,
        usersWithProjects,
        topUsers,
        totalProjects,
        activeProjects,
        openProjects,
        closedProjects,
        projectsByApprovalStatus,
        loading,
        error
    } = stats;

    // Helper function to get approval status counts
    const getApprovalCounts = () => {
        if (!projectsByApprovalStatus?.projectsByApprovalStatus) return { accepted: 0, rejected: 0, pending: 0 };

        const statusData = projectsByApprovalStatus.projectsByApprovalStatus;
        return {
            accepted: statusData.find(item => item._id === 'ACCEPT')?.count || 0,
            rejected: statusData.find(item => item._id === 'REJECT')?.count || 0,
            pending: statusData.find(item => item._id === 'PENDING')?.count || 0
        };
    };

    const approvalCounts = getApprovalCounts();

    // User cards data
  const userCardsData = [
        {
            title: 'Total Users',
            count: totalUsers?.totalUsers,
            icon: 'user',
            variant: 'primary'
        },
        {
            title: 'Active Users',
            count: activeUsers?.activeUsers,
            icon: 'user-check',
            variant: 'success'
        },
        {
            title: 'Users With Projects',
            count: usersWithProjects?.usersWithProjects,
            icon: 'users',
            variant: 'secondary'
        },
        {
            title: 'New Users',
            count: newUsers?.newUsers,
            icon: 'user-plus',
            variant: 'warning'
        }
    ];

    // Project cards data
    const projectCardsData = [
        {
            title: 'Total Projects',
            count: totalProjects?.totalProjects,
            icon: 'folder',
            variant: 'primary'
        },
        {
            title: 'Approved Projects',
            count: approvalCounts.accepted,
            icon: 'check-circle',
            variant: 'success'
        },
        {
            title: 'Rejected Projects',
            count: approvalCounts.rejected,
            icon: 'x-circle',
            variant: 'error'
        },
        {
            title: 'Open Projects',
            count: openProjects?.openProjects,
            icon: 'folder-plus',
            variant: 'warning'
        },
        {
            title: 'Pending Projects',
            count: approvalCounts.pending,
            icon: 'clock',
            variant: 'default'
        },
        {
            title: 'Closed Projects',
            count: closedProjects?.closedProjects,
            icon: 'check',
            variant: 'success'
        }
    ];

    // Issues cards data
    // const issueCardsData = [
    //     {
    //         title: 'Total Reported Issues',
    //         count: 128,
    //         icon: 'exclamation-triangle',
    //         variant: 'warning'
    //     },
    //     {
    //         title: 'New Reported Issues',
    //         count: 45,
    //         icon: 'plus-circle',
    //         variant: 'error'
    //     },
    //     {
    //         title: 'Pending Issues',
    //         count: 67,
    //         icon: 'hourglass',
    //         variant: 'warning'
    //     },
    //     {
    //         title: 'Resolved Issues',
    //         count: 16,
    //         icon: 'check-double',
    //         variant: 'success'
    //     }
    // ];



    const topUsersData = topUsers?.topUsers?.slice(0, 3) || [];

    // Loading state
    if (loading) {
        return (
            <Layout>
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                    </div>
                </main>
            </Layout>
        );
    }

    // Error state
    if (error) {
        return (
            <Layout>
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error.message || 'Failed to load dashboard data'}</span>
                    </div>
                </main>
            </Layout>
        );
    }

    return (
        <Layout>
            <main className="flex-1 p-6 overflow-y-auto">
                {/* Filter Section */}
                <section className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">From Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">To Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">--Select--</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </select>
                            </div>
                            <div className="flex items-end space-x-3">
                                <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200">
                                    Apply
                                </button>
                                <button className="px-3 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors duration-200">
                                    <i className="fa fa-refresh" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Users Section */}
                <CardSection title="Users" gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {userCardsData.map((card, index) => (
                        <StatsCard
                            key={index}
                            title={card.title}
                            count={card.count}
                            icon={card.icon}
                            color={card.color}
                            loading={loading}
                        />
                    ))}
                </CardSection>

                {/* Projects Section */}
                <CardSection title="Projects" gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {projectCardsData.map((card, index) => (
                        <ProjectCard
                            key={index}
                            title={card.title}
                            count={card.count}
                            icon={card.icon}
                            color={card.color}
                            loading={loading}
                        />
                    ))}
                </CardSection>

                {/* Reported Issues Section */}
                {/* <CardSection title="Reported Issues" gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {issueCardsData.map((card, index) => (
                        <IssueCard
                            key={index}
                            title={card.title}
                            count={card.count}
                            icon={card.icon}
                            color={card.color}
                            loading={false} // Since this is dummy data
                        />
                    ))}
                </CardSection> */}

                {/* Top Users Section */}
                <CardSection title="Top Users by Project Count" gridCols="grid-cols-1 md:grid-cols-3">
                    {topUsersData.length > 0 ? (
                        topUsersData.map((user, index) => (
                            <UserCard
                                key={user._id || index}
                                user={user}
                                loading={loading}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">No top users data available</p>
                        </div>
                    )}
                </CardSection>
            </main>
        </Layout>
    );
};

export default Dashboard;
