import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';
import {Guild} from './guild';
import {RoleMenuPage} from './roleMenuPage';

@Entity()
export class RoleMenu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Guild, guild => guild.guildId, {onDelete: 'CASCADE'})
  guild!: Guild;

  @OneToMany(() => RoleMenuPage, page => page.menu, {cascade: true})
  pages!: RoleMenuPage[];

  static guildMenuQuery(guildId: string) {
    return RoleMenu.getRepository()
      .createQueryBuilder('menus')
      .innerJoinAndSelect('menus.guild', 'parent')
      .where('parent.guildId = :guildId', {guildId});
  }
}
