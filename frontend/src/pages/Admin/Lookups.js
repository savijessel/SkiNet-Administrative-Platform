import React, { useState, useEffect } from "react";
import "./Lookups.css";
import JacketBrandLookup from "./JacketBrandLookup.js";
import JacketSizeLookup from "./JacketSizeLookup.js";
import AwardLookup from "./AwardLookup.js";
import DisciplineLookup from "./DisciplineLookup.js";
import SeasonLookup from "./SeasonLookup.js";
import OperationalEventLookup from "./OperationalEventLookup";
import ConditionsLookup from "./ConditionsLookup";
import AreaLookup from "./AreaLookup";
import { Button, Modal } from "react-bootstrap";

const AdminLookupsPage = ({ session }) => {
  const [hasError, setHasError] = useState(false);
  return (
    <>
      <div className="container">
        <div className="row">
          <JacketBrandLookup session={session} error={setHasError} />
          <AwardLookup session={session} error={setHasError} />
          <DisciplineLookup session={session} error={setHasError} />
        </div>

        <div className="row">
          <SeasonLookup session={session} error={setHasError} />
          <JacketSizeLookup session={session} error={setHasError} />
          <OperationalEventLookup session={session} error={setHasError} />
        </div>

        <div className="row">
          <ConditionsLookup session={session} error={setHasError} />
          <AreaLookup session={session} error={setHasError} />
        </div>
      </div>
      <Modal
        show={hasError}
        onHide={() => {
          setHasError(false);
        }}
      >
        <Modal.Header className="modal-error" closeButton>
          <Modal.Title>Delete Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-error">
          <p class="text-danger"></p>
          One or more of the selected items is being by one or more users.
          Please delete these items from the users first.
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdminLookupsPage;
