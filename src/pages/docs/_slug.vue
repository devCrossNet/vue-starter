<template>
  <div :class="$style.index">
    <vue-columns v-if="loading === false">
      <vue-column :width="['content', 'content', '300px']">
        <vue-box :padding="['24 null', '24 null', '32 null']" :class="$style.sidebar">
          <vue-stack>
            <vue-stack v-for="category in categories" space="null" :key="category.sys.id">
              <vue-box padding="8 16" :class="$style.category">
                <vue-text appearance="description" color="text-high" weight="semi-bold">{{ category.title }}</vue-text>
              </vue-box>

              <nuxt-link
                v-for="page in category.pagesCollection.items"
                :key="page.slug"
                :to="page.slug.includes(`${routePrefix}/`) ? page.slug : `/docs${page.slug}`"
                :class="$style.link"
                :active-class="$style.active"
                exact
              >
                <vue-text appearance="small-title">{{ page.title }}</vue-text>
              </nuxt-link>
            </vue-stack>
          </vue-stack>
        </vue-box>
      </vue-column>
      <vue-column>
        <vue-box :padding="['32 0', '32 0', '32 0', '64 0']">
          <component :is="item.component" v-for="(item, idx) in contentItems" :key="idx" v-bind="{ ...item.props }" />
        </vue-box>
      </vue-column>
    </vue-columns>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useMeta, useContext, Ref } from '@nuxtjs/composition-api';
import { useQuery, useResult } from '@vue/apollo-composable/dist';
import {
  Category,
  ContentTypeRichText,
  GetDocsPageDataQuery,
  GetDocsPageDataQueryVariables,
  Page,
} from '@/interfaces/graphql/types';
import { GetDocsPageData } from '@/graphql/DocsPage';
import VueContentTypeRichText from '@/components/organisms/contentful/VueContentTypeRichText/VueContentTypeRichText.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueStack from '@/components/layout/VueStack/VueStack.vue';
import VueText from '@/components/atoms/VueText/VueText.vue';

interface IContentItem {
  component: string;
  props: Partial<ContentTypeRichText>;
}

export default defineComponent({
  name: 'DocsPage',
  auth: false,
  components: { VueText, VueStack, VueColumn, VueColumns, VueContentTypeRichText, VueBox },
  setup() {
    const { app, route } = useContext();
    const routePrefix = computed(() => '/docs');
    const slug = computed(() => (route.value.params.slug ? `/${route.value.params.slug}` : '/'));
    const { loading, result } = useQuery<GetDocsPageDataQuery, GetDocsPageDataQueryVariables>(
      GetDocsPageData,
      { slug: slug.value, locale: app.i18n.locale },
      { clientId: 'contentful' },
    );
    const pageData: Ref<Partial<Page>> = useResult(result, null, (data) => data.pageCollection.items[0]);
    const categories: Ref<Array<Partial<Category>>> = useResult(result, null, (data) => data.categoryCollection.items);
    const pageTitle = computed<string>(() => pageData.value?.title);
    const pageDescription = computed<string>(() => pageData.value?.metaDescription);
    const contentItems = computed(() => {
      if (pageData.value?.contentCollection?.items) {
        return pageData.value.contentCollection.items.map(
          (contentItem): IContentItem => {
            const component = `Vue${contentItem.__typename}`;
            const props: IContentItem['props'] = {
              fullWidth: contentItem.fullWidth,
              text: contentItem.text,
              image: contentItem.image,
            };

            return {
              component,
              props,
            };
          },
        );
      }

      return [];
    });

    useMeta(() => ({
      title: pageTitle.value,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: pageDescription.value,
        },
      ],
    }));

    if (!pageData.value) {
      // error({ statusCode: 404, message: 'Page not Found' });
    }

    return {
      loading,
      contentItems,
      categories,
      routePrefix,
    };
  },
  head: {},
});
</script>

<style lang="scss" module>
@import '~@/assets/design-system';

.index {
  margin-top: $nav-bar-height;

  .sidebar {
    position: fixed;
    left: 0;
    width: calc(300px - #{$space-56});
    height: calc(100vh - #{$nav-bar-height});

    .category {
      border-bottom: 1px solid var(--brand-primary-border-color);
    }

    .link {
      display: inline-flex;
      align-items: center;
      padding: 0 $space-24;
      height: $space-40;
      color: var(--brand-medium-emphasis-text-color);
      text-decoration: none;

      &:hover {
        background: var(--brand-secondary-bg-color);
      }

      &.active {
        color: var(--brand-primary);
      }
    }
  }
}
</style>
