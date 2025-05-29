import React, { memo, useCallback, useState } from "react";
import { productInfoTabs } from "../../ultils/contants";
import Votebar from "../vote/Votebar";
import { renderStarFromNumber } from "../../ultils/helper";
import { Button, Comment, VoteOption } from "..";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import { apiRating } from "../../apis";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import DOMPurify from "dompurify";

const ProductInfo = ({ totalRating, ratings, nameProduct, pid, rerender }) => {
  const [activedTab, setActivedTab] = useState(1);
  // const [payload, setPayload] = useState({
  //   comment: "",
  //   score: "",
  // });
  const { isLoggedIn } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        text: "Login to vote",
        cancelButtonText: "Cancel",
        confirmButtonText: "Go login",
        title: "Oops!",
        showCancelButton: true,
      }).then((rs) => {
        if (rs.isConfirmed) navigate(`/${path.LOGIN}`);
      });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <VoteOption
              nameProduct={nameProduct}
              handleSubmitVoteOption={handleSubmitVoteOption}
            ></VoteOption>
          ),
        })
      );
    }
  };

  const handleSubmitVoteOption = async ({ comment, score }) => {
    // console.log({ comment, score, pid });
    if (!comment || !pid || !score) {
      alert("Please vote when click submit");
      return;
    }
    await apiRating({ star: score, comment, pid, updateAt: Date.now() });
    dispatch(showModal({ isShowMOdal: false, modalChildren: null }));
    rerender();
  };
  return (
    <div className="">
      <div className="flex items-center gap-2 relative bottom-[-1px]">
        {productInfoTabs.map((e) => (
          <span
            className={`py-2 cursor-pointer rounded-t-md ${
              activedTab === +e.id
                ? "bg-white border border-b-0"
                : "bg-gray-200"
            } px-4`}
            key={e.id}
            onClick={() => setActivedTab(e.id)}
          >
            {e.name}
          </span>
        ))}
      </div>
      <div className="w-full border p-4 shadow-md rounded-b-lg rounded-r-lg">
        {/* {productInfoTabs.some((e) => e.id === activedTab) &&
          productInfoTabs.find((e) => e.id === activedTab)?.content} */}
        {productInfoTabs.some((e) => e.id === activedTab) && (
          <div className="text-sm">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  productInfoTabs.find((e) => e.id === activedTab)?.content
                ),
              }}
            ></div>
          </div>
        )}
        {/* productInfoTabs.find((e) => e.id === activedTab)?.content} */}
      </div>
      <div className="">
        <div className="flex flex-col w-main my-8 p-2 border shadow-md rounded-lg">
          <span className={`py-1 cursor-pointerbg-white px-4 font-semibold`}>
            CUSTOMER REVIEW
          </span>
          <div className="flex shadow-md rounded-lg">
            <div className="flex-4 border flex-col rounded-l-lg border-red-500 flex items-center justify-center">
              <span className="font-semibold text-3xl">{`${totalRating}/5`}</span>
              <span className="flex items-center gap-1">
                {renderStarFromNumber(totalRating)?.map((e, index) => (
                  <span key={index}>{e}</span>
                ))}
              </span>
              <span className="text-sm">{`${ratings?.length} reviewers and commentors`}</span>
            </div>
            <div className="flex-6 border rounded-r-lg p-4 flex gap-2 flex-col">
              {Array.from(Array(5).keys())
                .reverse()
                .map((e) => (
                  <Votebar
                    key={e}
                    number={e + 1}
                    ratingTotal={ratings?.length}
                    ratingCount={
                      ratings?.filter((i) => i.star === e + 1)?.length
                    }
                  ></Votebar>
                ))}
            </div>
          </div>
          <div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
            <span>Do you review this product?</span>
            <Button handleOnClick={handleVoteNow}> Vote now </Button>
          </div>
          <div className="flex flex-col gap-6">
            {ratings?.map((e) => (
              <Comment
                key={e._id}
                star={e.star}
                updateAt={e.updateAt}
                comment={e.comment}
                name={`${e.postedBy?.lastname} ${e.postedBy?.firstname}`}
              ></Comment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductInfo);
