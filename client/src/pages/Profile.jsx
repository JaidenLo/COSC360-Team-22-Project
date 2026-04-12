import UserProfile from "../components/UserProfile";
import './Profile.css';

function Profile({ user }) {
    if (!user) {
        return <p>Please login first.</p>;
    }

    return (
        <div className="user-profile">
            <UserProfile
                userId={user._id}
                username={user.username}
                email={user.email}
                usertype={user.usertype}
                city={user.city}
                aboutMe={user.aboutMe}

            />
        </div>
    );
}
export default Profile;