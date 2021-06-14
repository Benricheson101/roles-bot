import {RoleMenu} from 'src/entity/roleMenu';
import {Response} from '.';
import {ErrorResponse} from './error';

export class MenuResponse extends Response {
  constructor(public readonly menu: RoleMenu) {
    super('TBD', true);
  }

  static menuList(menus: RoleMenu[]) {
    const formatted = menus.map(
      m => `:notepad_spiral: **${m.name}** (\`${m.id}\`)`
    );
    return new Response(formatted.join('\n'));
  }

  static dne(id: number) {
    return new ErrorResponse(`Menu \`${id}\` does not exist.`);
  }

  static diff(oldMenu: RoleMenu, newMenu: RoleMenu) {
    const changes = [];

    if (oldMenu.name !== newMenu.name) {
      changes.push(
        `:pencil: \`menu.name\` \`|\` **${oldMenu.name}** :arrow_right: **${newMenu.name}**`
      );
    }

    return new Response(changes.join('\n'));
  }
}
