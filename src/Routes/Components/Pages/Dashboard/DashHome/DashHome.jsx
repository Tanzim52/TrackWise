import { useContext } from 'react';
import AddReview from '../DashHome/AddReview/AddReview'
import { AuthContext } from '../../../AuthProvider/AuthProvider';

const DashHome = () => {
    const {user} = useContext(AuthContext)
    console.log(user?.email,user?.displayName.user?.photoURL)
    return (
        <div>
            Welcome to Dashboard Home

            <AddReview></AddReview>
        </div>
    );
};

export default DashHome;