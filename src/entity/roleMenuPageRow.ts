import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import {RoleMenuPage} from './roleMenuPage';
import {RoleMenuPageRowRole} from './roleMenuPageRowRole';

export enum RoleMenuPageRowLayout {
  DROPDOWN = 'dropdown',
  BUTTON = 'button',
}

@Entity()
export class RoleMenuPageRow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: RoleMenuPageRowLayout,
    default: RoleMenuPageRowLayout.BUTTON,
  })
  layout!: RoleMenuPageRowLayout;

  @ManyToOne(() => RoleMenuPage, page => page.menu, {onDelete: 'CASCADE'})
  page!: RoleMenuPage;

  @OneToMany(() => RoleMenuPageRowRole, role => role.row, {cascade: true})
  roles!: RoleMenuPageRowRole[];
}
