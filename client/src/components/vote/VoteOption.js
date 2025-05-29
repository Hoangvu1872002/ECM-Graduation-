import React, { memo, useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import { voteOptions } from "../../ultils/contants";
import icons from "../../ultils/icons";
import Button from "../buttons/Button";

const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {
  const { BiSolidStar } = icons;
  const modalRef = useRef();
  const [choosenScore, setChoosenScore] = useState();
  const [comment, setComment] = useState();

  useEffect(() => {
    modalRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={modalRef}
      className="bg-white w-[700px] p-4 gap-4 flex flex-col items-center justify-center rounded-lg"
    >
      <img
        src={logo}
        alt="logo"
        className="w-[300px] my-8 object-contain"
      ></img>
      <h2 className="text-center text-medium text-lg">{`Voting product ${nameProduct}`}</h2>
      <textarea
        className="form-textarea w-full placeholder:text-sm placeholder:text-gray-500 text-sm"
        placeholder="Type something ....."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <div className="w-full flex flex-col gap-4 ">
        <p>How do you like this product?</p>
        <div className="flex items-center justify-center gap-4">
          {voteOptions.map((e) => (
            <div
              className=" bg-gray-200 hover:bg-gray-300 cursor-pointer p-4 rounded-md h-[60px] w-[60px] flex items-center justify-center flex-col gap-2"
              key={e.id}
              onClick={() => setChoosenScore(e.id)}
            >
              {Number(choosenScore) && choosenScore >= e.id ? (
                <BiSolidStar color="orange"></BiSolidStar>
              ) : (
                <BiSolidStar color="gray"></BiSolidStar>
              )}
              {/* <span>{e.text}</span> */}
            </div>
          ))}
        </div>
      </div>
      <Button
        fw
        handleOnClick={() =>
          handleSubmitVoteOption({ comment, score: choosenScore })
        }
      >
        Submit
      </Button>
    </div>
  );
};

export default memo(VoteOption);
