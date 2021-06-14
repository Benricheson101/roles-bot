import {
  APIGuildInteraction,
  ApplicationCommandInteractionDataOptionInteger,
  ApplicationCommandInteractionDataOptionString,
  ApplicationCommandInteractionDataOptionSubCommandGroup,
  InteractionResponseType,
} from 'discord-api-types';
import {Guild} from 'src/entity/guild';
import {RoleMenu} from 'src/entity/roleMenu';
import {RoleMenuPage} from 'src/entity/roleMenuPage';
import {Response} from 'src/responses';
import {ErrorResponse} from 'src/responses/error';
import {MenuResponse} from 'src/responses/menu';
import {PageResponse} from 'src/responses/page';
import {SuccessResponse} from 'src/responses/success';
import {Command} from '.';

export const CONFIG_COMMAND: Command = {
  name: 'config',
  description: 'Configure a role menu',
  options: [
    {
      type: 2,
      name: 'menu',
      description: 'Configure a role menu',
      options: [
        {
          type: 1,
          name: 'new',
          description: 'Create a new role menu',
          options: [
            {
              type: 3,
              name: 'name',
              description: 'The name of the role menu',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'edit',
          description: 'Modify an existing menu',
          options: [
            {
              type: 4,
              name: 'id',
              description: 'The ID of the menu to modify',
              required: true,
            },
            {
              type: 3,
              name: 'rename',
              description: 'The new name of the menu',
            },
          ],
        },
        {
          type: 1,
          name: 'delete',
          description: 'Delete a menu',
          options: [
            {
              type: 4,
              name: 'id',
              description: 'The role menu to delete',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'list',
          description: 'List all configured role menus',
        },
      ],
    },
    {
      type: 2,
      name: 'page',
      description: 'Configure a role menu page',
      options: [
        {
          type: 1,
          name: 'new',
          description: 'Create a new role menu page',
          options: [
            {
              type: 3,
              name: 'name',
              description: 'The name of the page (80 char max)',
              required: true,
            },
            {
              type: 4,
              name: 'menu_id',
              description: 'The ID of the menu to add the page to',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'edit',
          description: 'Modify an existing role menu page',
          options: [
            {
              type: 4,
              name: 'id',
              description: 'The page to modify',
              required: true,
            },
            {
              type: 3,
              name: 'rename',
              description: 'The new name of the page',
            },
            // {
            //   type: 4,
            //   name: 'menu_id',
            //   description: 'The ID of the menu to move the page to',
            // },
          ],
        },
        {
          type: 1,
          name: 'delete',
          description: 'Delete a page',
          options: [
            {
              type: 4,
              name: 'id',
              description: 'The ID of the page to delete',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'list',
          description: 'List all configured pages for a menu',
          options: [
            {
              type: 4,
              name: 'menu_id',
              description: 'The ID of the menu to list pages of',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 2,
      name: 'row',
      description: 'Configure a menu row',
      options: [
        {
          type: 1,
          name: 'new',
          description: 'Create a new menu page row',
          options: [
            {
              type: 3,
              name: 'name',
              description: 'The name of the row',
              required: true,
            },
            {
              type: 3,
              name: 'layout',
              description: 'The layout to use (default: button)',
              choices: [
                {
                  name: 'button',
                  value: 'button',
                },
                {
                  name: 'dropdown',
                  value: 'dropdown',
                },
              ],
              required: true,
            },
            {
              type: 4,
              name: 'page_id',
              description: 'The ID of the page to add the row to',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'edit',
          description: 'Modify an existing row',
          options: [
            {
              type: 4,
              name: 'id',
              description: 'The ID of the row to modify',
              required: true,
            },
            {
              type: 3,
              name: 'rename',
              description: 'The new name of the row',
            },
            {
              type: 3,
              name: 'new_layout',
              description: 'Change the layout of the page',
              choices: [
                {
                  name: 'button',
                  value: 'button',
                },
                {
                  name: 'dropdown',
                  value: 'dropdown',
                },
              ],
            },
            {
              type: 4,
              name: 'page_id',
              description: 'The ID of the page to move the row to',
            },
          ],
        },
        {
          type: 1,
          name: 'delete',
          description: 'Delete a row',
          options: [
            {
              type: 4,
              name: 'id',
              description: 'The ID of the row to delete',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 2,
      name: 'role',
      description: 'Configure role menu roles',
      options: [
        {
          type: 1,
          name: 'add',
          description: 'Add a role to a role menu',
          options: [
            {
              type: 4,
              name: 'row_id',
              description: 'The ID of the row to add the role to',
              required: true,
            },
            {
              type: 8,
              name: 'role',
              description: 'The role to add',
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: 'remove',
          description: 'Remove a role from a role menu',
          options: [
            {
              type: 4,
              name: 'row_id',
              description: 'The ID of the role to remove the role from',
              required: true,
            },
            {
              type: 8,
              name: 'role',
              description: 'The role to remove',
              required: true,
            },
          ],
        },
      ],
    },
  ],

  async handler(req, res) {
    const i = req.body as APIGuildInteraction;

    const cmdGroup = i.data
      ?.options?.[0] as ApplicationCommandInteractionDataOptionSubCommandGroup;
    const subcmd = cmdGroup?.options?.[0];

    if (!cmdGroup || !subcmd) {
      return;
    }

    // TODO: make command json const so this can be typed correctly
    switch (cmdGroup.name) {
      case 'menu': {
        switch (subcmd.name) {
          case 'new': {
            // -- PARAMS --
            // REQUIRED:
            //   name:string

            const name = subcmd.options.find(
              o => o.name === 'name' && o.type === 3
            ) as ApplicationCommandInteractionDataOptionString;

            if (!name) {
              return;
            }

            const existingMenus = await RoleMenu.getRepository()
              .createQueryBuilder('menus')
              .innerJoinAndSelect('menus.guild', 'parent')
              .where('parent.guildId = :guildId', {guildId: i.guild_id})
              .getMany();

            if (
              existingMenus.some(
                m => m.name.toLowerCase() === name.value.toLowerCase()
              )
            ) {
              return new ErrorResponse(
                `You already have a menu named \`${name.value}\``
              );
            }

            const guild = await Guild.getOrCreate(i.guild_id);

            const newMenu = new RoleMenu();
            newMenu.name = name.value;

            if (guild.menus) {
              guild.menus.push(newMenu);
            } else {
              guild.menus = [newMenu];
            }

            const {menus} = await guild.save();

            return new SuccessResponse(
              `Created menu \`${menus[0].name}\` with ID \`${menus[0].id}\``
            );
          }

          // TODO: can i easily switch this to use name instead of ID?
          case 'edit': {
            // -- PARAMS --
            // REQUIRED:
            //   id:int
            // OPTIONAL:
            //   rename:string

            const id = subcmd.options.find(
              o => o.name === 'id' && o.type === 4
            ) as ApplicationCommandInteractionDataOptionInteger;

            if (!id) {
              return ErrorResponse.genericError();
            }

            const menu = await RoleMenu.getRepository()
              .createQueryBuilder('menus')
              .innerJoinAndSelect('menus.guild', 'parent')
              .where('parent.guildId = :guildId', {guildId: i.guild_id})
              .andWhere('menus.id = :id', {id: id.value})
              .getOne();

            if (!menu) {
              return MenuResponse.dne(id.value);
            }

            const rename = subcmd.options.find(
              o => o.name === 'rename' && o.type === 3
            ) as ApplicationCommandInteractionDataOptionString | undefined;

            if (!rename) {
              return new Response('Nothing was changed.');
            }

            const dupes = await RoleMenu.getRepository()
              .createQueryBuilder('menus')
              .innerJoinAndSelect('menus.guild', 'parent')
              .where('parent.guildId = :guildId', {guildId: i.guild_id})
              .andWhere('menus.name = :name', {name: rename.value})
              .getCount();

            if (dupes) {
              return new ErrorResponse(
                `This server already has a menu named \`${rename.value}\``
              );
            }

            const orig = {...menu};

            menu.name = rename.value;

            const saved = await menu.save();

            return MenuResponse.diff(orig as RoleMenu, saved);
          }

          case 'delete': {
            // -- PARAMS --
            // REQUIRED:
            //   id:int

            const id = subcmd.options.find(
              o => o.name === 'id' && o.type === 4
            ) as ApplicationCommandInteractionDataOptionInteger;

            if (!id) {
              return ErrorResponse.genericError();
            }

            const menu = await RoleMenu.getRepository()
              .createQueryBuilder('menus')
              .innerJoinAndSelect('menus.guild', 'parent')
              .where('parent.guildId = :guildId', {guildId: i.guild_id})
              .andWhere('menus.id = :id', {id: id.value})
              .getOne();

            if (!menu) {
              return MenuResponse.dne(id.value);
            }

            await menu.remove();

            return new SuccessResponse(`Deleted menu \`${id.value}\``);
          }

          case 'list': {
            // -- PARAMS --
            // NONE

            const menus = await RoleMenu.getRepository()
              .createQueryBuilder('menus')
              .innerJoinAndSelect('menus.guild', 'parent')
              .where('parent.guildId = :guildId', {guildId: i.guild_id})
              .getMany();

            return MenuResponse.menuList(menus);
          }
        }

        break;
      }

      case 'page': {
        switch (subcmd.name) {
          case 'new': {
            // -- PARAMS --
            // REQUIRED:
            //   name:string
            //   menu_id:int

            const name = subcmd.options.find(
              o => o.name === 'name' && o.type === 3
            ) as ApplicationCommandInteractionDataOptionString;
            const menuId = subcmd.options.find(
              o => o.name === 'menu_id' && o.type === 4
            ) as ApplicationCommandInteractionDataOptionInteger;

            if (!name || !menuId) {
              return ErrorResponse.genericError();
            }

            const menu = await RoleMenu.guildMenuQuery(i.guild_id)
              .andWhere('menus.id = :id', {id: menuId.value})
              .getOne();

            if (!menu) {
              return MenuResponse.dne(menuId.value);
            }

            const existingPages = await RoleMenuPage.queryPagesByMenuId(
              menuId.value
            )
              .andWhere('pages.label = :name', {name: name.value})
              .getCount();

            if (existingPages) {
              return new ErrorResponse(
                `You already have a page in this menu named \`${name.value}\``
              );
            }

            const newPage = new RoleMenuPage();
            newPage.label = name.value;
            newPage.menu = menu;

            const saved = await newPage.save();

            return new SuccessResponse(
              `Created page \`${saved.label}\` with ID \`${saved.id}\``
            );
          }

          case 'edit': {
            // -- PARAMS --
            // REQUIRED:
            //   id:int
            // OPTIONAL:
            //   rename:string
            //   menu_id:int

            const id = subcmd.options.find(
              o => o.name === 'id' && o.type === 4
            ) as ApplicationCommandInteractionDataOptionInteger;

            if (!id) {
              return ErrorResponse.genericError();
            }

            const page = await RoleMenuPage.findOne(id.value, {
              relations: ['menu', 'menu.guild'],
            });

            if (!page || page.menu.guild.guildId !== (i.guild_id as string)) {
              return PageResponse.dne(id.value);
            }

            const rename = subcmd.options.find(
              o => o.name === 'rename' && o.type === 3
            ) as ApplicationCommandInteractionDataOptionString | undefined;

            // const menuId = subcmd.options.find(
            //   o => o.name === 'menu_id' && o.type === 4
            // ) as ApplicationCommandInteractionDataOptionInteger | undefined;

            if (!rename) {
              return new Response('Nothing was changed.');
            }

            const orig = {...page} as RoleMenuPage;

            if (rename) {
              page.label = rename.value;
            }

            // TODO: why does this break??

            // if (menuId) {
            //   const newMenu = await RoleMenu.guildMenuQuery(i.guild_id)
            //     .andWhere('menus.id = :id', {id: menuId.value})
            //     .getOne();

            //   if (!newMenu) {
            //     return MenuResponse.dne(menuId.value);
            //   }

            //   // page.menu = newMenu;
            // }

            await page.save();

            return PageResponse.diff(orig, page);
          }

          case 'delete': {
            // -- PARAMS --
            // REQUIRED:
            //   id:int

            const id = subcmd.options.find(
              o => o.name === 'id' && o.type === 4
            ) as ApplicationCommandInteractionDataOptionInteger;

            if (!id) {
              return ErrorResponse.genericError();
            }

            const page = await RoleMenuPage.findOne(id.value, {
              relations: ['menu', 'menu.guild'],
            });

            if (!page || page.menu?.guild?.guildId !== (i.guild_id as string)) {
              return PageResponse.dne(id.value);
            }

            await page.remove();

            return new SuccessResponse(`Deleted page \`${id.value}\``);
          }

          case 'list': {
            // -- PARAMS --
            // menu_id:int

            const menuId = subcmd.options.find(
              o => o.name === 'menu_id' && o.type === 4
            ) as ApplicationCommandInteractionDataOptionInteger | undefined;

            if (!menuId) {
              return ErrorResponse.genericError();
            }

            const pages = await RoleMenuPage.getRepository()
              .createQueryBuilder('pages')
              .innerJoinAndSelect('pages.menu', 'menu')
              .innerJoinAndSelect('menu.guild', 'guild')
              .where('menu.id = :id', {id: menuId.value})
              .andWhere('guild.guildId = :guildId', {guildId: i.guild_id})
              .getMany();

            return PageResponse.pageList(pages);
          }
        }
        break;
      }
    }

    return res.status(200).json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'Pretend u dont see this',
        flags: 64,
      },
    });
  },
};
