import pluginWebc from "@11ty/eleventy-plugin-webc";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import yaml from "js-yaml";
import markdownIt from "markdown-it";
import CleanCSS from "clean-css";
import { minify } from "terser";
import { library, dom, config } from '@fortawesome/fontawesome-svg-core';
import * as fas from '@fortawesome/free-solid-svg-icons';
import * as fab from '@fortawesome/free-brands-svg-icons';
import { PurgeCSS } from 'purgecss';
import slugifyLib from "slugify";
import dotenv from 'dotenv';

dotenv.config();

library.add(fas.fas, fab.fab); 
config.autoAddCss = false;

export default function(eleventyConfig) {
    const mdLib = markdownIt({ html: true, breaks: true });
    eleventyConfig.addGlobalData("faStyles", dom.css());
 //   eleventyConfig.addGlobalData("env", {
 //       GITHUB_TOKEN: process.env.GITHUB_TOKEN,
 //       GITHUB_USER: process.env.GITHUB_USER,
 //       GITHUB_REPO: process.env.GITHUB_REPO
 //   });
    const passthroughAssets = {
        "src/assets/css": "css",
        "src/assets/css/fonts": "fonts",
        "src/assets/js": "js",
        "src/assets/img": "img",
        "src/_data/config.json": "config.json",
        "src/admin": "admin"
    };
    Object.entries(passthroughAssets).forEach(([src, dest]) => {
        eleventyConfig.addPassthroughCopy({ [src]: dest });
    });
    eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(pluginWebc, {
        components: [
            "src/_components/**/*.webc",
            "src/_includes/components/**/*.webc"
        ]
    });
    eleventyConfig.addFilter("getSpeaker", function(name, speakersList) {
    if (!name || !speakersList) return null;
    return speakersList.find(s => s.name === name);
    });
    eleventyConfig.addFilter("md", (content) => {
        if (!content) return "";
        return mdLib.render(content);
    });
    const customSlugify = (str) => {
        if (!str) return "";
        return slugifyLib(str, {
            lower: true, 
            strict: true,
            remove: /[*+~.()'"!:@]/g 
        });
    };
    eleventyConfig.addFilter("slugify", customSlugify);
    eleventyConfig.addGlobalData("slugify", () => customSlugify);
    eleventyConfig.addFilter("getSpeaker", function(name, speakersList) {
        if (!name || !speakersList) return null;
        return speakersList.find(s => s.name === name);
    });
    eleventyConfig.addFilter("cssmin", (code) => {
        if (process.env.NODE_ENV === "production" && code) {
            return new CleanCSS({}).minify(code).styles;
        }
        return code || "";
    });
    const sortedCollections = ["speakers", "events", "press"];  
    sortedCollections.forEach(name => {
        eleventyConfig.addCollection(name, function(collectionApi) {
            return collectionApi.getFilteredByTag(name).sort((a, b) => {
                return (parseInt(a.data.sort) || 0) - (parseInt(b.data.sort) || 0);
            });
        });
    });
    const iconHandler = (iconType, iconName, classNames = "") => {
        const prefix = (iconType === 'fas' || iconType === 'solid' || iconType === 'fa-solid') ? 'fas' : 'fab';
        const pascalName = iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
        const finalName = `fa${pascalName}`; 
        const iconData = (prefix === 'fas' ? fas : fab)[finalName];         
        if (!iconData) return ``;
        const [width, height, , , svgPathData] = iconData.icon;
        return `<svg aria-hidden="true" focusable="false" class="svg-inline--fa fa-${iconName} ${classNames}" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="height: 1em; vertical-align: -0.125em;"><path fill="currentColor" d="${svgPathData}"></path></svg>`;
    };
    eleventyConfig.addShortcode("icon", iconHandler);
    eleventyConfig.addJavaScriptFunction("renderIcon", iconHandler);
    eleventyConfig.addTransform("purge-css", async function(content) {
        if (process.env.NODE_ENV === "production" && this.page.outputPath && this.page.outputPath.endsWith(".html")) {
            const purgeCSSResults = await new PurgeCSS().purge({
                content: [{ raw: content, extension: 'html' }],
                css: ['_site/css/bs.css'],
                safelist: {
                    standard: [/active$/, /collaps/, /show$/, /dropdown/],
                    deep: [/svg-inline--fa/]
                }
            });
            const minifiedCSS = new CleanCSS({}).minify(purgeCSSResults[0].css).styles;
            return content.replace(/<link rel="stylesheet" href="\/css\/bs.css"[^>]*>/, `<style>${minifiedCSS}</style>`);
        }
        return content;
    });
    eleventyConfig.addJavaScriptFunction("jsmin", async function(code) {
        if (process.env.NODE_ENV === "production" && code) {
            try {
                const minified = await minify(code);
                return minified.code;
            } catch (err) {
                console.error("Terser Error:", err);
                return code;
            }
        }
        return code || "";
    });
    eleventyConfig.addTransform("htmlmin", function(content) {
        if (process.env.NODE_ENV === "production" && this.page.outputPath && this.page.outputPath.endsWith(".html")) {
            return content.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
        }
        return content;
    });
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data"
        },
        templateFormats: ["html", "md", "webc", "njk", "xml", "yaml"],
        htmlTemplateEngine: "webc",
        contentTemplateEngine: "webc",
        markdownTemplateEngine: "njk"
    };
};