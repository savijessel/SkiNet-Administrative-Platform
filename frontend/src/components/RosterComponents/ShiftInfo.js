import React, { useEffect } from "react";
import ClockIcon from "../../images/Clock.png";
import LocationIcon from "../../images/Location.png";
import PersonHoldingFlagOnMountainIcon from "../../images/PersonHoldingFlagOnMountain.png";
import AvatarCheckMarkIcon from "../../images/AvatarCheckMark.png";
import OneAvatarIcon from "../../images/OneAvatar.png";
import LetterPMultipleAvatarsIcon from "../../images/LetterPMultipleAvatars.png";
import LetterTMultipleAvatarsIcon from "../../images/LetterTMultipleAvatars.png";

const ShiftInfo = ({ currentShift, shiftInfo }) => {
  //will update calendar if the Add Roster Modal changes
  useEffect(() => {}, [currentShift, shiftInfo]);

  return (
    <>
      {currentShift && shiftInfo ? (
        <>
          <div className="Bullet">
            {" "}
            <h3>
              {/* <img
                className="Shift_info_image"
                src={ClockIcon}
                alt="ClockImage"
              /> */}
              {/* Title:{" "} */}
              <b>{currentShift && shiftInfo ? shiftInfo.event_name : ""}</b>
            </h3>
          </div>
          <div className="Bullet">
            {" "}
            <img
              className="Shift_info_image"
              src={ClockIcon}
              alt="ClockImage"
            />
            Date: {currentShift && shiftInfo ? shiftInfo.startStr : ""}
          </div>
          <div className="Bullet">
            {" "}
            <img
              className="Shift_info_image"
              src={OneAvatarIcon}
              alt="OneAvatarImage"
            />
            Min Patrollers Required:{" "}
            {currentShift && shiftInfo ? shiftInfo.min_pat : ""}
          </div>
          <div className="Bullet">
            {" "}
            <img
              className="Shift_info_image"
              src={LetterPMultipleAvatarsIcon}
              alt="LetterPMultipleAvatarsImage"
            />
            Max Patrollers Allowed:{" "}
            {currentShift && shiftInfo ? shiftInfo.max_pat : ""}
          </div>
          <div className="Bullet">
            {" "}
            <img
              className="Shift_info_image"
              src={LetterTMultipleAvatarsIcon}
              alt="LetterTMultipleAvatarsImage"
            />
            Max Trainees Allowed:{" "}
            {currentShift && shiftInfo ? shiftInfo.max_trainee : ""}
          </div>
        </>
      ) : (
        <h4>Select an Event to edit</h4>
      )}
    </>
  );
};

export default ShiftInfo;
