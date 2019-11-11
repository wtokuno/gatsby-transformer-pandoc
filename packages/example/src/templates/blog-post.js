import React from "react";
import { graphql } from "gatsby";
// import Layout from "../components/layout";
import { PropTypes } from "prop-types";

const BlogPost = ({ data }) => {
  const post = data.markdownPandoc;
  return (
    // <Layout>
    <div>
      {/* <h1>{post.frontmatter.title}</h1> */}
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
    // </Layout>
  );
};
BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownPandoc: PropTypes.shape({
      html: PropTypes.string.isRequired
    })
  })
};
export default BlogPost;

export const query = graphql`
  query($slug: String!) {
    markdownPandoc(fields: { slug: { eq: $slug } }) {
      html
      fileAbsolutePath
    }
  }
`;
