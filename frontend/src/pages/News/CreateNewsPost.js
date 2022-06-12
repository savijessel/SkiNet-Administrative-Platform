import React, { useEffect, useState, useRef } from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

const CreateNewsPost = ({ session }) => {
  const [bodyValue, setBodyValue] = useState("");
  const [titleValue, setTitleValue] = useState("");

  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [validationMessage, setValidationMessage] = useState({
    error: false,
    message: "",
  });

  const [selectedFile, setSelectedFile] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFilePicked, setIsFilePicked] = useState(false);

  const [availableTopics, setAvailableTopics] = useState([]);

  const topicSelectionRef = useRef();

  const history = useHistory();

  useEffect(() => {
    session.get("topics").then((resp) => {
      if (resp.status == 200) {
        setAvailableTopics(resp.data._embedded.topics);
      }
    });
  }, [setAvailableTopics]);

  function showError(message) {
    setValidationMessage({
      error: true,
      message: message,
    });
    setShowValidationMessage(true);
  }

  function createNewsPost() {
    if (titleValue.length == 0) {
      showError("Please enter a non-empty title!");
      return;
    }

    if (titleValue.length >= 256) {
      showError("Title length exceeds the maximum!");
      return;
    }

    if (bodyValue.length == 0) {
      showError("Post message should not be empty!");
      return;
    }

    function associateTopic(postId) {
      const topicSelection = topicSelectionRef.current.value;

      if (topicSelection !== "None") {
        const params = new URLSearchParams();
        params.append("id", postId);
        params.append("topicId", topicSelection);

        session.post(
          "posts/associateTopic" + "?" + params.toString(),
          {},
          {},
          true
        );
      }
    }

    session
      .post(
        "posts",
        {
          title: titleValue,
          body: bodyValue,
          datePublished: new Date().toISOString(),
        },
        {}
      )
      .then((response) => {
        if (response.status == 201) {
          const postId = response.data.id;
          if (isFilePicked && selectedFiles.length > 0) {
            Promise.all(
              selectedFiles.map((file) => {
                var data = new FormData();
                data.append("file", selectedFile);
                session
                  .post_with_prefix(
                    "attachments/new/" + postId,
                    data,
                    {},
                    "/public"
                  )
                  .then((res) => {
                    if (res.status != 200) {
                      setValidationMessage({
                        error: true,
                        message: "Uploads failed!",
                      });
                      setShowValidationMessage(true);
                    } else {
                      setValidationMessage({
                        error: false,
                        message: "Post creation and upload(s) successful!",
                      });
                      setShowValidationMessage(true);

                      associateTopic(postId);
                    }
                  });
              })
            );
          } else {
            setValidationMessage({
              error: false,
              message: "Post creation successful!",
            });
            setShowValidationMessage(true);

            associateTopic(postId);
          }
        } else {
          console.log(response);
        }
      })
      .catch((e) => {
        showError(JSON.stringify(e));
      });
  }

  function attachFile() {
    if (isFilePicked) {
      setSelectedFiles([...selectedFiles, selectedFile]);
    }
  }

  function changeFileHandler(e) {
    setSelectedFile(e.target.files[0]);
    setIsFilePicked(true);
  }

  const handleClose = () => setShowValidationMessage(false);
  const handleShow = () => setShowValidationMessage(true);

  return (
    <>
      <Container className="p-3">
        <Row>
          <Col>
            <h4>Draft A Post</h4>
            <InputGroup size="md" className="mb-2">
              <InputGroup.Text id="title-label">Title</InputGroup.Text>
              <FormControl
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                required
                aria-label="Large"
                aria-describedby="title-label"
              />
            </InputGroup>
            <InputGroup size="md" className="mb-2">
              <InputGroup.Text id="topic-label">Topic</InputGroup.Text>
              <Form.Select ref={topicSelectionRef}>
                <option>None</option>
                {availableTopics.map((topic) => {
                  return <option value={topic.id}>{topic.description}</option>;
                })}
              </Form.Select>
            </InputGroup>
            <ReactQuill
              theme="snow"
              value={bodyValue}
              onChange={setBodyValue}
            />
            <div class="card mt-2">
              <div class="card-body">
                <h5 class="card-title">Attachments</h5>
                <ul>
                  {selectedFiles.map((file) => {
                    return <li>{file.name}</li>;
                  })}
                </ul>
                <div class="input-group">
                  <input
                    type="file"
                    class="form-control"
                    id="inputGroupFile04"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="Upload"
                    onChange={changeFileHandler}
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    id="inputGroupFileAddon04"
                    onClick={attachFile}
                  >
                    Attach
                  </button>
                </div>
              </div>
            </div>

            <div class="d-grid gap-1 d-md-flex justify-content-md-end mt-2">
              <Link to="/news" className="btn redButton">
                Cancel
              </Link>
              <button
                class="btn navyButton"
                type="button"
                onClick={createNewsPost}
              >
                Post
              </button>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showValidationMessage} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {validationMessage.error ? "Error!" : "Success"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{validationMessage.message}</Modal.Body>
        <Modal.Footer>
          {!validationMessage.error ? (
            <button
              className="btn greyButton"
              onClick={() => {
                history.push("/news");
              }}
            >
              Close
            </button>
          ) : (
            <button className="btn greyButton" onClick={handleClose}>
              Close
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateNewsPost;
