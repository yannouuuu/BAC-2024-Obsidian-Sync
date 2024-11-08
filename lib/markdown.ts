import remarkCallouts from "@portaljs/remark-callouts";
import remarkEmbed from "@portaljs/remark-embed";
import matter from "gray-matter";
import { h } from "hastscript";
import mdxMermaid from "mdx-mermaid";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSmartypants from "remark-smartypants";
import remarkToc from "remark-toc";
// TODO adjust remark-wiki-link API to:
// import remarkWikiLink, { getPermalinks } from "@portaljs/remark-wiki-link";
import { getPermalinks, remarkWikiLink } from "@portaljs/remark-wiki-link";
import { serialize } from "next-mdx-remote/serialize";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";

import siteConfig from "@/config/siteConfig";

/**
 * Parse a markdown or MDX file to an MDX source form + front matter data
 *
 * @source: the contents of a markdown or mdx file
 * @format: used to indicate to next-mdx-remote which format to use (md or mdx)
 * @returns: { mdxSource: mdxSource, frontMatter: ...}
 */
const parse = async function (source, format, scope) {
  // @ts-ignore
    if (siteConfig.preProcess) {
      // @ts-ignore
        source = siteConfig.preProcess(source);
    }
    const { content, data } = matter(source);
    const permalinks = await getPermalinks(siteConfig.content);

    const mdxSource = await serialize(
        { value: content, path: format },
        {
            // Optionally pass remark/rehype plugins
            mdxOptions: {
                remarkPlugins: [
                    remarkEmbed,
                    remarkGfm,
                    [remarkSmartypants, { quotes: false, dashes: "oldschool" }],
                    remarkMath,
                    remarkCallouts,
                    [
                        remarkWikiLink,
                        { permalinks, pathFormat: "obsidian-short" },
                    ],
                    [
                        remarkToc,
                        {
                            heading: "Table of contents",
                            tight: true,
                        },
                    ],
                    [mdxMermaid, {}],
                ],
                rehypePlugins: [
                    rehypeSlug,
                    [
                        rehypeAutolinkHeadings,
                        {
                            properties: { className: "heading-link" },
                            test(element) {
                                return (
                                    ["h2", "h3", "h4", "h5", "h6"].includes(
                                        element.tagName
                                    ) &&
                                    element.properties?.id !==
                                        "table-of-contents" &&
                                    element.properties?.className !==
                                        "blockquote-heading"
                                );
                            },
                            content() {
                                return [
                                    h(
                                        "svg",
                                        {
                                            xmlns: "http:www.w3.org/2000/svg",
                                            fill: "#ab2b65",
                                            viewBox: "0 0 20 20",
                                            className: "w-5 h-5",
                                        },
                                        [
                                            h("path", {
                                                fillRule: "evenodd",
                                                clipRule: "evenodd",
                                                d: "M9.493 2.853a.75.75 0 00-1.486-.205L7.545 6H4.198a.75.75 0 000 1.5h3.14l-.69 5H3.302a.75.75 0 000 1.5h3.14l-.435 3.148a.75.75 0 001.486.205L7.955 14h2.986l-.434 3.148a.75.75 0 001.486.205L12.456 14h3.346a.75.75 0 000-1.5h-3.14l.69-5h3.346a.75.75 0 000-1.5h-3.14l.435-3.147a.75.75 0 00-1.486-.205L12.045 6H9.059l.434-3.147zM8.852 7.5l-.69 5h2.986l.69-5H8.852z",
                                            }),
                                        ]
                                    ),
                                ];
                            },
                        },
                    ],
                    [rehypeKatex, { output: "htmlAndMathml" }],
                    [rehypePrismPlus, { ignoreMissing: true }],
                ],
                format,
            },
            scope: { ...scope, ...data },
        }
    );

    return {
        mdxSource: mdxSource,
        frontMatter: data,
    };
};

export default parse;
