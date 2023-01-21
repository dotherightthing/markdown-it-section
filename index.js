/**
 * @file index.js
 * @summary markdown-it-section, based on markdown-it-gallery
 * @description A markdown-it plugin for subdividing content into sections
 * @see {@link https://github.com/markdown-it/markdown-it/issues/834#issue-1087866549} - new TokenConstructor
 * @see {@link https://github.com/markdown-it/markdown-it/issues/834#issuecomment-1001055989} - md.core.ruler.push
 * @see {@link https://github.com/markdown-it/markdown-it/issues/813#issuecomment-907311975} - state.tokens.splice
 * @see {@link https://github.com/markdown-it/markdown-it/blob/e843acc9edad115cbf8cf85e676443f01658be08/dist/markdown-it.js} - new state.Token
 */

class SectionPlugin {
    constructor(md, options) {
        this.md = md;
        this.options = Object.assign({
            headingLevel: 'h2',
            sectionClass: '',
            sectionTag: 'ContentSection',
        }, options);

        // Push new rule to the end of core chain, when all parser jobs done, but before renderer
        md.core.ruler.push('section', this.section.bind(this));
    }

    section(state) {
        const {
            headingLevel,
            sectionClass,
            sectionTag
        } = this.options;

        const tokens = state.tokens;
        const sections = [];

        tokens.forEach((token, index) => {
            if ((token.type === 'heading_open') && (token.tag === headingLevel)) {
                sections.push({
                    headingContentToken: tokens[index + 1],
                    headingOpenToken: token,
                });
            }
        });

        sections.forEach((section, index) => {
            const prevIndex = index - 1;
            const nextIndex = index + 1;

            const {
                headingContentToken,
                headingOpenToken,
            } = section;

            let insertPosition;

            const sectionTokenOpen = new state.Token('html_block', '', 0); // tag, type, nesting
            const sectionTokenClose = new state.Token('html_block', '', 0); // tag, type, nesting

            sectionTokenOpen.content = `<${sectionTag} class="${sectionClass}" headingContent="${headingContentToken.content}">`;
            sectionTokenClose.content = `</${sectionTag}>`;

            // if not first section
            if (prevIndex in sections) {
                insertPosition = state.tokens.indexOf(headingOpenToken);
                state.tokens.splice(insertPosition, 0, sectionTokenClose);
            }

            insertPosition = state.tokens.indexOf(headingOpenToken);
            state.tokens.splice(insertPosition, 0, sectionTokenOpen);

            // if last section 
            if (!(nextIndex in sections)) {
                state.tokens.push(sectionTokenClose);
            }
        });
    }
}

module.exports = (md, options = {}) => new SectionPlugin(md, options);
