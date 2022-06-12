import React, { useState, useEffect, useContext } from "react";
import FilterContext from "./ReportFilterContext";
export default function ReportLakeLouiseRoles({ session }) {
  // const [allSelected, setAllSelected] = useState(false);
  // const [checked, setChecked] = useState([
  //   false, // 0 - Active
  //   false, // 1 - CISMTeamMember
  //   false, // 2 - APL
  //   false, // 3 - HL
  //   false, // 4 - New_User
  //   false, // 5 - On-Snow Evaluator
  //   false, // 6 - Orienteer
  //   false, // 7 - P0 Lead
  //   false, // 8 - PL
  //   false, // 9 - Recruitment Lead
  //   false, // 10 - Training Event Lead
  // ]);

  const [state, setState] = useContext(FilterContext);

  const roles = [
    "cismTeamMember",
    "pl",
    "apl",
    "hl",
    "active",
    "newUser",
    "trainingEventLead",
    "onSnowEvaluator",
    "orienteerer",
    "recruitmentLead",
    "p0Lead",
  ];

  const prettyRoles = [
    "CISM Team Member",
    "Patrol Leader",
    "Active Patrol Leader",
    "HL",
    "Active User",
    "New User",
    "Training Event Lead",
    "On-Snow Evaluator",
    "Orienteer",
    "Recruitment Lead",
    "P0/Lead",
  ];

  // useEffect(() => {
  //   let allChecked = true;
  //   for (const inputName in checked) {
  //     if (checked[inputName] === false) {
  //       allChecked = false;
  //     }
  //   }
  //   if (allChecked) {
  //     setAllSelected(true);
  //   } else {
  //     setAllSelected(false);
  //   }
  // }, [checked]);

  return (
    <>
      <div class="card">
        <a
          class="card-header btn "
          data-bs-toggle="collapse"
          href="#LLRoles"
          role="button"
          aria-expanded="false"
          aria-controls="LLRoles"
        >
          Lake Louise Roles
        </a>

        <div class="collapse" id="LLRoles">
          <div class="card-body">
            <form>
              <div class="form-check">
                <div class="row row-cols-2"></div>
                <div class="row row-cols-2">
                  {roles.map((row, index) => (
                    <div class="col">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="nr1"
                        onChange={() => {
                          if (state[row]) {
                            state[row] = null;
                          } else if (state[row] === null) {
                            state[row] = true;
                          }
                          setState((state) => ({
                            ...state,
                          }));
                          console.log(state[row], row, "aqeqwrt");
                        }}
                        checked={state[row] === null ? false : true}
                        id="selectRoles"
                      />
                      <label>{prettyRoles[index]}</label>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
