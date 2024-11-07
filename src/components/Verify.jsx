import { useNavigate } from "react-router-dom";
import Picture from "./Picture";
import Mobile from "./Mobile";

function Verify() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Picture />
      <Mobile />
      <div className="justify-center flex">
        <button
          onClick={() => navigate(`/UserCardList`)}
          className="w-40 lg:my-6 mb-6 lg:text-xl bg-pink-700 font-semibold text-white p-1 rounded-md hover:bg-pink-600"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

export default Verify;
