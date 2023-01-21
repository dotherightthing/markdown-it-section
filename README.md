# markdown-it-section

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin for subdividing content into sections.

I find this preferable to manually adding Markdown slots (see below), plus the tag can be used to inject a Vue component.

```md
// manually adding Markdown slots

::: slot name

## Heading

My content

:::
```

## Usage

### Options

| Option       | Type    | Default          | Description                                                  |
|--------------|---------|------------------|--------------------------------------------------------------|
| headingLevel | String  | "h2"             | Heading Level which signifies the start of a section         |
| sectionClass | String  | ""               | CSS class hook for styling the section                       |
| sectionTag   | String  | "ContentSection" | Tag name (or name of the Vue component, authored separately) |

### Example (Vuepress)

```js
// .vuepress/config.js

module.exports = {
  markdown: {
    extendMarkdown: md => {
      md.use(require('markdown-it-section'), {
        headingLevel: 'h2',
        sectionClass: '', 
        sectionTag: 'ContentSection'
      });
    }
  }
}
```

```vue
// .vuepress/components/ContentSection.vue (simplified example)
// Note: headingContent could be used to programmatically link the section to the contained headingLevel

<template>
  <div class="content-section" :data-heading-content="headingContent">
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    headingContent: String
  }
}
</script>
```

#### Input markdown

```md
## Heading 2.0

Lorem ipsum dolor sit amet.

## Heading 2.1

Fusce sed nisl sed urna condimentum finibus a sit amet magna.
```

#### Output HTML

```html
<div class="content-section" data-heading-content="Heading 2.0">
  <h2>Heading 2.0</h2>
  <p>Lorem ipsum dolor sit amet.</p>
</div>
<div class="content-section" data-heading-content="Heading 2.1">
  <h2>Heading 2.1</h2>
  <p>Fusce sed nisl sed urna condimentum finibus a sit amet magna.</p>
</div>
```
