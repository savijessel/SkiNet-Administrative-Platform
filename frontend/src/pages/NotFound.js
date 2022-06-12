import { Link } from "react-router-dom";
const NotFound = () => {
    return (
        <>
            <section class="py-5 text-center container">
                <div class="row py-lg-5">
                    <div class="col-lg-6 col-md-8 mx-auto">
                        <h1 class="fw-light">Page not found!</h1>
                        <p class="lead text-muted">
                            The page you are looking for does not exist. How you got here is a mystery. But you can click the button
                            below to go back to the homepage.
                        </p>
                        <p>
                            <Link to="/" class="btn btn-primary my-2">
                                Home
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default NotFound;