<template>
  <component :is="fullWidth ? 'div' : 'VueContentBlock'" :class="$style.vueContentTypeRichText">
    <vue-image v-if="image" :src="image.url" :alt="image.title" />

    <RichTextRenderer :document="text.json" :node-renderers="renderNodes()" />
  </component>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import RichTextRenderer from 'contentful-rich-text-vue-renderer';
import VueContentBlock from '@/components/layout/VueContentBlock/VueContentBlock.vue';
import VueText from '@/components/atoms/VueText/VueText.vue';
import { Asset, ContentTypeRichTextText, Maybe } from '@/interfaces/graphql/types';
import VueImage from '@/components/atoms/VueImage/VueImage.vue';

export default defineComponent({
  name: 'VueContentTypeRichText',
  components: { RichTextRenderer, VueContentBlock, VueText, VueImage },
  props: {
    routePrefix: { type: String, default: '/docs' },
    fullWidth: { type: Boolean, default: false },
    text: { type: Object as () => Maybe<ContentTypeRichTextText>, default: null },
    image: { type: Object as () => Maybe<Asset>, default: null },
  },
  setup(props) {
    return {
      renderNodes() {
        const renderHeadline = (node: any, key: string, h: any, next: any, level = 1) => {
          const appearance = `h${level}`;

          return h(
            'vue-text',
            { props: { appearance, as: appearance, color: 'text-high' } },
            next(node.content, key, h, next),
          );
        };

        return {
          [BLOCKS.PARAGRAPH]: (node: any, key: string, h: any, next: any) =>
            h('vue-text', { props: { as: 'p' } }, next(node.content, key, h, next)),
          [BLOCKS.HEADING_1]: (node: any, key: string, h: any, next: any) => renderHeadline(node, key, h, next, 1),
          [BLOCKS.HEADING_2]: (node: any, key: string, h: any, next: any) => renderHeadline(node, key, h, next, 2),
          [BLOCKS.HEADING_3]: (node: any, key: string, h: any, next: any) => renderHeadline(node, key, h, next, 3),
          [BLOCKS.HEADING_4]: (node: any, key: string, h: any, next: any) => renderHeadline(node, key, h, next, 4),
          [BLOCKS.HEADING_5]: (node: any, key: string, h: any, next: any) => renderHeadline(node, key, h, next, 5),
          [BLOCKS.HEADING_6]: (node: any, key: string, h: any, next: any) => renderHeadline(node, key, h, next, 6),
          [BLOCKS.UL_LIST]: (node: any, key: string, h: any, next: any) =>
            h('ul', {}, next(node.content, key, h, next)),
          [BLOCKS.OL_LIST]: (node: any, key: string, h: any, next: any) =>
            h('ol', {}, next(node.content, key, h, next)),
          [BLOCKS.LIST_ITEM]: (node: any, key: string, h: any, next: any) =>
            h('vue-text', { props: { as: 'li' } }, next(node.content, key, h, next)),
          [BLOCKS.QUOTE]: (node: any, key: string, h: any, next: any) => {
            return h(
              'vue-text',
              { props: { appearance: 'large-title', color: 'text-low', serifs: true, as: 'div' }, class: 'quote' },
              next(node.content, key, h, next),
            );
          },
          [INLINES.HYPERLINK]: (node: any, key: string, h: any, next: any) => {
            const href = node.data.uri;
            const isExternal = href.includes('://');
            const includesRoot = href.includes(`${props.routePrefix}/`);

            if (isExternal) {
              return h('a', { attrs: { href, target: '_blank' } }, next(node.content, key, h, next));
            }

            return h(
              'nuxt-link',
              { props: { to: includesRoot ? href : `/docs${href}` } },
              next(node.content, key, h, next),
            );
          },
        };
      },
    };
  },
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.vueContentTypeRichText {
  text-align: center;

  :global {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    img {
      margin-bottom: $space-24;
    }

    p {
      margin-bottom: $space-32;
    }

    ul,
    ol {
      margin-bottom: $space-24;
      display: inline-block;

      li {
        p {
          margin-bottom: 0;
        }
      }
    }

    .quote {
      padding: $space-32;
      border-left: $space-4 solid var(--brand-low-emphasis-text-color);
    }

    hr {
      margin: $space-32 0;
    }
  }
}
</style>
