import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div>
      <h1>Welcome to the E-Commerce App</h1>;
      {user ? (
        <div>
          <h2>Hello, {user?.username}!</h2>
          <p>Email: {user?.email}</p>
        </div>
      ) : (
        <p>Please log in to see your profile information.</p>
      )}
    </div>
  );
};

export default Home;
