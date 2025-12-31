import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (!publicRole) {
      return;
    }

    const permissions = [
      "api::article.article.find",
      "api::article.article.findOne",
      "api::category.category.find",
      "api::category.category.findOne",
      "api::author.author.find",
      "api::author.author.findOne",
    ];

    await Promise.all(
      permissions.map(async (action) => {
        const permission = await strapi
          .query("plugin::users-permissions.permission")
          .findOne({
            where: {
              action,
              role: publicRole.id,
            },
          });

        if (!permission) {
          await strapi.query("plugin::users-permissions.permission").create({
            data: {
              action,
              role: publicRole.id,
            },
          });
        }
      })
    );
  },
};
