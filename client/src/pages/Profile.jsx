import UserProfile from "../components/UserProfile";
import './Profile.css';

function Profile({ user }) {
    if (!user) {
        return <p>Please login first.</p>;
    }

    return (
        <div className="user-profile">
            <UserProfile
                username={user.username}
                email={user.email}
                usertype={user.usertype}
                city={user.city}
            />
        </div>
    );
}
export default Profile;