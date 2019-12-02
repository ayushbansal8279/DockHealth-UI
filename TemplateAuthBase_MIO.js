import React from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const styles = makeStyles(theme => ({
  card: {
    maxWidth: 300,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  media: {
    paddingTop: "56.25%"
  },
  content: {
    textAlign: "left",
    padding: muiBaseTheme.spacing.unit * 3
  },
  divider: {
    margin: `${muiBaseTheme.spacing.unit * 3}px 0`
  },
  heading: {
    fontWeight: "bold"
  },
  subheading: {
    lineHeight: 1.8
  }
}));

class TemplateAuthBase extends React.Component {

  render() {
    return (    
      <div className="bg-image row expanded">
        {/* <div className="gradient-overlay"></div> */}
        {/* <div className="wrapper columns clip-circle"> */}

        {/* <div className="wrapper columns align-self-middle large-4 large-offset-1 medium-4 medium-offset-1 small-12"> */}
          {/* <div className="row expanded text-center">
            <div className="columns small-12">
              <img className="dock-logo" src="assets/img/dock-logo-white.png" alt="Dock Health"/>
            </div>
          </div>  */}
          {/* {this.props.children}
        </div>
        <div className="wrapper columns align-self-middle large-4 large-offset-1 medium-4 medium-offset-1 small-12">

        </div> */}
        <Container className={styles.card} maxWidth="sm">
          <Card styles={{"maxWidth": 300,
            "margin": "auto",
            transition: "0.3s",
            boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)"}}>
            {/* <CardMedia
              className={styles.media}
              image={
                "https://image.freepik.com/free-photo/river-foggy-mountains-landscape_1204-511.jpg"
              }
            /> */}
            <CardContent className={styles.content}>
              {this.props.children}
            </CardContent>
          </Card>
        </Container>

        {/* </div> */}
        {/* <div className="gradient-overlay"></div>
        <div className="wrapper columns align-self-middle large-6 large-offset-3 medium-8 medium-offset-2 small-12">
          <div className="row expanded text-center">
            <div className="columns small-12">
              <img className="dock-logo" src="assets/img/dock-logo-white.png" alt="Dock Health"/>
            </div>
          </div> 
          {this.props.children}
        </div> */}
      </div>
    );
  }
}

TemplateAuthBase.propTypes = {
  children: PropTypes.object.isRequired
};

export default TemplateAuthBase