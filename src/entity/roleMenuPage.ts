import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Column,
} from 'typeorm';
import {Guild} from './guild';
import {RoleMenu} from './roleMenu';
import {RoleMenuPageRow} from './roleMenuPageRow';

@Entity()
export class RoleMenuPage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {length: 80})
  label!: string;

  @ManyToOne(() => RoleMenu, menu => menu.pages, {onDelete: 'CASCADE'})
  menu!: RoleMenu;

  // @ManyToOne(() => Guild, guild => guild.pages, {onDelete: 'CASCADE'})
  // guild!: Guild;

  @OneToMany(() => RoleMenuPageRow, row => row.page, {cascade: true})
  rows!: RoleMenuPageRow[];

  static queryPagesByMenuId(menuId: number) {
    return RoleMenuPage.getRepository()
      .createQueryBuilder('pages')
      .innerJoinAndSelect('pages.menu', 'parent')
      .where('parent.id = :id', {id: menuId});
  }

  // static queryPagesByGuildId(guildId: string) {
  //   return RoleMenuPage.getRepository()
  //     .createQueryBuilder('pages')
  //     .innerJoinAndSelect('pages.guild', 'parent')
  //     .where('parent.guildId = :id', {id: guildId});
  // }
}
