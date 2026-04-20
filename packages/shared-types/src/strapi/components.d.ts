import type { Schema, Struct } from '@strapi/strapi';

export interface IdsBlocksAboutHero extends Struct.ComponentSchema {
  collectionName: 'components_ids_blocks_about_heroes';
  info: {
    displayName: 'about-hero';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface IdsBlocksStatItem extends Struct.ComponentSchema {
  collectionName: 'components_ids_blocks_stat_items';
  info: {
    displayName: 'stat-item';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface IdsBlocksStoryMedia extends Struct.ComponentSchema {
  collectionName: 'components_ids_blocks_story_medias';
  info: {
    displayName: 'story-media';
  };
  attributes: {
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface IdsBlocksStoryText extends Struct.ComponentSchema {
  collectionName: 'components_ids_blocks_story_texts';
  info: {
    displayName: 'story-text';
  };
  attributes: {
    body: Schema.Attribute.Blocks;
    heading: Schema.Attribute.String;
  };
}

export interface RhBlocksBenefit extends Struct.ComponentSchema {
  collectionName: 'components_rh_blocks_benefits';
  info: {
    displayName: 'benefit';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface RhBlocksCategoryItem extends Struct.ComponentSchema {
  collectionName: 'components_rh_blocks_category_items';
  info: {
    displayName: 'category-item';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavNavItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_nav_items';
  info: {
    description: 'Navigation item with optional nested children';
    displayName: 'nav-item';
  };
  attributes: {
    children: Schema.Attribute.JSON;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeoCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo_ctas';
  info: {
    description: 'Reusable CTA';
    displayName: 'cta';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary', 'text']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedSeoPageSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo_page_seos';
  info: {
    description: 'Reusable SEO fields';
    displayName: 'page-seo';
  };
  attributes: {
    canonical_url: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    og_image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'ids-blocks.about-hero': IdsBlocksAboutHero;
      'ids-blocks.stat-item': IdsBlocksStatItem;
      'ids-blocks.story-media': IdsBlocksStoryMedia;
      'ids-blocks.story-text': IdsBlocksStoryText;
      'rh-blocks.benefit': RhBlocksBenefit;
      'rh-blocks.category-item': RhBlocksCategoryItem;
      'shared-nav.nav-item': SharedNavNavItem;
      'shared-seo.cta': SharedSeoCta;
      'shared-seo.page-seo': SharedSeoPageSeo;
    }
  }
}
