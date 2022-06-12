import React, { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  Pagination,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";

import { Link, useHistory } from "react-router-dom";

const NewsBulletinPage = ({ session }) => {
  const [posts, setPosts] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const [availableTopics, setAvailableTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState();

  const history = useHistory();

  const searchRef = React.createRef();

  const [searchState, setSearchState] = useState(false);

  const POSTS_PER_PAGE = 5;

  useEffect(() => {
    session.get("topics").then((resp) => {
      if (resp.status == 200) {
        const topics = resp.data._embedded.topics;
        topics.sort((a, b) => {
          return a.sequence > b.sequence ? 1 : -1;
        });
          setAvailableTopics(topics);          
          topics.forEach(function (item, index) {
              if (item.description === "News / Announcements") {
                  selectTopic(item.id);
              }
          });          

      }
    });
  }, [setAvailableTopics]);

  function getPosts() {
    session
      .get("posts/search/findAllByOrderByPublishedDateDesc", {
        size: POSTS_PER_PAGE,
        page: currentPage,
      })
      .then((resp) => {
        if (resp.status == 200) {
          setPosts(resp.data._embedded.posts);
          setPageCount(resp.data.page.totalPages);
        }
      });
  }

  useEffect(() => {
    getPosts();
  }, [setPosts, currentPage]);

  function performSearch() {
      if (searchRef.current.value.trim().length == 0) return;

      setSelectedTopic(undefined);

      setSearchState(true);
      const searchTerms = searchRef.current.value.split(" ");

      const searchPayload = JSON.stringify(searchTerms);

      session.post("posts/search", searchPayload, {}, true).then((response) => {
          if (response.status == 200) {
              setPosts(response.data);
          }
      });
  }

  function cancelSearch() {
    searchRef.current.value = "";
    setSearchState(false);
    getPosts();
  }

  function truncateParagraph(text, maximumLength) {
    if (text.length <= maximumLength) {
      return text;
    }

    const subString = text.substr(0, maximumLength - 1);
    return subString.substr(0, subString.lastIndexOf(" ")) + "...";
  }

  function selectTopic(id) {
    if (selectedTopic === id) {
      setSelectedTopic(undefined);
      getPosts();
    } else {
      setSelectedTopic(id);
      session.get("topics/" + id + "/post").then((resp) => {
        if (resp.status == 200) {
          setPosts(resp.data._embedded.posts);
        }
      });
    }
  }

  function showPagination() {
    return !searchState && selectedTopic === undefined;
  }

  return (
    <>
      <nav class="navbar navbar-light bg-light sticky-top">
        <div class="container">
          <form class="d-flex">
            <InputGroup className="me-2" on>
              <FormControl
                ref={searchRef}
                placeholder="Search query..."
                aria-label="Search"
                aria-describedby="search-btn"
                required={true}
                onKeyDown={(e) => {
                  if (e.code == "Enter") {
                    e.preventDefault();
                    performSearch();
                  }
                }}
              />
              <Button
                variant="outline-secondary"
                id="search-btn"
                onClick={performSearch}
              >
                Search
              </Button>
            </InputGroup>
          </form>

          {session.session_data() !== null &&
            session.session_data().user_type === "SYSTEM_ADMIN" && (
              <Link to="/news/create" className="btn greyButton">
                Draft Post
              </Link>
            )}
        </div>
      </nav>
      <Container className="p-3">
        <Row>
          {!searchState ? (
            <Col xs={2}>
              <h4>Topics</h4>
              <ListGroup>
                {availableTopics.map((topic) => {
                  return (
                    <ListGroup.Item
                      className="py-1"
                      key={topic.id}
                      action
                      active={topic.id === selectedTopic}
                      onClick={() => selectTopic(topic.id)}
                    >
                      {topic.description}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Col>
          ) : (
            <></>
          )}
          <Col>
            <h4>
              {searchState ? (
                <>
                  Search Results{" "}
                  <small onClick={cancelSearch}>
                    <a href="#">Cancel Search</a>
                  </small>{" "}
                </>
              ) : (
                <></>
              )}{" "}
            </h4>
            {posts.map((post) => (
              <Card className="mb-2">
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {new Date(post.publishedDate).toLocaleString('en-CA', { timeZone: 'Canada/Mountain' })}
                  </Card.Subtitle>
                  <a
                    onClick={() => {
                      history.push("/news/view/" + post.id);
                    }}
                    className="btn stretched-link btn-sm navyButton"
                  >
                    Read more
                  </a>
                </Card.Body>
              </Card>
            ))}

            {showPagination() ? (
              <Pagination>
                <Pagination.Prev
                  disabled={currentPage == 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
                {[...Array(pageCount).keys()].map((page) => {
                  return (
                    <Pagination.Item
                      key={page}
                      active={currentPage == page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page + 1}
                    </Pagination.Item>
                  );
                })}
                <Pagination.Next
                  disabled={currentPage == pageCount - 1}
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </Pagination>
            ) : (
              <>
                <hr />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NewsBulletinPage;
