import React from "react";
import { Spinner } from "reactstrap";

const PostLoadMore = () => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <Spinner color="secondary">Loading...</Spinner>
    </div>
  );
};

export default PostLoadMore;
