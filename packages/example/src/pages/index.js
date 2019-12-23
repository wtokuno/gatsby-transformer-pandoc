import React from "react";
import { graphql } from "gatsby";
import { PropTypes } from "prop-types";

const Index = ({ data }) => {
  return (
    <ul>
      {data.allMarkdownPandoc.edges.map(({ node }) => (
        <li key={node.id}>
          <a href={node.fields.slug}>{node.fileAbsolutePath}</a>
        </li>
      ))}
    </ul>
  );
};
Index.propTypes = {
  data: PropTypes.shape({
    allMarkdownPandoc: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string.isRequired,
            fileAbsolutePath: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired
            })
          })
        })
      )
    })
  })
};
export default Index;

export const query = graphql`
  query {
    allMarkdownPandoc {
      edges {
        node {
          id
          fileAbsolutePath
          fields {
            slug
          }
        }
      }
    }
  }
`;
