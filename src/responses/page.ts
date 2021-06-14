import {RoleMenuPage} from 'src/entity/roleMenuPage';
import {Response} from '.';
import {ErrorResponse} from './error';

export class PageResponse extends Response {
  constructor(public readonly menu: RoleMenuPage) {
    super('TBD', true);
  }

  // static menuList(menus: RoleMenu[]) {
  //   const formatted = menus.map(
  //     m => `:notepad_spiral: **${m.name}** (\`${m.id}\`)`
  //   );
  //   return new Response(formatted.join('\n'));
  // }

  static pageList(pages: RoleMenuPage[]) {
    const formatted = pages.map(
      p => `:notepad_spiral: **${p.label}** (\`${p.id}\`)`
    );

    return new Response(['Available Pages:', ...formatted].join('\n'));
  }

  static dne(id: number) {
    return new ErrorResponse(`Page \`${id}\` does not exist.`);
  }

  static diff(oldPage: RoleMenuPage, newPage: RoleMenuPage) {
    const changes = [];

    if (oldPage.label !== newPage.label) {
      changes.push(
        `:pencil: \`page.name\` \`|\` **${oldPage.label}** :arrow_right: **${newPage.label}**`
      );
    }

    if (oldPage.menu?.id !== newPage.menu?.id) {
      changes.push(
        `:pencil: \`page.menu.id\` \`|\` **${oldPage.menu.id}** :arrow_right: **${newPage.menu.id}**`
      );
    }

    return new Response(changes.join('\n'));
  }
}
