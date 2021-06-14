import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import {RoleMenu} from './roleMenu';
import {RoleMenuPage} from './roleMenuPage';

@Entity()
export class Guild extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique: true})
  guildId!: string;

  @Column({default: false})
  blocked!: boolean;

  @OneToMany(() => RoleMenu, menu => menu.guild, {cascade: true})
  menus!: RoleMenu[];

  // @OneToMany(() => RoleMenuPage, page => page.guild, {cascade: true})
  // pages!: RoleMenuPage[];

  static findByGuildId(guildId: string): Promise<Guild | undefined> {
    return this.findOne({guildId});
  }

  static async getOrCreate(guildId: string): Promise<Guild> {
    return this.findOne({guildId}).then(g => {
      if (!g) {
        const newGuild = new this();
        newGuild.guildId = guildId;

        return newGuild.save();
      } else {
        return g;
      }
    });
  }
}
