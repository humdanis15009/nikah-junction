import { useState, useEffect } from "react";
import { db } from "../Firebase";
import { collection, onSnapshot } from "firebase/firestore";

function Card() {
  const [userCount, setUserCount] = useState();
  const [str, setStr] = useState();

  useEffect(() => {
    const usersCollection = collection(db, "Biodata");

    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      setUserCount(snapshot.size);
    });

    let data = 27437 + userCount;
    let strr = data.toString();
    let strrr = strr.substring(0, 2) + "," + strr.substring(2);

    setStr(strrr);

    return () => unsubscribe();
  }, [userCount]);

  return (
    <div className="flex">
      <div className="flex justify-evenly mx-auto lg:gap-x-24 gap-x-5 lg:my-20 mb-16">
        <div className="w-full gap-10 items-center leading-10">
          <div className="lg:w-[25vw] flex lg:h-[35vh] w-[100px] h-[125px] shadow-xl rounded-2xl border-t-2 justify-center items-center flex-col">
            <img
              className="lg:h-[80px] lg:w-[80px] h-[35px] w-[35px] lg:mb-3 mt-3"
              src="images/group (1).png"
              alt="members"
            />
            <span className="lg:text-4xl text-xl lg:font-extrabold font-semibold mt-2 lg:my-3">
              {str}
            </span>
            <p className="lg:text-3xl text-[11px] text-gray-600">
              No. of members
            </p>
          </div>
        </div>

        <div className="w-full px-1 gap-10 items-center">
          <div className="lg:w-[25vw] w-[100px] h-[125px] flex lg:h-[35vh] shadow-xl rounded-2xl border-t-2 justify-center items-center flex-col">
            <img
              className="lg:h-[80px] lg:w-[80px] h-[35px] w-[35px] lg:mb-3 mt-3"
              src="images/heart.png"
              alt="stories"
            />
            <span className="lg:text-4xl text-xl lg:font-extrabold font-semibold mt-2 mb-3 lg:my-3">
              5,761
            </span>
            <p className="lg:text-3xl text-[11px] mb-3 text-gray-600">
              Successful Stories
            </p>
          </div>
        </div>

        <div className="w-full gap-10 items-center leading-10  ">
          <div className="lg:w-[25vw] w-[100px] h-[125px] flex lg:h-[35vh] shadow-xl rounded-2xl border-t-2 justify-center items-center flex-col">
            <img
              className="lg:h-[80px] lg:w-[80px] h-[35px] w-[35px] lg:mb-3 mt-3"
              src="images/building.png"
              alt="cities"
            />
            <span className="lg:text-4xl text-xl lg:font-extrabold font-semibold mt-2 lg:my-3">
              150+
            </span>
            <p className="lg:text-3xl text-[11px] text-gray-600">
              Cities Presence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
