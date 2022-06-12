import React, { useState, useEffect, useContext } from "react";
import FilterContext from "./ReportFilterContext";
import $ from "jquery";

export default function ReportPatrolUniformAndEquipment({ session }) {
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [state, setState] = useContext(FilterContext);
  const [uniformLeaseSigned, setUniformLeaseSigned] = useState(false);
  const [uniformReturned, setUniformReturned] = useState(false);

  useEffect(() => {
    session.get("brands").then((resp) => {
      if (resp.status === 200) {
        setBrands(resp.data._embedded.brands);
      }
    });

    session.get("sizes").then((resp) => {
      if (resp.status === 200) {
        setSizes(resp.data._embedded.sizes);
      }
    });

    session.get("conditionses").then((resp) => {
      if (resp.status === 200) {
        setConditions(resp.data._embedded.conditionses);
      }
    });
  }, []);

  useEffect(() => {
    /// JACKET
    $("#jacketBrandSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        jacketBrand: selected === "-1" ? null : selected,
      }));
    });

    $("#jacketSizeSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        jacketSize: selected === "-1" ? null : selected,
      }));
    });

    $("#jacketConditionSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        jacketCondition: selected === "-1" ? null : selected,
      }));
    });

    $("#jacketNumberSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        jacketNumber: selected === "" ? null : selected,
      }));
    });

    //PACK
    $("#packNumberSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        packNumber: selected === "" ? null : selected,
      }));
    });

    $("#packBrandSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        packBrand: selected === "-1" ? null : selected,
      }));
    });

    $("#packConditionSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        packCondition: selected === "-1" ? null : selected,
      }));
    });

    //VEST
    $("#vestBrandSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        vestBrand: selected === "-1" ? null : selected,
      }));
    });

    $("#vestSizeSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        vestSize: selected === "-1" ? null : selected,
      }));
    });

    $("#vestConditionSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        vestCondition: selected === "-1" ? null : selected,
      }));
    });

    $("#vestNumberSelect").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        vestNumber: selected === "" ? null : selected,
      }));
    });
  }, []);

  return (
    <>
      <div class="card">
        <a
          class="card-header btn "
          data-bs-toggle="collapse"
          href="#PatUnifAndEquip"
          role="button"
          aria-expanded="false"
          aria-controls="PatUnifAndEquip"
        >
          Patrol Uniform and Equipment
        </a>
        <div class="collapse" id="PatUnifAndEquip">
          <div class="card-body">
            <div class="card">
              <button
                class="card-header btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#jacket"
                aria-expanded="false"
                aria-controls="jacket"
              >
                Jacket
              </button>

              <div class="collapse" id="jacket">
                <div class="card-body">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Brand
                      </label>
                    </div>

                    <select class="form-select" id="jacketBrandSelect">
                      <option selected value="-1">
                        -
                      </option>
                      {brands.map((row, index) => (
                        <option value={row.description}>
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Size
                      </label>
                    </div>

                    <select class="form-select" id="jacketSizeSelect">
                      <option selected value="-1">
                        -
                      </option>
                      {sizes.map((row, index) => (
                        <option value={row.description}>
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Condition
                      </label>
                    </div>

                    <select class="form-select" id="jacketConditionSelect">
                      <option selected value="-1">
                        -
                      </option>
                      {conditions.map((row, index) => (
                        <option value={row.description}>
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="jacketNumberSelect">
                        Number
                      </label>
                    </div>
                    <input
                      class="text-center form-control"
                      type="number"
                      id="jacketNumberSelect"
                      min="-1"
                      placeholder="-"
                      data-bind="value:numberSelect"
                    ></input>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <button
                class="card-header btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#pack"
                aria-expanded="false"
                aria-controls="pack"
              >
                Pack
              </button>

              <div class="collapse" id="pack">
                <div class="card-body">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Brand
                      </label>
                    </div>

                    <select class="form-select" id="packBrandSelect">
                      <option selected value="-1">
                        -
                      </option>
                      {brands.map((row, index) => (
                        <option value={row.description}>
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Condition
                      </label>
                    </div>

                    <select class="form-select" id="packConditionSelect">
                      <option selected value="-1">
                        -
                      </option>
                      {conditions.map((row, index) => (
                        <option value={row.description}>
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="packNumberSelect">
                        Number
                      </label>
                    </div>
                    <input
                      class="text-center form-control"
                      type="number"
                      id="packNumberSelect"
                      min="-1"
                      placeholder="-"
                      data-bind="value:numberSelect"
                    ></input>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <button
                class="card-header btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#vest"
                aria-expanded="false"
                aria-controls="vest"
              >
                Vest
              </button>
              <div class="collapse" id="vest">
                <div class="card-body">
                  <div class="input-group mt-3 mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Brand
                      </label>
                    </div>

                    <select class="form-select" id="vestBrandSelect">
                      <option selected value="-1">
                        -
                      </option>
                      {brands.map((row, index) => (
                        <option value={row.description}>
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Size
                      </label>
                    </div>

                    <select class="form-select" id="vestSizeSelect">
                      <option selected value="-1">
                        -
                      </option>
                      {sizes.map((row, index) => (
                        <option value={row.description}>
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Condition
                      </label>
                    </div>

                    <select class="form-select" id="vestConditionSelect">
                      <option selected value="-1">
                        -
                      </option>
                      {conditions.map((row, index) => (
                        <option value={row.description}>
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="vestNumberSelect">
                        Number
                      </label>
                    </div>
                    <input
                      class="text-center form-control"
                      type="number"
                      id="vestNumberSelect"
                      min="-1"
                      placeholder="-"
                      data-bind="value:numberSelect"
                    ></input>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-check">
              <div class="row row-cols-1">
                <div class="col">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="nr1"
                    onChange={() => {
                      setUniformLeaseSigned(!uniformLeaseSigned);
                      if (uniformLeaseSigned) {
                        setState({ ...state, uniformLeaseSigned: null });
                      } else {
                        setState({ ...state, uniformLeaseSigned: true });
                      }
                    }}
                    checked={uniformLeaseSigned}
                    id="uniformLeased"
                  />
                  <label>Uniform Lease Signed</label>
                </div>
              </div>
            </div>
            <div class="form-check">
              <div class="row row-cols-1">
                <div class="col">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="nr1"
                    id="uniformReturned"
                    onChange={() => {
                      setUniformReturned(!uniformReturned);
                      if (uniformReturned) {
                        setState({ ...state, uniformReturned: null });
                      } else {
                        setState({ ...state, uniformReturned: true });
                      }
                    }}
                    checked={uniformReturned}
                  />
                  <label>Uniform Returned</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
