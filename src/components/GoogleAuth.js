import React from "react";
import { signIn, signOut } from "../actions";
import { connect } from "react-redux";
import Fade from "react-reveal";
class GoogleAuth extends React.Component {
  componentDidMount() {
    try {
      this.authCall();
    } catch (e) {
      alert(e.name + ": " + e.message);
    }
  }

  authCall = () => {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId:
            "422805623031-9bh2qj3oj5k8qb2k4jvfac5pen06s308.apps.googleusercontent.com",
          scope: "email profile"
        })
        .then(() => {
          this.auth = window.gapi.auth2.getAuthInstance();
          this.onAuthChange();
          this.onAuthChange(this.auth.isSignedIn.get());
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  };

  onAuthChange = isSignedIn => {
    if (isSignedIn) {
      this.props.signIn(
        this.auth.currentUser
          .get()
          .getBasicProfile()
          .getImageUrl(),
        this.auth.currentUser
          .get()
          .getBasicProfile()
          .getName()
      );
      //this.setState({ profileUrl: this.auth.currentUser.get().getBasicProfile().getImageUrl() });
    } else {
      this.props.signOut();
    }
  };
  onSignInClick = () => {
    this.auth.signIn();
  };
  onSignOutClick = () => {
    this.auth.signOut();
  };
  renderAuthButton() {
    if (this.props.isSingedIn === null) {
    } else if (this.props.isSignedIn) {
      return (
        <button
          onClick={this.onSignOutClick}
          className="ui tiny inverted red button"
        >
          <i className="google  icon" />
          Sign Out
        </button>
      );
    } else {
      return (
        <button onClick={this.onSignInClick} className="ui red google button">
          <i className="google icon" />
          Sign In with Google
        </button>
      );
    }
  }
  renderIntro() {
    if (this.props.isSingedIn !== null) {
      return (
        <Fade>
          <div style={{ paddingTop: "10vh" }}>
            <i className="massive icons">
              <i className="circular inverted teal map  outline icon"></i>
              <i className="bottom left corner gem  red icon"></i>
            </i>
            <h1>Welcome to Maps app.</h1>
            <h3>Please log in to continue. </h3>
          </div>
          <div>{this.renderAuthButton()}</div>{" "}
        </Fade>
      );
    }
  }
  render() {
    return (
      <div>
        {this.props.isSignedIn === null && (
          <div className="ui container">
            <div className="ui large active inverted loader"></div>
          </div>
        )}

        <Fade>
          <div
            className="ui medium borderless inverted menu"
            style={{
              height: "8vh",
              padding: 0,
              margin: 0,
              borderRadius: 0,
              zIndex: 999
            }}
          >
            {this.props.isSignedIn && (
              <div className="item">
                <label className="ui red tiny label">
                  <img
                    alt={this.props.profileName}
                    className="ui right spaced avatar image"
                    src={this.props.imageUrl}
                  />
                  {this.props.profileName}
                </label>
              </div>
            )}
            <div className="right menu">
              <div className="item">{this.renderAuthButton()}</div>
            </div>
          </div>
        </Fade>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isSignedIn: state.auth.isSignedIn,
    imageUrl: state.auth.imageUrl,
    profileName: state.auth.profileName
  };
};
export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
