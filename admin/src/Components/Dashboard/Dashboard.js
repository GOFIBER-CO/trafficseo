import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import DashboardItem from "./DashboardItem/DashboardItem";
import DashboardItems from "./DashboardItem/DashboardItems";
import { isMobile } from "../../utils";

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

const Dashboard = (props) => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid
        container
        direction={isMobile ? "column" : "row"}
        spacing={3}
        justifyContent="center"
      >
        <DashboardItem
          size={9}
          priority="primary"
          metric="Users"
          visual="chart"
          type="line"
        />

        <DashboardItems
          size={9}
          priority="primary"
          metric="Users"
          visual="chart"
          type="line"
        />
      </Grid>
    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
