import React, { useEffect, useState } from "react";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";

const SinglePostPage = ({ session }) => {
  let { postId } = useParams();

  const [post, setPost] = useState({});

  const [associatedTopic, setAssociatedTopic] = useState();    

  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    session.get("posts/" + postId).then((response) => {
      if (response.status == 200) {
          setPost(response.data);

          session.get_raw(response.data._links.topic.href, {}).then((resp) => {
              if (resp.status == 200) {
                  setAssociatedTopic(resp.data.description);
              }
          });
      }
    });
  }, [setPost]);

  useEffect(() => {
    session.get("posts/" + postId + "/attachments").then((response) => {
      if (response.status == 200) {
        setAttachments(response.data._embedded.attachments);
      }
    });
  }, [setAttachments]);    

  return (
    <Container className="p-3" style={{
        minHeight: "40vh"
    }}>
      <Row>
        <Breadcrumb>
          <Breadcrumb.Item href="#" linkAs={() => <Link to="/news">All News</Link>} />
          <Breadcrumb.Item active>{post.title}</Breadcrumb.Item>
        </Breadcrumb>
      </Row>
      <Row>
        <Col>
            <h1>{post.title}</h1>
            <span>
                <small class="text-muted">{new Date(post.publishedDate).toLocaleString('en-CA', { timeZone: 'Canada/Mountain' })}</small>
                {associatedTopic !== undefined && (<small class="text-muted"> &middot; {associatedTopic}</small> || <></>)}
            </span>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
          <hr />
        </Col>
      </Row>
        {(attachments !== undefined && attachments.length > 0) ? 
         (<Row>
              <div class="card">
                  <div class="card-body">
                      <h5 class="card-title">Attachments</h5>
                      <ul>
                          {
                              attachments.map((attachment) => {
                                  return (<li><a href={session._get_base_url() + "/public/attachments/" + attachment.id }>{attachment.originalFileName}</a></li>);
                              })
                          }
                      </ul>                 
                  </div>
              </div>            
          </Row>) : <></>
        }
    </Container>
  );
};

export default SinglePostPage;
