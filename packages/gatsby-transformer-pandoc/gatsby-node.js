const typeDefs = `
  type MarkdownPandoc implements Node @infer @childOf(mimeTypes: ["text/markdown", "text/x-markdown"]) {
    id: ID!
  }
`;

exports.createSchemaCustomization = (nodeApiArgs, pluginOptions = {}) => {
  const { plugins = [] } = pluginOptions;

  nodeApiArgs.actions.createTypes(typeDefs);

  plugins.forEach(plugin => {
    const resolvedPlugin = require(plugin.resolve);
    if (typeof resolvedPlugin.createSchemaCustomization === `function`) {
      resolvedPlugin.createSchemaCustomization(
        nodeApiArgs,
        plugin.pluginOptions
      );
    }
  });
};

exports.onCreateNode = async (
  {
    node,
    loadNodeContent,
    actions,
    createNodeId,
    reporter,
    createContentDigest
  },
  pluginOptions
) => {
  console.log(pluginOptions);
  const { createNode, createParentChildLink } = actions;

  // We only care about markdown content.
  if (
    node.internal.mediaType !== `text/markdown` &&
    node.internal.mediaType !== `text/x-markdown`
  )
    return {};

  const content = await loadNodeContent(node);

  try {
    const markdownNode = {
      id: createNodeId(`${node.id} >>> MarkdownPandoc`),
      children: [],
      parent: node.id,
      internal: {
        content: content,
        type: `MarkdownPandoc`
      }
    };

    if (node.internal.type === `File`) {
      markdownNode.fileAbsolutePath = node.absolutePath;
    }

    markdownNode.internal.contentDigest = createContentDigest(markdownNode);

    createNode(markdownNode);
    createParentChildLink({ parent: node, child: markdownNode });

    return markdownNode;
  } catch (err) {
    reporter.panicOnBuild(
      `Error processing Markdown ${
        node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`
      }:\n
      ${err.message}`
    );

    return {};
  }
};

exports.setFieldsOnGraphQLNodeType = async (
  { type, basePath, cache },
  pluginOptions
) => {
  if (type.name !== `MarkdownPandoc`) return {};

  // const {} = pluginOptions;

  const pluginsCacheStr = pluginOptions.plugins.map(p => p.name).join(``);
  const pathPrefixCacheStr = basePath || ``;
  const htmlCacheKey = node =>
    `transformer-pandoc-markdown-html-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`;

  async function getHTML(markdownNode) {
    const cachedHTML = await cache.get(htmlCacheKey(markdownNode));
    if (cachedHTML) {
      return cachedHTML;
    } else {
      const { spawnSync } = require("child_process");
      const args = ["--filter=pandoc-citeproc"];
      console.log(process.cwd());
      const res = spawnSync("pandoc", args, {
        cwd: process.cwd(),
        env: process.env,
        encoding: "utf8",
        input: markdownNode.internal.content
      });

      return res.stdout;
    }
  }

  return {
    html: {
      type: `String`,
      resolve(markdownNode) {
        return getHTML(markdownNode);
      }
    }
  };
};
