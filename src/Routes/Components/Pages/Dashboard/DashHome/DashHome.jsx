import { useContext } from 'react';
import AddReview from '../DashHome/AddReview/AddReview';
import { AuthContext } from '../../../AuthProvider/AuthProvider';
import TopTasks from './TopTasks/TopTasks';
import UpReminders from './UpReminders/UpReminders';

const DashHome = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="space-y-8 px-10">
            {/* Welcome Section */}
            <div className="bg-gray-100  flex gap-5 items-center justify-start p-6 rounded-lg shadow-sm">

                <div className='w-fit'>
                    <img
                        src={user?.photoURL || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#212121] p-1"
                    />
                </div>
                <div className=''>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {user ? `Welcome back, ${user?.displayName || 'User'}! ` : 'Welcome to Dashboard!'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your account and activities from this dashboard
                    </p>
                </div>



            </div>

            {/* User Profile Section
            {user && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">

                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {user?.displayName || 'Anonymous User'}
                            </h2>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Account created via {user?.providerData?.[0]?.providerId}
                            </p>
                        </div>
                    </div>
                </div>
            )} */}


            <TopTasks></TopTasks>

            <UpReminders></UpReminders>

            <AddReview></AddReview>

        </div>
    );
};

export default DashHome;