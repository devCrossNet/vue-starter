/* tslint:disable */
import { storiesOf } from '@storybook/vue';
import { withInfo } from 'storybook-addon-vue-info';
import VueMarkdown from '../../components/VueMarkdown/VueMarkdown.vue';
import BrandColors from './components/BrandColors.vue';
import ColorPalette from './components/ColorPalette.vue';

let story = storiesOf('1. Design System|1. Design System', module) as any;

story.addParameters({ options: { showAddonPanel: false } });

story.add(
  'Intro',
  withInfo({
    header: false,
    source: false,
    propTables: false,
    styles: { propTableHead: { display: 'none' } },
    propTablesExclude: [VueMarkdown],
  })(() => ({
    components: { VueMarkdown },
    template: `<vue-markdown>
# Design System

Vuesion comes with a Design System that you can 100% customize.

**_The files for customizing the Design System are located in \`./src/app/shared/design-system\`._**

Design Systems are really complex and the key to a good Design System is
consistency.

It is hard to achieve a unique Brand Identity with a UI toolkit that is already build on top of another Design System (e.g. Material Design).
It is also hard to achieve consistency if you have to combine multiple UI libraries without forking
and customizing them to fit your Brand Identity.

_Over the years we discovered that it's much harder to maintain all of these forks for a project than
building our own set of components that are **100% customizable** because the code is 100% accessible._

This Design System is the next step, it is a blueprint that enables you to create your very own Design System that perfectly fits your
Brand or your clients Corporate Identity.

We are aware that not everyone has to implement their own professional Design System.
If this is the case for you, you might be interested in [integrating a 3rd party UI library](/docs/guide/third-party.html)
</vue-markdown>
`,
  })),
);

story = storiesOf('1. Design System|2. Branding', module) as any;

story.addParameters({ options: { showAddonPanel: false } });

story.add(
  '1. Color Palette',
  withInfo({
    header: false,
    source: false,
    propTables: false,
    styles: { propTableHead: { display: 'none' } },
    propTablesExclude: [VueMarkdown, ColorPalette],
  })(() => ({
    components: { VueMarkdown, ColorPalette },
    template: `<div>
<vue-markdown>
### Color Palette
</vue-markdown>
<color-palette />
</div>
`,
  })),
);

story.add(
  '2. Brand Colors',
  withInfo({
    header: false,
    source: false,
    propTables: false,
    styles: { propTableHead: { display: 'none' } },
    propTablesExclude: [VueMarkdown, BrandColors],
  })(() => ({
    components: { VueMarkdown, BrandColors },
    template: `<div>
<vue-markdown>
### Brand Colors
Every brand color is related to a color of the color palette.
</vue-markdown>
<brand-colors/>
</div>
`,
  })),
);

story = storiesOf('1. Design System|3. Typography', module) as any;

story.addParameters({ options: { showAddonPanel: false } });

story.add(
  'Typography',
  withInfo({
    header: false,
    source: false,
    propTables: false,
    styles: { propTableHead: { display: 'none' } },
    propTablesExclude: [VueMarkdown],
  })(() => ({
    components: { VueMarkdown },
    template: `<vue-markdown>
## Typography
Barlow is the standard type face for the Design System blueprint.

### Font Weights
Variable             | Weight
---------------------|-------
$font-weight-thin    | 100
$font-weight-regular | 300
$font-weight-medium  | 500
$font-weight-bold    | 700

### Font Sizes
Level          | Font-size   | Font-weight
---------------|-------------|------------
Small Text     | 80%         | $font-weight-regular
Paragraph      | 1.6rem      | $font-weight-regular
H1             | 4.8rem      | $font-weight-medium
H2             | 3.2rem      | $font-weight-medium
H3             | 2.4rem      | $font-weight-medium
H4             | 2rem        | $font-weight-medium
H5             | 1.6rem      | $font-weight-medium
H4             | 1.6rem      | $font-weight-bold

### Line heights
Line height is measured by taking the font size and adding 0.8rem. 

### List Style
Lists are indented by 8px with an additional 0.8rem between the bullet and content.
</vue-markdown>
`,
  })),
);

story = storiesOf('1. Design System|4. Layout', module) as any;

story.addParameters({ options: { showAddonPanel: false } });

story.add(
  'Layout',
  withInfo({
    header: false,
    source: false,
    propTables: false,
    styles: { propTableHead: { display: 'none' } },
    propTablesExclude: [VueMarkdown],
  })(() => ({
    components: { VueMarkdown },
    template: `<vue-markdown>
## Layout
The Grid-System is based on Flex box and comes in form of three included components.

Component     | Purpose
--------------|-------
VueGrid       | Container that is limited in the width, general page layout
VueGridRow    | Row that is always 100% width and will be stacked on the page
VueGridItem   | Item in the row that will be distributed equally on the page 

### Spacing
To keep the spacing consistent we have one variable \`$space-unit\` that is used for spacings,
you can multiply or divide this value as you want.
The default value in the blueprint is \`0.8rem\`.
</vue-markdown>
`,
  })),
);

story = storiesOf('1. Design System|5. Break points', module) as any;

story.addParameters({ options: { showAddonPanel: false } });

story.add(
  'Break points',
  withInfo({
    header: false,
    source: false,
    propTables: false,
    styles: { propTableHead: { display: 'none' } },
    propTablesExclude: [VueMarkdown],
  })(() => ({
    components: { VueMarkdown },
    template: `<vue-markdown>
## Break points
If you want to use a break point inside one of your components, we provide you width
mixins to keep everything consistent and to avoid unnecessary media definitions:

\`@include mediaMin(break-point-id)\`

\`@include mediaMax(break-point-id)\`

Break Point Id   | MinWidth | MaxWidth | GutterWidth
-----------------|----------|----------|------------
phone            | 320px    | 319px    | 3.2rem
tabletPortrait   | 768px    | 767px    | 3.2rem
tabletLandscape  | 1024px   | 1023px   | 3.2rem
smallDesktop     | 1280px   | 1279px   | 3.2rem
largeDesktop     | 1440px   | 1439px   | 3.2rem
</vue-markdown>
`,
  })),
);
